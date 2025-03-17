import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TagResults({
  tagResults,
  setTagResults,
  selectedMedium,
  setSelectedMedium,
  fetchPieces,
  pieces
}) {
  const navigate = useNavigate();
  useEffect(() => {
    fetchPieces();
    setTagResults(pieces.filter((item) => (
       item.tags.some(tag => tag.medium === selectedMedium))));
  }, [pieces.length, selectedMedium]);

  // console.log(tagResults)

  async function handleBack() {
    navigate("/");
  }

  return (
    <div className="article">
      <h2> {selectedMedium[0].toUpperCase() + selectedMedium.slice(1)} art pieces: </h2>
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
