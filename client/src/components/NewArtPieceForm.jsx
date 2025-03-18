import React from "react";
import { useState, useEffect } from "react";
import { API_URL } from "../App";

export default function NewArtPieceForm({ token, admin, fetchPieces, pieces }) {
  const [newPiece, setNewPiece] = useState({
    author: admin,
    title: "",
    date: "",
    image_url: "",
    description: "",
    tags: [],
  });


  function handleChange(event) {
    const { name, value } = event.target;
    setNewPiece((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    newPiece.tags = newPiece.tags.split(", ");
    // console.log(newPiece.tags);
    try {
      const response = await fetch(`${API_URL}/pieces`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPiece),
      });

      const result = await response.json();
      // console.log(result);
      return result

    } catch (error) {
      console.error(error);
    } finally {
      fetchPieces();
      resetForm();
    }
  }
/** 
 * Unfortunately, event.target.reset() didn't work for this form. I think it's because the admin
 * identification is a fixed variable that doesn't reset, so when you try to rest the form
 * it fails. However, doing a manual reset of the useSate does work:
*/
  async function resetForm() {
    setNewPiece({
      author: admin,
      title: "",
      date: "",
      image_url: "",
      description: "",
      tags: [],
    });
  }

  return (
    <>
      <div className="new-piece-form">
        <form onSubmit={handleSubmit}>
          <label id="pieceTitle">Title:</label>
          <input
            type="text"
            name="title"
            value={newPiece.title}
            onChange={handleChange}
            required
          />
          <label id="pieceDate">Date:</label>
          <h5 style={{ padding: "1em" }}>
            Enter date using ISO-8601 formatting(YYYY-MM-DD).
          </h5>
          <input
            type="text"
            name="date"
            value={newPiece.date}
            onChange={handleChange}
          />
          <label> Image: </label>
          <input
            type="text"
            name="image_url"
            value={newPiece.image_url}
            onChange={handleChange}
          />
          <label id="pieceDescription">Description:</label>
          <textarea
            type="text"
            rows="4"
            cols="50"
            name="description"
            value={newPiece.description}
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
            value={newPiece.tags}
            onChange={handleChange}
          />
          <button type="submit"> Add New Art Piece </button>
        </form>
      </div>
    </>
  );
}
