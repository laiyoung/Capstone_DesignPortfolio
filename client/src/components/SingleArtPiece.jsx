import React from "react";
import { useState, useEffect } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

export default function SingleArtPiece({
  piece,
  setError,
  pieceId,
  token,
  pieces,
  setSelectedMedium,
  fetchPieces,
}) {
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
  // console.log(pieceId);
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

  async function handleDelete() {
    try {
      // console.log(selectedPieceId);
      await fetch(`${API_URL}/pieces/${selectedPieceId}`, {
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
    fetchPieces();
  }

  function navToTagResults(tag) {
    setSelectedMedium(tag.medium);
    // console.log(medium);
    navigate("/tag-results");
  }
  // console.log(tagResults);

  async function navToEditForm() {
    navigate(`/${selectedPieceId}`);
  }

  const date = piece.date.split("T")[0];

  return selectedPieceId ? (
    <div lang="en" className="single-card-view">
      <h3 style={{ textAlign: "center" }}>{piece.title}</h3>
      <img style={imgSmallStyle} src={piece.image_url} alt={piece.title} />
      <p style={{ fontWeight: "bold" }}>Date: </p>
      <p>{date}</p>
      <p style={{ fontWeight: "bold" }}>Description: </p>
      <p>{piece.description}</p>
      <p style={{ fontWeight: "bold" }}>Tags: </p>
      {tagButtons &&
        tagButtons.map((tag) => (
          <button key={tag.id} onClick={() => navToTagResults(tag)}>
            {tag.medium}
          </button>
        ))}
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
      <div className="cover">
        <button onClick={() => handleDetails(pieceId)}>
          Art Piece Details
        </button>
      </div>
    </div>
  );
}
