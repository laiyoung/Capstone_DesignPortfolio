import React from "react";

import { API_URL } from "../App";
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
