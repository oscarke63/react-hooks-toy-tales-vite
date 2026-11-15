import React, { useState, useEffect } from "react";

import Header from "./Header";
import ToyForm from "./ToyForm";
import ToyContainer from "./ToyContainer";

const URL = "http://localhost:3001/toys";

function App() {
  const [showForm, setShowForm] = useState(false);
  const [toys, setToys] = useState([]);

  // GET: when the page loads, fetch all toys and save them in state
  useEffect(() => {
    fetch(URL)
      .then((r) => r.json())
      .then((data) => setToys(data));
  }, []);

  // POST: when the form is submitted, create a toy and add it to state
  function handleAddToy(name, image) {
    fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name, image: image, likes: 0 }),
    })
      .then((r) => r.json())
      .then((newToy) => setToys([...toys, newToy]));
  }

  // PATCH: when Like is clicked, update the likes and replace that toy in state
  function handleLike(toy) {
    fetch(`${URL}/${toy.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ likes: toy.likes + 1 }),
    })
      .then((r) => r.json())
      .then((updatedToy) => {
        setToys(toys.map((t) => (t.id === updatedToy.id ? updatedToy : t)));
      });
  }

  // DELETE: when Donate is clicked, delete the toy and remove it from state
  function handleDelete(id) {
    fetch(`${URL}/${id}`, { method: "DELETE" }).then(() => {
      setToys(toys.filter((t) => t.id !== id));
    });
  }

  function handleClick() {
    setShowForm((showForm) => !showForm);
  }

  return (
    <>
      <Header />
      {showForm ? <ToyForm onAddToy={handleAddToy} /> : null}
      <div className="buttonContainer">
        <button onClick={handleClick}>Add a Toy</button>
      </div>
      <ToyContainer toys={toys} onLike={handleLike} onDelete={handleDelete} />
    </>
  );
}

export default App;
