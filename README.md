# University of Helsinki Full Stack Course: GraphQL Portion

This README covers the GraphQL portion of the University of Helsinki Full Stack Course. The topics covered include setting up a GraphQL server, working with schemas and queries, using Apollo Server, handling mutations and errors, and integrating GraphQL with a React frontend. Below is a breakdown of each topic and the corresponding exercises.

## Topics Covered

### a. GraphQL-server

#### Schemas and Queries
- **Schemas** define the structure of the data and the operations that can be performed on it.
- **Queries** are used to fetch data from the server.

#### Apollo Server
- A library used to set up a GraphQL server in Node.js.
- Provides tools for defining schemas, resolvers, and handling requests.

#### Apollo Studio Explorer
- A tool for testing and exploring GraphQL queries and mutations.

#### Parameters of a Resolver
- Resolvers are functions that resolve a value for a type or field in the schema.
- They can accept parameters: `parent`, `args`, `context`, and `info`.

#### The Default Resolver
- Automatically maps fields to properties in an object if no custom resolver is provided.

#### Object Within an Object
- Handling nested objects in GraphQL schemas and resolvers.

#### Mutations
- Used to modify data on the server.
- Example: Creating, updating, or deleting records.

#### Error Handling
- Techniques for handling and returning errors from resolvers.

#### Enum
- Enumerated types to define a set of allowed values for a field.

#### Changing a Phone Number
- An example mutation to update a phone number in the database.

#### More on Queries
- Advanced querying techniques and optimizations.

#### Exercises 8.1-8.7
- Practical exercises to apply the concepts learned in the above topics.

### b. React and GraphQL

- Integrating a React frontend with a GraphQL backend using Apollo Client.
- Writing queries and mutations in React components.
- Using hooks like `useQuery` and `useMutation` for data fetching and manipulation.

### c. Database and User Administration

- Connecting the GraphQL server to a database (e.g., MongoDB).
- Managing user data and authentication.
- Implementing user registration and login functionalities.

### d. Login and Updating the Cache

- Implementing login functionality using JWT (JSON Web Tokens).
- Updating the Apollo Client cache to reflect changes in the backend.
- Ensuring the UI remains consistent with the current state of the backend.

### e. Fragments and Subscriptions

#### Fragments
- Reusable units of GraphQL queries to avoid duplication.
- Example: Defining common fields for reuse in multiple queries or mutations.

#### Subscriptions
- Real-time updates from the server.
- Example: Subscribing to changes in data (e.g., new books added) and updating the UI accordingly.

## Example Code

### Setting Up Apollo Server

```javascript
onst start = async () => {
  const app = express();
  const httpServer = http.createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/",
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema: makeExecutableSchema({ typeDefs, resolvers }),
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.SECRET
          );
          const currentUser = await User.findById(decodedToken.id);
          return {
            currentUser,
            dataLoaders: {
              bookCountLoader,
            },
          };
        }
      },
    })
  );

  const PORT = 4000;

  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

start();


// Sample Query
query {
  allAuthors {
    name
    bookCount
  }
}

// Sample Mutation
mutation {
  addBook(
    title: "New Book",
    author: "Author Name",
    published: 2024,
    genres: ["fiction"]
  ) {
    title
    author {
      name
    }
  }
}

// Using Apollo Client in React
import { useQuery, useMutation, gql } from '@apollo/client';

const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
    }
  }
`;

const ADD_BOOK = gql`
  mutation addBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(title: $title, author: $author, published: $published, genres: $genres) {
      title
      author {
        name
      }
    }
  }
`;

const Books = ({ error, filter, setFilter }) => {
  const { data: user } = useQuery(GET_USER);
  const { data: genres } = useQuery(GET_ALL_GENRES);

  const { data: books, loading: bookLoading, error: bookError } = useQuery(GET_BOOKS_BY_GENRE, {
    variables: { genre: filter },
  });

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

```

## Conclusion

This section of the Full Stack course provides a comprehensive introduction to GraphQL, from setting up a server with Apollo Server to integrating it with a React frontend. By completing the exercises, you will gain practical experience in building and querying a GraphQL API, handling mutations, and managing real-time updates with subscriptions.
