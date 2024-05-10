
import { useQuery } from "@apollo/client"
import { GET_BOOK } from "../queries"
import { useParams } from "react-router-dom"


export default function Book() {
    const title = useParams().title
    const result = useQuery(GET_BOOK, {
        variables: { title }
    })

    if (result.loading) {
        return <div>loading...</div>
    }

    if (!result.data) {
      return <div>No such author</div>
    }

  return (
    <div className="book">
      <h2>{result.data.getBook.title}</h2>
      <p>Author: {result.data.getBook.author.name}</p>
      <p>Published: {result.data.getBook.published}</p>
      <p>Genres: {result.data.getBook.genres.join(", ")}</p>
    </div>
  )
}
