import { Link } from "react-router-dom";
import books from "../../public/books.jpeg";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";
import avatar from "../../public/avatar.png";

export default function Home() {
  const result = useQuery(ALL_AUTHORS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  let featuredAuthor =
    result.data.allAuthors[
      Math.floor(Math.random() * result.data.allAuthors.length)
    ];

  if (!featuredAuthor) {
    featuredAuthor = {
      name: "Unknown",
      bookCount: 0,
      img: avatar,
    }
  }

  return (
    <div className="home">
      <div className="home-hero">
        <div className="home-txt">
          <h1>Library</h1>
          <p>Welcome to the library. Please browse through the books.</p>
        </div>
      </div>

      <div className="home-links">
        <img src={books} alt="library" className="hero"/>
        <div className="links">
          <div className="featured">
            <h3>Featured Author</h3>
            <img src={featuredAuthor.img ? featuredAuthor.img : avatar} alt={featuredAuthor.name} />
            <b>{featuredAuthor.name}</b>
            {featuredAuthor.born && <p>Born in {featuredAuthor.born}</p>}
            <p>
              {featuredAuthor.bookCount}{" "}
              {featuredAuthor.bookCount === 1 ? "book" : "books"} in Library
            </p>
          </div>
          <div className="button-links">
            <Link to="/books">Browse All Books</Link>
            <Link to="/authors">Browse All Authors</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
