import React from "react";
import SingleArtPiece from "./SingleArtPiece";
import NewArtPieceForm from "./NewArtPieceForm";

export default function AllArtPieces({
  pieces,
  setError,
  token,
  admin,
  setAdmin,
}) {
  return (
    <>
      {token && (
        <div>
          {" "}
          <NewArtPieceForm token={token} admin={admin} setAdmin={setAdmin} />
        </div>
      )}

      <div className="article">
        {pieces.map((piece) => (
          <SingleArtPiece
            pieces={pieces}
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
