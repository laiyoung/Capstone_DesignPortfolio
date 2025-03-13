import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../App";

export default function EditArtPieceForm({ setError, token }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [originalPiece, setOriginalPiece] = useState();
  // Updated Piece Starting Info:
  const [updatedPiece, setUpdatedPiece] = useState({});

  
 //GET Request for Original Piece:
  useEffect(() => {
    async function getSingleArtPiece() {
      try {
        const response = await fetch(`${API_URL}/pieces/${id}`);
        const result = await response.json();
        console.log(result);
        setOriginalPiece(result);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
    getSingleArtPiece(id);
  }, []);

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
    } catch (error) {
      console.error(error);
      setError(error);
    }
    event.target.reset();
  }

  async function handleClose() {
    navigate("/");
  }

  return (
    <>
    {/* <div className="single-card-view">
      <h3>{piece.title}</h3>
      <img style={imgSmallStyle} src={piece.image_url} alt={piece.title} />
      <p>Date: {date} </p>
      <p>Description: {piece.description} </p>
      <p>Tags: </p>
      {tags && tags.map((tag) => <button key={tag.id}>{tag.medium}</button>)}
    </div> */}
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label id="pieceTitle">Title:</label>
          <input
            type="text"
            name="title"
            // defaultValue={originalPiece.title}
            onChange={handleChange}
            required
          />
          <label id="pieceDate">Date:</label>
          <input
            type="text"
            name="Date"
            // defaultValue={originalPiece.date}
            onChange={handleChange}
          />
          <label> Picture: </label>
          <input
            type="text"
            name="image"
            // defaultValue={originalPiece.image_url}
            onChange={handleChange}
          />
          <label id="pieceDescription">Description:</label>
          <input
            type="text"
            name="Description"
            // defaultValue={originalPiece.description}
            onChange={handleChange}
          />
          <label> Tags: </label>
          <input
            type="text"
            name="tags"
            // defaultValue={originalPiece.tags}
            onChange={handleChange}
          />

          <button type="submit"> Change Art Piece </button>
        </form>
        <button onClick={handleClose}>Close Editing</button>
      </div>
    </>
  );
}
