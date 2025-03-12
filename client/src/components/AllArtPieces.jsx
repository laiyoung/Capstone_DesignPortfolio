import React from "react";
import SingleArtPiece from "./SingleArtPiece";
import NewArtPieceForm from "./NewArtPieceForm";
import { useEffect } from "react";

export default function AllArtPieces({
  pieces,
  setPieces,
  fetchPieces,
  setError,
}) {
  useEffect(() => {
    fetchPieces();
  }, []);
  console.log(pieces);
  return (
    <>
      <div>
        {" "}
        <NewArtPieceForm fetchPieces={fetchPieces} />
      </div>
      <div className="article">
        {pieces.map((piece) => (
          <SingleArtPiece
            key={piece.id}
            pieceId={piece.id}
            piece={piece}
            fetchPieces={fetchPieces}
            setError={setError}
          />
        ))}
      </div>
    </>
  );
}
