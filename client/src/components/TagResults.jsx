import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TagResults({ tagResults, setTagResults, medium, setMedium }) {
  
  const navigate = useNavigate();
  useEffect (() => {
    // setTagResults(pieces.filter((item) => item.tags[tag.id] === tag.id));
  })
 

  async function handleBack() {
    navigate("/");
  }

  return (
    <div className="article">
      <h2> {medium[0].toUpperCase() + medium.slice(1)} art pieces: </h2>
      {/* {tagResults.map((piece) => {
        return (
          <div key={piece.id} className="single-card-view">
            <h3>{piece.title}</h3>
          </div>
        );
      })} */}

      <button onClick={handleBack}>Back To the Full Gallery</button>
    </div>
  );
}
