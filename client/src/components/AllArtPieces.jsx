import React from "react";
import { useEffect } from "react";
import SingleArtPiece from "./SingleArtPiece";
import NewArtPieceForm from "./NewArtPieceForm";

export default function AllArtPieces({
  pieces,
  setError,
  token,
  admin,
  setAdmin,
  setSelectedMedium,
  fetchPieces,
}) {
  useEffect(() => {
    fetchPieces();
  }, []);

  return (
    <>
      {token && (
        <div>
          {" "}
          <NewArtPieceForm
            token={token}
            admin={admin}
            setAdmin={setAdmin}
            pieces={pieces}
            fetchPieces={fetchPieces}
          />
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
            setSelectedMedium={setSelectedMedium}
            fetchPieces={fetchPieces}
          />
        ))}
      </div>
    </>
  );
}
