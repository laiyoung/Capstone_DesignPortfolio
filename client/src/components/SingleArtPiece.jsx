import React from "react";
import { useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

// import { deletePlayer } from "../api";

export default function SingleArtPiece({ piece, setError, pieceId, token }) {
  const [tagButtons, setTagButtons] = useState([]);
  const [selectedPieceId, setSelectedPieceId] = useState(null);

  const navigate = useNavigate();

  const imgSmallStyle = {
    maxWidth: "50%",
    maxHeight: "50%",
    borderRadius: "50%",
    textAlign: "center",
    margin: "auto",
    padding: "20px",
  };

  function handleDetails(pieceId) {
    async function getSingleArtPiece() {
      try {
        const response = await fetch(`${API_URL}/pieces/${pieceId}`);
        const result = await response.json();
        // console.log(result);
        setTagButtons(result.tags);
        setSelectedPieceId(result.id);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
    getSingleArtPiece();
  }
  // console.log(selectedPieceId);

  async function handleClose() {
    setSelectedPieceId(null);
  }

  async function handleDelete(pieceId) {
    try {
      await fetch(`${API_URL}/pieces/${pieceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  async function navToEditForm() {
    navigate(`/${selectedPieceId}`);
  }

  const date = piece.date.split("T")[0];

  return selectedPieceId ? (
    <div className="single-card-view">
      <h3>{piece.title}</h3>
      <img style={imgSmallStyle} src={piece.image_url} alt={piece.title} />
      <p>Date: {date} </p>
      <p>Description: {piece.description} </p>
      <p>Tags: </p>
      {tagButtons &&
        tagButtons.map((tag) => <button key={tag.id}>{tag.medium}</button>)}
      {token && (
        <div>
          <button onClick={handleDelete}> Delete </button>
          <button onClick={navToEditForm}> Edit Art Piece</button>
        </div>
      )}
      <button onClick={handleClose}>Close Details</button>
    </div>
  ) : (
    <div className="piece-card">
      <img src={piece.image_url} alt={piece.title} />
      <button onClick={() => handleDetails(pieceId)}>Art Piece Details</button>
    </div>
  );
}
