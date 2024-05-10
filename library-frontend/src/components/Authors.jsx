import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import { Link, Outlet } from "react-router-dom";

/* eslint-disable react/prop-types */
const Authors = () => {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  return (
    <div className="authors">
      <div className="author-head">
        <h2>Authors</h2>
        <Link to="/authors/add-date" className="add-date">Edit Author</Link>
      </div>
      <table>
  <tbody>
    <tr>
      <th>Name</th>
      <th>Born</th>
      <th>Books</th>
    </tr>
    {authors.map((a) => (
      <tr key={a.name}>
        <td>
          <Link to={`/authors/${a.name}`}>{a.name}</Link>
        </td>
        <td>{a.born}</td>
        <td>{a.bookCount}</td>
      </tr>
    ))}
  </tbody>
</table>
      <Outlet />
    </div>
  );
};

export default Authors;
