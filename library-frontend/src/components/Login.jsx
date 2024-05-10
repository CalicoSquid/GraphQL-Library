/* eslint-disable react/prop-types */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ALL_AUTHORS, ALL_BOOKS, LOGIN } from "../queries";
import { useMutation } from "@apollo/client";

export default function Login({ setUser, error, setError }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate= useNavigate();

    const [login] = useMutation(LOGIN, {
        refetchQueries: [{ query: ALL_AUTHORS }, { query: ALL_BOOKS }],
        onError: (error) => {
          console.log("KKKKK", error);
        },
    })

    const handleError = (error) => {
      console.log(error);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 5000);
    }

  const handleLogin = async (event) => {
    event.preventDefault();
    const loggedUser = await login({ variables: { username, password } });
    console.log("loggedUser", loggedUser);
    if(loggedUser.data.login.value){
      setUser(loggedUser.data.login.user);
      localStorage.setItem("user", JSON.stringify(loggedUser.data.login.user));
      localStorage.setItem("token", loggedUser.data.login.value);
      setUsername("");
      setPassword("");
      navigate("/");
    } else {
      console.log("Login failed");
      handleError(loggedUser.errors);
    }
  };

  return (
    <div className="login">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <p>Sign in to application</p>
      <form onSubmit={(e) => handleLogin(e)}>
        <div>
          <label>Username:</label>
          <input type="text" 
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" 
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          required
          />
        </div>
        <div className="buttons">
          <button type="submit" className="confirm">
            Login
          </button>
          <button type="button" className="cancel">
            Cancel
          </button>
        </div>
      </form>
      <br/>
      <p>No Account yet? <Link to="/signup">Sign Up</Link></p>
    </div>
  );
}
