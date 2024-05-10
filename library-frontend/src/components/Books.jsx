/* eslint-disable react/prop-types */
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";
import { Link, Outlet } from "react-router-dom";

const Books = ({error}) => {

  const result = useQuery(ALL_BOOKS);

  if(result.loading) {
   return <div>loading...</div>
 }

  const books = result.data.allBooks;

  return (
    <div className="books">
      <div className="book-head">
      <h2>Books</h2>
      <Link to="/books/add" className="add-book">Add Book</Link>
      </div>
      
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td><Link to={`/books/${a.title}`}>{a.title}</Link></td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {error && <div className="error">{error}</div>}
      <Outlet />
    </div>
  )
}

export default Books
