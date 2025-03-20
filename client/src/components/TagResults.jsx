import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function TagResults({
  tagResults,
  setTagResults,
  selectedMedium,
  setSelectedMedium,
  fetchPieces,
  pieces,
}) {
  const navigate = useNavigate();
  const imgSmallStyle = {
    maxWidth: "50%",
    maxHeight: "50%",
    borderRadius: "50%",
    textAlign: "center",
    margin: "auto",
    padding: "20px",
  };

  useEffect(() => {
    fetchPieces();
    setTagResults(
      pieces.filter((item) =>
        item.tags.some((tag) => tag.medium === selectedMedium)
      )
    );
  }, [pieces.length, selectedMedium]);

  function refreshTagResults(tag) {
    setSelectedMedium(tag.medium);
  }

  async function handleBack() {
    navigate("/");
  }

  return (
    <>
      <div>
        <h2>
          {" "}
          {selectedMedium[0].toUpperCase() +
            selectedMedium.slice(1)} pieces:{" "}
        </h2>
        <button onClick={handleBack}>Back To the Full Gallery</button>
       
      </div>
      <div className="article">
        {tagResults.map((filteredPiece) => {
          return (
            <div key={filteredPiece.id} className="single-card-view">
              <h3>{filteredPiece.title}</h3>
              <img
                style={imgSmallStyle}
                src={filteredPiece.image_url}
                alt={filteredPiece.title}
              />
              <p>Date: {filteredPiece.date.split("T")[0]} </p>
              <p>Description: {filteredPiece.description} </p>
              {filteredPiece.tags &&
                filteredPiece.tags.map((tag) => (
                  <button key={tag.id} onClick={() => refreshTagResults(tag)}>
                    {tag.medium}
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </>
  );
}
