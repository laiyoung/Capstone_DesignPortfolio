import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../App";

export default function EditArtPieceForm({ setError, token, admin, setAdmin }) {

  const { id } = useParams();
  const navigate = useNavigate();
  const imgSmallStyle = {
    maxWidth: "50%",
    maxHeight: "50%",
    borderRadius: "50%",
    textAlign: "center",
    margin: "auto",
    padding: "20px",
  };
  const [tags, setTags] = useState([]);
  const [originalPiece, setOriginalPiece] = useState({});

  // Updated Piece Starting Info:
  const [updatedPiece, setUpdatedPiece] = useState({});

  //GET Request for Original Piece:
  useEffect(() => {
    async function getSingleArtPiece() {
      try {
        const response = await fetch(`${API_URL}/pieces/${id}`);
        const result = await response.json();
        // console.log(result);
        setOriginalPiece(result);
        setTags(result.tags);
        setAdmin(result.author);
      } catch (error) {
        console.error(error);
        setError(error);
      }
    }
    getSingleArtPiece(id);
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setUpdatedPiece((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // PATCH Request:
  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/pieces/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPiece),
      });

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
      setError(error);
    }
    event.target.reset();
  }

  async function handleClose() {
    navigate("/");
  }

  return (
    <>
      <div className="single-card-view">
        <h3>Title: {originalPiece.title}</h3>
        <img
          style={imgSmallStyle}
          src={originalPiece.image_url}
          alt={originalPiece.title}
        />
        <p>Date: {originalPiece.date} </p>
        <p>Description: {originalPiece.description} </p>
        <p>Tags: </p>
        {tags?.map((tag) => (
          <ul key={tag.id}>{tag.medium}</ul>
        ))}
        <p>Administrative Author: {admin.name} </p>
      </div>
      <div className="form">
        <form onSubmit={handleSubmit}>
          <label id="pieceTitle">Title:</label>
          <input
            type="text"
            name="title"
            defaultValue={originalPiece.title}
            onChange={handleChange}
            required
          />
          <label id="pieceDate">Date:</label>
          <input
            type="text"
            name="date"
            defaultValue={originalPiece.date}
            onChange={handleChange}
          />
          <label> Picture: </label>
          <input
            type="text"
            name="image_url"
            defaultValue={originalPiece.image_url}
            onChange={handleChange}
          />
          <label id="pieceDescription">Description:</label>
          <textarea
            type="text"
            rows="4"
            cols="125"
            name="description"
            defaultValue={originalPiece.description}
            onChange={handleChange}
          />
          <label> Tags: </label>
          <h5 style={{ padding: "1em" }}>
            Enter tags seperated by commas, followed by a space. Ex: digital,
            portrait{" "}
          </h5>
          <textarea
            type="text"
            name="tags"
            defaultValue={tags?.map((tag) => tag.medium).join(", ")}
            onChange={handleChange}
          />

          <button type="submit"> Change Art Piece </button>
        </form>
        <button onClick={handleClose}>Close Editing</button>
      </div>
    </>
  );
}
