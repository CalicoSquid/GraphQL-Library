import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="nav">
      <h1>Library</h1>
      <ul className="nav__links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/authors">Authors</Link></li>
        <li><Link to="/books">Books</Link></li>
      </ul>
    </nav>
  )
}
