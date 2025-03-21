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
    maxWidth: "75%",
    maxHeight: "75%",
    borderRadius: "3em",
    display: "block",
    textAlign: "center",
    margin: "auto",
    padding: "15px",
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
        <button onClick={handleBack}>Back To the Full Gallery</button>
        <h2 style={{ textDecorationLine: "underline", paddingLeft: "4em" }}>
          {" "}
          {selectedMedium[0].toUpperCase() +
            selectedMedium.slice(1)} pieces:{" "}
        </h2>
      </div>
      <div lang="en" className="article">
        {tagResults.map((filteredPiece) => {
          return (
            <div key={filteredPiece.id} className="editing-card-view">
              <h3>{filteredPiece.title}</h3>
              <img
                style={imgSmallStyle}
                src={filteredPiece.image_url}
                alt={filteredPiece.title}
              />
              <p>Date| {filteredPiece.date.split("T")[0]} </p>
              <p>Description| {filteredPiece.description} </p>
              {filteredPiece.tags &&
                filteredPiece.tags.map((tag) => (
                  <button
                    className="light-tag-buttons"
                    style={{ marginBottom: "7px" }}
                    key={tag.id}
                    onClick={() => refreshTagResults(tag)}
                  >
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
