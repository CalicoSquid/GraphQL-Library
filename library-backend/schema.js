const typeDefs = `

type Subscription {
    bookAdded: Book
}

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
    getBooksByGenre(genre: String!): [Book]
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

module.exports = typeDefs 