import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TagResults({
  tagResults,
  setTagResults,
  medium,
  setMedium,
  fetchPieces,
  pieces
}) {
  const navigate = useNavigate();
  useEffect(() => {
    fetchPieces();
  }, [tagResults.length]);
  console.log(pieces)
  
  useEffect(() => {
    setTagResults(pieces.filter((piece) => piece.tags[medium] === medium));
  }, []);
  console.log(tagResults)

  async function handleBack() {
    navigate("/");
  }

  return (
    <div className="article">
      <h2> {medium[0].toUpperCase() + medium.slice(1)} art pieces: </h2>
      <button onClick={handleBack}>Back To the Full Gallery</button>
      {tagResults.map((filteredPiece) => {
        return (
          <div key={filteredPiece.id} className="single-card-view">
            <h3>{filteredPiece.title}</h3>
          </div>
        );
      })}
    </div>
  );
}
