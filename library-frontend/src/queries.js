import { gql } from "@apollo/client";

const BOOK_DETAILS = gql`
  fragment bookDetails on Book {
    title
    author {
      name
    }
    published
    genres
  }
`;

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...bookDetails
    }
  }
  ${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      img
      bookCount
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      author {
        name
      }
    }
  }
`;

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`;

export const ADD_BIRTH = gql`
  mutation editAuthor($name: String!, $born: Int!, $img: String) {
    editAuthor(name: $name, setBornTo: $born, img: $img) {
      name
      born
      img
    }
  }
`;

export const GET_AUTHOR = gql`
  query getAuthor($name: String!) {
    getAuthor(name: $name) {
      name
      bookCount
      born
      img
      booksByAuthor {
        title
        published
        genres
      }
    }
  }
`;

export const GET_BOOK = gql`
  query getBook($title: String!) {
    getBook(title: $title) {
      title
      published
      author {
        name
      }
      genres
    }
  }
`;

export const SIGNUP = gql`
  mutation createUser($username: String!, $password: String!, $favoriteGenre: String!) {
    createUser(username: $username, password: $password, favoriteGenre: $favoriteGenre) {
      username
      favoriteGenre
    }
  }
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
      user {
        username
        favoriteGenre
      }
    }
  }`

  export const GET_ALL_GENRES = gql`
  query {
    getAllGenres
  }
`

export const GET_USER = gql`
  query me {
    me {
      username
      favoriteGenre
      id
    }
  }
`

export const GET_BOOKS_BY_GENRE = gql`
  query getBooksByGenre($genre: String!) {
    getBooksByGenre(genre: $genre) {
      title
      published
      author {
        name
      }
      genres
    }
  }`
