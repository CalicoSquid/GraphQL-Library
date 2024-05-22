const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { GraphQLError } = require("graphql");
const { PubSub } = require("graphql-subscriptions");
const { bookCountLoader } = require('./dataLoaders');
const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({});
      return books.length;
    },
    authorCount: async () => {
      const authors = await Author.find({});
      return authors.length;
    },
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author");
      return books;
    },
    allAuthors: async (root, args) => {
      const authors = await Author.find({});
      return authors;
    },
    getAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name }).populate("booksByAuthor");

      if (!author) {
        return null;
      }

      const books = await author.booksByAuthor;

      const result = {
        ...author.toObject(),
        booksByAuthor: books,
        bookCount: books.length,
      };

      return result;
    },
    getBook: async (root, args) => {
      const book = await Book.findOne({ title: args.title }).populate("author");
      if (!book) {
        return null;
      }
      return book;
    },
    getAllGenres: async () => {
      const books = await Book.find({});
      const genres = books
        .map((book) => book.genres)
        .flat()
        .filter((genre, index, array) => array.indexOf(genre) === index);
      return genres;
    },
    getBooksByGenre: async (root, args) => {
      if (args.genre === "all") {
        const books = await Book.find({}).populate("author");
        return books;
      }
      const books = await Book.find({ genres: args.genre }).populate("author");
      return books;
    },
    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      let author;
      const existingAuthor = await Author.findOne({ name: args.author });
      if (!existingAuthor) {
        author = new Author({
          name: args.author,
          born: null,
          img: null,
          bookCount: 0,
          booksByAuthor: [],
        });
        await author.save();
      } else {
        author = existingAuthor;
      }

      try {
        const book = new Book({
          ...args,
          author: author._id,
        });

        const savedBook = await book.save();
        author.booksByAuthor.push(savedBook._id);
        author.bookCount = author.bookCount + 1;
        await author.save();
        await savedBook.populate("author");
        pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });
        return savedBook;
      } catch (error) {
        throw new GraphQLError("Saving book failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error: error.message,
          },
        });
      }
    },

    deleteBook: async (root, args) => {
      const deletedBook = await Book.findByIdAndDelete(args.id);
      if (!deletedBook) {
        return false;
      }
      return true;
    },

    deleteAllBooks: async () => {
      const deletedBooks = await Book.deleteMany({});
      if (!deletedBooks) {
        return false;
      }
      return true;
    },

    deleteAllAuthors: async () => {
      const deletedAuthors = await Author.deleteMany({});
      if (!deletedAuthors) {
        return false;
      }
      return true;
    },

    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
          },
        });
      }

      if (args.setBornTo || args.img) {
        try {
          const authorToEdit = await Author.findOneAndUpdate(
            { name: args.name },
            { born: args.setBornTo, img: args.img },
            { new: true }
          );

          if (!authorToEdit) {
            return null;
          }

          return authorToEdit;
        } catch (error) {
          console.log(error);
          throw new GraphQLError("Saving author failed", {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
            },
          });
        }
      }
    },

    createUser: async (root, args) => {
      const existingUser = await User.findOne({ username: args.username });
      if (existingUser) {
        throw new GraphQLError("User already exists", {
          extensions: {
            code: "USER_ALREADY_EXISTS",
          },
        });
      }

      if (!args.password) {
        throw new GraphQLError("Password is required", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
          },
        });
      }

      const user = new User({
        username: args.username,
        password: await bcrypt.hash(args.password, 10),
        favoriteGenre: args.favoriteGenre,
      });
      return user.save().catch((error) => {
        throw new GraphQLError("Creating user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });
      if (!user) {
        throw new GraphQLError("User not found", {
          extensions: {
            code: "USER_NOT_FOUND",
          },
        });
      }
      const valid = await bcrypt.compare(args.password, user.password);
      if (!valid) {
        throw new GraphQLError("Invalid password", {
          extensions: {
            code: "INVALID_PASSWORD",
          },
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.SECRET);
      return { value: token, user };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },

  Author: {
    bookCount: async (author, args, { dataLoaders }) => {
      return dataLoaders.bookCountLoader.load(author.id);
    },
  },
};

module.exports = resolvers;
