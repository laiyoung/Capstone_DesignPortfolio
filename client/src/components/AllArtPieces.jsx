import React from "react";
import SingleArtPiece from "./SingleArtPiece";
import { useEffect } from "react";

export default function AllArtPieces({ pieces, setPieces, fetchPieces }) {
  useEffect(() => {
    fetchPieces();
  }, []);

  return (
    <div className="article">
      {pieces.map((piece) => {
        return (
          <SingleArtPiece
            key={piece.id}
            piece={piece}
            fetchPieces={fetchPieces}
            setError={setError}
          />
        );
      })}
    </div>
  );
}
