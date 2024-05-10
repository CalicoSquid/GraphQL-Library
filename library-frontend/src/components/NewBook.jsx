/* eslint-disable react/prop-types */
import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ADD_BOOK, ALL_AUTHORS, ALL_BOOKS } from "../queries";
import { useNavigate } from "react-router-dom";

const NewBook = ({ setError, token }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);
  const navigate = useNavigate();

  const [addBook] = useMutation(ADD_BOOK, {
    context: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    },
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      console.log("KKKKK", error);
    },
  });

  const submit = async (event) => {
    event.preventDefault();

    const book = await addBook({
      variables: {
        title,
        author,
        published: parseInt(published),
        genres,
      },
    });

    if (!book.data) {
      handleErrors(book.errors);
    } else {
      setTitle("");
      setPublished("");
      setAuthor("");
      setGenres([]);
      setGenre("");
      navigate("/books");
    }
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  const handleErrors = (error) => {
    console.log(error);
    setError(error.message);
    setTimeout(() => {
      setError(null);
    }, 5000);
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <b>Title</b>
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          <b>Author</b>
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          <b>Published</b>
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div className="genre-list">
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button" className="add-genre">
            Add genre
          </button>
        </div>
        <div className="genres">
          <h3>Genres:</h3> {genres.join(" ")}
        </div>
        <button type="submit" className="confirm">
          Create Book
        </button>
        <button
          type="button"
          className="cancel"
          onClick={() => navigate("/books")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default NewBook;
