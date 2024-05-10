import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import AddBirth from "./components/AddBirth";
import Author from "./components/Author";
import Book from "./components/Book";
import { useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import User from "./components/User";

const App = () => {
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("user");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      const token = window.localStorage.getItem("token");
      setToken(token);
      setUser(user);
    }
  }, []);

  return (
    <div className="container">
      <Nav user={user} setUser={setUser} setToken={setToken}/>
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
          <Route path="add-date" element={<AddBirth token={token} />} />
          <Route path=":name" element={<Author />} />
        </Route>
        <Route path="/books" element={<Books error={error} />}>
          <Route path="/books/add" element={<NewBook setError={setError} token={token} />} />
          <Route path=":title" element={<Book />} />
        </Route>
        <Route path="*" element={<h1>404</h1>} />
      </Routes>
    </div>
  );
};

export default App;
