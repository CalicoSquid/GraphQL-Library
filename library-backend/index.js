const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const { GraphQLError } = require("graphql");

mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
  console.log("connected to MongoDB");
});

const typeDefs = `

type Book {
    title: String!
    published: Int!
    author: Author
    genres: [String!]!
    id: ID!
}

type Author {
    name: String!
    born: Int
    bookCount: Int!
    booksByAuthor: [Book]
    img: String
}


type User {
    username: String!
    favoriteGenre: String!
    id: ID!
}

type Token {
  value: String
  user: User
}

type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre:String): [Book]!
    allAuthors: [Author]!
    getAuthor(name: String!): Author
    getBook(title: String!): Book
    getAllGenres: [String!]
    me: User
}

type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!, img: String): Author
    deleteBook(id: ID!): Boolean
    deleteAllBooks: Boolean
    deleteAllAuthors: Boolean
    createUser(username: String!, password: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
}
`;

const resolvers = {
  Query: {
    bookCount: async () => {
      const books = await Book.find({});
      return books.length;
    },
    authorCount: () => {
      const authors = Author.find({});
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
      const author = await Author.findOne({ name: args.name }).populate(
        "booksByAuthor"
      );

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
      console.log(args.title);
      const book = await Book.findOne({ title: args.title }).populate("author");
      console.log(book);
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
    }
  },

  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      console.log("KKKKK", currentUser);
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
      console.log(args);
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
      console.log(args);
      const user = await User.findOne({ username: args.username });
      console.log(user);
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
      return { value: token, user};
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.startsWith("Bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
