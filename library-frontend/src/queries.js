import { gql } from "@apollo/client";

export const All_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      img
    }
  }
`;

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author
      published
      genres
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
      author
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
      born img
      booksByAuthor {
        title
        published
        genres
      }
    }
  }
`;
