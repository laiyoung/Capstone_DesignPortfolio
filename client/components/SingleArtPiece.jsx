import React from "react";
import { deletePlayer } from "../api";
import { useState } from "react";

export default function SinglePlayer({ player, getData }) { 
  const [selectedPlayerId, setselectedPlayerId] = useState(null)
 
  async function handleDelete() {
    await deletePlayer(player.id);
    // location.reload();
    getData();
  }

  function handleDetails(){
    setselectedPlayerId(player.id)
    // console.log(player.id)
  }

  async function handleClose() {
    setselectedPlayerId(null);
  }


  return (
    selectedPlayerId ? 
    (
      <div className="single-card-view">
       <h3>{player.name}</h3>
       <img src={player.imageUrl} alt={player.name} />
       <p>Player ID: {player.id} </p>
       <p>Breed: {player.breed} </p>
       <p>Status: {player.status} </p>
       <button onClick={handleClose}>Close Details</button>
      </div>
    ) :
    (
      <div className="player-card">
      <h3>{player.name}</h3>
      <img src={player.imageUrl} alt={player.name} />
      <button onClick={handleDetails}>Player Details</button>
      <p>Player ID: {player.id} </p>
      <button onClick={handleDelete}>Delete</button>
    </div>
    )

  );

}
