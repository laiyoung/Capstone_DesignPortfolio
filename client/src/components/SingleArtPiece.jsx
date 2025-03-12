import React from "react";
import { useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

// import { deletePlayer } from "../api";

export default function SingleArtPiece({
  piece,
  setError,
  pieceId,
  token,
}) {
  const [selectedPieceId, setselectedPieceId] = useState(null);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  const imgSmallStyle = {
    maxWidth: "50%",
    maxHeight: "50%",
    borderRadius: "50%",
    textAlign: "center",
    margin: "auto",
    padding: "20px",
  };
  // async function handleDelete() {
  //   await deletePlayer(piece.id);
  //   // location.reload();
  //   fetchPieces();
  // }

  function handleDetails(pieceId) {
    async function getSingleArtPiece() {
      try {
        const response = await fetch(`${API_URL}/pieces/${pieceId}`);
        console.log(response);
        const result = await response.json();
        console.log(result);
        setTags(result.tags);
        return result;
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
    getSingleArtPiece();
    setselectedPieceId(piece.id);

    // console.log(piece.id)
  }
  // console.log (piece.tags.medium)
  async function handleClose() {
    setselectedPieceId(null);
  }

  async function handleDelete(pieceId) {
    try {
      await fetch(`${API_URL}/pieces/${pieceId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(error);
      setError(error);
    }
  }

  async function navToEditForm() {
    navigate("/:id");
  }

  return selectedPieceId ? (
    <div className="single-card-view">
      <h3>{piece.title}</h3>
      <img style={imgSmallStyle} src={piece.image_url} alt={piece.title} />
      <p>Date: {piece.date} </p>
      <p>Description: {piece.description} </p>
      <p>Tags: </p>
      {tags && tags.map((tag) => <button key={tag.id}>{tag.medium}</button>)}
      <button onClick={handleClose}>Close Details</button>
    </div>
  ) : (
    <div className="piece-card">
      <img src={piece.image_url} alt={piece.title} />
      <button onClick={() => handleDetails(pieceId)}>Art Piece Details</button>
      {token && (
        <div>
          <button onClick={handleDelete}> Delete </button>
          <button onClick={navToEditForm}> Edit Art Piece</button>
        </div>
      )}
    </div>
  );
}
