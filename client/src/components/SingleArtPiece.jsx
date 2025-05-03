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
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const imgSmallStyle = {
    maxWidth: "60%",
    maxHeight: "75%",
    borderRadius: "3em",
    display: "block",
    padding: "15px",
    marginRight: "15px",
    flexShrink: 1,
  };

  // Setting "Gallery Details" View:
  useEffect(() => {
    if (selectedPieceId) {
      // Scroll the pop-out container or window
      const details = document.querySelector(".single-card-view");
      if (details) {
        details.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [selectedPieceId]);

  // Skeleton loading delay for images:
  useEffect(() => {
    const timer = setTimeout(() => {
      setImageLoading(false);
      // Delay duration for fetch
    }, 2100);
    // Clear timeout if component unmounts
    return () => clearTimeout(timer);
  }, []);

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
      {imageLoading ? (
        <div className="skeleton" style={imgSmallStyle}></div>
      ) : (
        <img style={imgSmallStyle} src={piece.image_url} alt={piece.title} />
      )}
      <button
        style={{
          fontWeight: "bold",
          position: "absolute",
          right: "1em",
          top: "1em",
          zIndex: 10,
        }}
        onClick={handleClose}
      >
        &#x2715;
      </button>
      <div className="details">
        <h2
          style={{
            marginLeft: "auto",
            textAlign: "right",
            paddingRight: "3em",
          }}
        >
          {piece.title}
        </h2>
        <p style={{ fontWeight: "bold" }}>Date: </p>
        <p>{date}</p>
        <p style={{ fontWeight: "bold" }}>Description: </p>
        <p>{piece.description}</p>
        <p style={{ fontWeight: "bold" }}>Tags: </p>
        {tagButtons &&
          tagButtons.map((tag) => (
            <button
              className="dark-tag-buttons"
              style={{ marginBottom: "5px" }}
              key={tag.id}
              onClick={() => navToTagResults(tag)}
            >
              {tag.medium}
            </button>
          ))}
        {token && (
          <div style={{ margin: "10px" }}>
            <button
              className="admin-button"
              style={{ marginRight: "7px" }}
              onClick={handleDelete}
            >
              {" "}
              Delete{" "}
            </button>
            <button className="admin-button" onClick={navToEditForm}>
              {" "}
              Edit Art Piece
            </button>
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="piece-card">
      {imageLoading ? (
        <div className="skeleton"></div>
      ) : (
        <img src={piece.image_url} alt={piece.title} />
      )}
      <div className="cover">
        <button onClick={() => handleDetails(pieceId)}>
          Art Piece Details
        </button>
      </div>
    </div>
  );
}
