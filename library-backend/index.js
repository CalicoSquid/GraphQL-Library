const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { v1: uuid } = require('uuid');

let authors = [
  {
    name: "Robert Martin",
    id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
    born: 1952,
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Robert_C._Martin_surrounded_by_computers.jpg/1200px-Robert_C._Martin_surrounded_by_computers.jpg"
  },
  {
    name: "Martin Fowler",
    id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
    born: 1963,
    img: "https://www.thoughtworks.com/content/dam/thoughtworks/images/photography/thoughtworker-profile/leaders/pro_martin_fowler.jpg"
  },
  {
    name: "Fyodor Dostoevsky",
    id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
    born: 1821,
    img: "https://cdn.britannica.com/45/181345-050-189BA6B8/Fyodor-Dostoyevsky-1876.jpg"
  },
  {
    name: "Joshua Kerievsky", // birthyear not known
    id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
    img: "https://m.media-amazon.com/images/S/amzn-author-media-prod/5m3disp59h6vjkkgdc2dcevkbr._SY600_.jpg"

  },
  {
    name: "Sandi Metz", // birthyear not known
    id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
    img: "https://images.squarespace-cdn.com/content/v1/537c0374e4b0f52ed92942e6/1480365148650-52LL1P7FKOFDPFC55AXH/DSC_4019.jpg"
  },
];

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design", "refactoring"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];


const typeDefs = `

type Book {
    title: String!
    published: Int!
    author: String!
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

type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre:String): [Book]!
    allAuthors: [Author]!
    getAuthor(name: String!): Author
}

type Mutation {
    addBook(title: String!, author: String!, published: Int!, genres: [String!]!): Book
    editAuthor(name: String!, setBornTo: Int!, img: String): Author
}
`;

const resolvers = {
  Query: {
    bookCount: () => books.length,
    authorCount: () => authors.length,
    allBooks: (root, args) => {
      return books.filter(book => 
        (!args.author || book.author === args.author) &&
        (!args.genre || book.genres.includes(args.genre))
      );
    },
    allAuthors: () => {
      const authorList = authors.map((a) => {
        const name = a.name;
        const born = a.born;
        const img = a.img;
        const bookCount = books.filter((b) => b.author === a.name).length;
        return { name, born, bookCount, img };
      });
      return authorList
    },
    getAuthor: (root, args) => {
      const author = authors.find(a => a.name === args.name)
      //console.log(author)
      const bookCount = books.filter(b => b.author === args.name).length
      const booksByAuthor = books.filter(b => b.author === args.name)
      console.log(booksByAuthor)
      if(!author) {
        return null
      }

      const x = {...author, bookCount, booksByAuthor}
      console.log(x)

      return x
    },
    
  },

  Mutation: {
    addBook: (root, args) => {
      const existingAuthor = authors.find(a => a.name === args.author)

      if(!existingAuthor) {
        authors.push({name: args.author, born: null})
      }
      const book = {...args, id: uuid()}
      books.push(book)
      return book
    },

    editAuthor: (root, args) => {
      if(args.setBornTo) {
        const authorToEdit = authors.find(a => a.name === args.name)
        if(!authorToEdit) {
          return null
        }
        authorToEdit.born = args.setBornTo
        authorToEdit.img = args.img
        return authorToEdit
      }
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
