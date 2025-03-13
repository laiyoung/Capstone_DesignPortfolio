import React from "react";
import SingleArtPiece from "./SingleArtPiece";
import NewArtPieceForm from "./NewArtPieceForm";

export default function AllArtPieces({
  pieces,
  setError,
  token,
}) {
  return (
    <>
      {token && (
        <div>
          {" "}
          <NewArtPieceForm
          />
        </div>
      )}

      <div className="article">
        {pieces.map((piece) => (
          <SingleArtPiece
            key={piece.id}
            pieceId={piece.id}
            piece={piece}
            setError={setError}
            token={token}
          />
        ))}
      </div>
    </>
  );
}
