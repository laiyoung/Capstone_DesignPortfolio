import React from "react";
import { useState } from "react";
import { addPlayer } from "../api";

export default function NewPlayerForm({getData}) {
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    breed: "",
    image: "",
  });
  // console.log(newPlayer);

  function handleChange(event) {
    const { name, value } = event.target;
    setNewPlayer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const response = await addPlayer(newPlayer);
    setNewPlayer(await response);
    // location.reload();
    getData();
    event.target.reset();
  }

  return (
    <>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label id="playerName">Name:</label>
          <input
            type="text"
            name="name"
            defaultValue={newPlayer.name}
            onChange={handleChange}
            placeholder="New Puppy's Name"
            required
          />
          <label id="playerBreed">Puppy Breed:</label>
          <input
            type="text"
            name="breed"
            defaultValue={newPlayer.breed}
            onChange={handleChange}
            placeholder="What breed is your puppy?"
          />
          <label> Picture: </label>
          <input
            type="text"
            name="image"
            defaultValue={newPlayer.image}
            onChange={handleChange}
            placeholder="Image URL"
          />
         <button type="submit"> Add New Puppy </button>

        </form>
      </div>
    </>
  );
}
