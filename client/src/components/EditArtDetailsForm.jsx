import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditArtPieceForm({
  setError,
  selectedPieceId,
  setSelectedPieceId,
  token,
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  //GET Request:
   useEffect(() => {
   async function getSingleArtPiece() {
        try {
          const response = await fetch(`${API_URL}/pieces/${id}`);
          console.log(response);
          const result = await response.json();
          console.log(result);
          return result;
        } catch (error) {
          console.error(error);
          setError(error);
        }
        setSelectedPieceId(piece.id);
      }
      getSingleArtPiece(id);
    }, []);
  
  
  // Updated Piece Info:
  const [updatedPiece, setUpdatedPiece] = useState({
    title: "",
    date: "",
    image_url: "",
    description: "",
    tags: [],
  });
  // console.log(newPlayer);

  function handleChange(event) {
    const { name, value } = event.target;
    setUpdatedPiece((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // PATCH Request:
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pieces/${selectedPieceId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPiece),
      });

      const result = await response.json();
      console.log(result);
      navigate("/");
    } catch (error) {
      console.error(error);
      setError(error);
    }
    event.target.reset();
  }

  return (
    <>
      <div className="new-piece-form">
        <form onSubmit={handleSubmit}>
          <label id="playerName">Title:</label>
          <input
            type="text"
            name="name"
            defaultValue={newPlayer.name}
            onChange={handleChange}
            placeholder="New Puppy's Name"
            required
          />
          <label id="playerBreed">Description:</label>
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
          <button type="submit"> Add New Art Piece </button>
        </form>
      </div>
    </>
  );
}
