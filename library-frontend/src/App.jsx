import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useQuery, useSubscription } from "@apollo/client";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Home from "./components/Home";
import Nav from "./components/Nav";
import AddBirth from "./components/AddBirth";
import Author from "./components/Author";
import Book from "./components/Book";
import Login from "./components/Login";
import Signup from "./components/Signup";
import User from "./components/User";
import { ALL_BOOKS, BOOK_ADDED, GET_BOOKS_BY_GENRE } from "./queries";
import {client} from "./main";

const App = () => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("all");

  const { loading, error: queryError } = useQuery(ALL_BOOKS);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  useSubscription(BOOK_ADDED, {
    onData: ({ data: subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded;
      console.log(newBook)
      alert(`${newBook.title} added`);

      // Update cache for ALL_BOOKS
      client.cache.updateQuery({ query: ALL_BOOKS }, (existingBooks) => {
        if (!existingBooks) {
          return { allBooks: [newBook] };
        }
        return {
          ...existingBooks,
          allBooks: [...existingBooks.allBooks, newBook]
        };
      });

      // Update cache for GET_BOOKS_BY_GENRE if the new book's genre matches the current filter
      client.cache.updateQuery(
        { query: GET_BOOKS_BY_GENRE, variables: { genre: newBook.genre } },
        (existingBooksByGenre) => {
          if (!existingBooksByGenre) {
            return { getBooksByGenre: [newBook] };
          }
          return {
            ...existingBooksByGenre,
            getBooksByGenre: [...existingBooksByGenre.getBooksByGenre, newBook]
          };
        }
      );
    }
  });

  if (loading) return <p>Loading...</p>;
  if (queryError) return <p>Error: {queryError.message}</p>;

  return (
    <div className="container">
      <Nav user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="login"
          element={
            <Login
              user={user}
              setUser={setUser}
              error={error}
              setError={setError}
            />
          }
        />
        <Route
          path="signup"
          element={<Signup error={error} setError={setError} />}
        />
        <Route path="/user" element={<User user={user} />} />
        <Route path="/authors" element={<Authors />}>
          <Route path="add-date" element={<AddBirth />} />
          <Route path=":name" element={<Author />} />
        </Route>
        <Route
          path="/books"
          element={
            <Books
              error={error}
              setError={setError}
              filter={filter}
              setFilter={setFilter}
            />
          }
        >
          <Route
            path="/books/add"
            element={<NewBook setError={setError} filter={filter} />}
          />
          <Route path=":title" element={<Book />} />
        </Route>
        <Route path="*" element={<h1>404 Page not found</h1>} />
      </Routes>
    </div>
  );
};

export default App;
