/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, GET_ALL_GENRES, SIGNUP } from "../queries";

export default function Signup({ error, setError }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");
  const navigate = useNavigate();

  const [signup] = useMutation(SIGNUP, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
    onError: (error) => {
      console.log( error);
    },
  });

  const handleError = (error) => {
    setError(error.message);
    setTimeout(() => {
      setError(null);
    }, 5000);

  }

  const result =  useQuery(GET_ALL_GENRES, {
    onError: (error) => {
      console.log(error);
    },
  });

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const genreList = result.data.getAllGenres ? result.data.getAllGenres : [""];

  const handleSignup = async (event) => {
    event.preventDefault();
    const newUser = await signup({ variables: { username, password, favoriteGenre } });
    if (newUser.data) {
      setUsername("");
      setPassword("");
      navigate("/login");
    } else {
      console.log("Signup failed");
      handleError(newUser.errors);
    }
  };

  return (
    <div className="signup">
      <h1>Join us.</h1>
      {error && <p className="error">{error}</p>}
      <p>Sign up here</p>
      <form onSubmit={(e) => handleSignup(e)}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        <div>
          <label>Select Your Favorite Genre</label>
          <select value={favoriteGenre} onChange={(e) => setFavoriteGenre(e.target.value)}>
            {genreList.map((genre) => (
              <option key={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div className="buttons">
          <button type="submit" className="confirm">
            Create
          </button>
          <button type="button" className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <br />
      <p>
        <Link to="/login">Back To Log In</Link>
      </p>
    </div>
  );
}
