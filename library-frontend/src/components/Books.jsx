/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { GET_ALL_GENRES, GET_BOOKS_BY_GENRE, GET_USER } from "../queries";
import { Link, Outlet } from "react-router-dom";
import Filter from "./Filter";

const Books = ({ error, filter, setFilter }) => {
  

  const { data: user } = useQuery(GET_USER);
  const { data: genres } = useQuery(GET_ALL_GENRES);

  const {
    data: books,
    loading: bookLoading,
    error: bookError,
  } = useQuery(GET_BOOKS_BY_GENRE, { variables: { genre: filter } });

  const genreList = genres?.getAllGenres || [];
  const currentUser = user?.me || null;
  const filteredBooks = books?.getBooksByGenre || [];

  if (bookLoading) {
    return <div>Loading...</div>;
  }

  if (bookError) {
    return <div>{bookError.message}</div>;
  }

  return (
    <div className="books">
      <div className="book-head">
        <h2>Books</h2>
        <Filter
          filter={filter}
          setFilter={setFilter}
          currentUser={currentUser}
          genreList={genreList}
        />
        {currentUser && (
          <Link to="/books/add" className="add-book">
            Add Book
          </Link>
        )}
      </div>

      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((a) => (
            <tr key={a.title}>
              <td>
                <Link to={`/books/${a.title}`}>{a.title}</Link>
              </td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="error">{error}</div>}
      <Outlet />
    </div>
  );
};

export default Books;
