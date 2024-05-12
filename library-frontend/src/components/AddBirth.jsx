/* eslint-disable react/prop-types */
import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ADD_BIRTH, ALL_AUTHORS, GET_AUTHOR } from "../queries";
import { useNavigate } from "react-router-dom";

export default function AddBirth() {
  const [born, setBorn] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const navigate = useNavigate();

  const [addBirth] = useMutation(ADD_BIRTH, {
    refetchQueries: [{ query: ALL_AUTHORS }, { query: GET_AUTHOR, variables: { name } }],
    onError: (error) => {
      console.log(error);
    },
  });

  const result = useQuery(ALL_AUTHORS);
  const authors = result.data.allAuthors;

  const submit = (e) => {
    e.preventDefault();

    addBirth({
      variables: {
        name: name,
        born: Number(born),
        img: image,
      },
    });
    navigate(`/authors/${name}`);
  };

  const selectList = authors.map((a) => <option key={a.name}>{a.name}</option>);

  return (
    <form onSubmit={(e) => submit(e)} className="add-birth">
      <div>
        <b>Author</b>
        <select
          type="text"
          required
          value={name}
          onChange={({ target }) => setName(target.value)}
        >
          <option value="" disabled>Select author</option>
          {selectList}
        </select>
      </div>
      <div>
        <b>Born</b>
        <input
          type="number"
          required
          value={born}
          onChange={({ target }) => setBorn(target.value)}
          placeholder="YYYY"
        />
      </div>
      <div>
        <b>Profile Picture</b>
        <input
          type="text"
          value={image}
          onChange={({ target }) => setImage(target.value)}
          placeholder="URL"
        />
      </div>
      <button type="submit" className="confirm">
        Edit
      </button>
      <button
        type="button"
        className="cancel"
        onClick={() => navigate("/authors")}
      >
        Cancel
      </button>
    </form>
  );
}
