import { useQuery } from "@apollo/client";
import { ALL_AUTHORS, GET_USER } from "../queries";
import { Link, Outlet } from "react-router-dom";

/* eslint-disable react/prop-types */
const Authors = () => {
  const { data: authors, loading, error } = useQuery(ALL_AUTHORS);
  const { data: user } = useQuery(GET_USER);

  if (loading) {
    return <div>loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  const authorList = authors?.allAuthors || [];
  const currentUser = user?.me || null;

  return (
    <div className="authors">
      <div className="author-head">
        <h2>Authors</h2>
        {currentUser && (
          <Link to="/authors/add-date" className="add-date">
            Edit Author
          </Link>
        )}
      </div>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authorList.map((a) => (
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
