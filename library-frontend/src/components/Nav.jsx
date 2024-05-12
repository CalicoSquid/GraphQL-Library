/* eslint-disable react/prop-types */
import { useApolloClient } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
export default function Nav({ user, setUser}) {
  const navigate = useNavigate();
  const client = useApolloClient();
  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    client.resetStore();
    navigate("/login");
  };
  
  return (
    <nav className="nav">
      <h1>Library</h1>
      <ul className="nav__links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/authors">Authors</Link>
        </li>
        <li>
          <Link to="/books">Books</Link>
        </li>
        {user && (
          <li>
            <Link to="/user">User</Link>
          </li>
        )}
        {user ? (
          <li className="welcome">
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <button onClick={() => navigate("/login")}>Login</button>
          </li>
        )}
      </ul>
    </nav>
  );
}
