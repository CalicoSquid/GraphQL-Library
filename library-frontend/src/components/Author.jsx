import { useParams } from "react-router-dom"
import { GET_AUTHOR } from "../queries"
import { useQuery } from "@apollo/client"
import avatar from "../../public/avatar.png";


export default function Author() {
    const name = useParams().name

    const result = useQuery(GET_AUTHOR, {
        variables: { name }
    })

    if (result.loading) {
        return <div>loading...</div>
    }

    const author = result.data.getAuthor
    const bookList = author.booksByAuthor.map((b) => <li key={b.title}>{b.title}</li>)

    
  return (
    <div className="author-card">
      <img src={author.img ? author.img : avatar} alt={author.name} />
      <h2>{author.name}</h2>
      {author.born && <p>Born {author.born}</p>}
      <p>Added Books: {author.bookCount}</p>
      <div className="book-list">
        <h3>Books</h3>
        <ul>{bookList}</ul>
      </div>
    </div>
  )
}
