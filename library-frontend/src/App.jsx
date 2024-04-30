import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Nav from "./components/Nav";
import AddBirth from "./components/AddBirth";
import Author from "./components/Author";

const App = () => {
  return (
    <div className="container">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/authors" element={<Authors />} >
          <Route path="add-date" element={<AddBirth />} />
          <Route path=":name" element={<Author />} />
        </Route>
        <Route path="/books" element={<Books />}>
          <Route path="/books/add" element={<NewBook />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
