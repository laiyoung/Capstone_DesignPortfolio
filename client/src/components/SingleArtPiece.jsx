import React from "react";
import { useState } from "react";

// import { deletePlayer } from "../api";

export default function SingleArtPiece({ piece, fetchPieces, setError }) {
  const [selectedPieceId, setselectedPieceId] = useState(null);

  async function handleDelete() {
    await deletePlayer(piece.id);
    // location.reload();
    fetchPieces();
  }

  function handleDetails() {
    async function getSingleArtPiece(pieceId) {
      try {
        const response = await fetch("api/:pieceId");
        const result = await response.json();
        return result.piece;
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
    getSingleArtPiece(pieceId);
    setselectedPieceId(piece.id);
    // console.log(player.id)
  }

  async function handleClose() {
    setselectedPlayerId(null);
  }

  return selectedPieceId ? (
    <div className="single-card-view">
      <h3>{player.name}</h3>
      <img src={player.imageUrl} alt={player.name} />
      <p>Player ID: {player.id} </p>
      <p>Breed: {player.breed} </p>
      <p>Status: {player.status} </p>
      <button onClick={handleClose}>Close Details</button>
    </div>
  ) : (
    <div className="player-card">
      <h3>{player.name}</h3>
      <img src={player.imageUrl} alt={player.name} />
      <button onClick={handleDetails}>Player Details</button>
      <p>Player ID: {player.id} </p>
      <button onClick={handleDelete}>Delete</button>
      <div>
        {/* {!auth.id ? (
          <Login login={login} register={register} error={error} />
        ) : (
          <button onClick={logout}>Logout {auth.username}</button>
        )} */}
      </div>
    </div>
  );
}
