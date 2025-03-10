import React from "react";
import { useState } from "react";

// import { deletePlayer } from "../api";

export default function SingleArtPiece({ piece, fetchPieces, setError }) {
  const [selectedPieceId, setselectedPieceId] = useState(null);

  // async function handleDelete() {
  //   await deletePlayer(piece.id);
  //   // location.reload();
  //   fetchPieces();
  // }

  function handleDetails() {
    async function getSingleArtPiece(pieceId) {
      try {
        const response = await fetch(`/api/pieces/${pieceId}`);
        const result = await response.json();
        return result.piece;
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
    getSingleArtPiece();
    setselectedPieceId(piece.id);
    // console.log(player.id)
  }

  async function handleClose() {
    setselectedPieceId(null);
  }

  return selectedPieceId ? (
    <div className="single-card-view">
      <h3>{piece.title}</h3>
      <img src={piece.image_url} alt={piece.title} />
      <p>Date: {piece.date} </p>
      <p>Description: {player.description} </p>
      <p>Tags: {player.tags} </p>
      <button onClick={handleClose}>Close Details</button>
    </div>
  ) : (
    <div className="piece-card">
      <img src={piece.image_url} alt={piece.title} />
      <button onClick={handleDetails}>Art Piece Details</button>
      <div>
         {/* <button onClick={handleDelete}>Delete</button> */}
        {/* {!auth.id ? (
          <Login login={login} register={register} error={error} />
        ) : (
          <button onClick={logout}>Logout {auth.username}</button>
        )} */}
      </div>
    </div>
  );
}
