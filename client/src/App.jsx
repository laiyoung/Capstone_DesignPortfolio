import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import AllArtPieces from "./components/AllArtPieces";
import NewArtPieceForm from "./components/NewArtPieceForm";
import TagResults from "./components/TagResults";

function App() {
  const [error, setError] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [tagResults, setTagResults] = useState([]);

  async function fetchPieces() {
    const response = await fetch("/api/pieces");
    const allPieceData = await response.json();
    setPieces(allPieceData);
    console.log(allPieceData);
  }

  return (
    <>
      <header className="login">Login </header>
      <div>
        <h1>Design Portfolio</h1>
        <h2>Laigha Young</h2>
        <div>
          {" "}
          <NewArtPieceForm fetchPieces={fetchPieces} />
        </div>
        {error && <p>{error.error}</p>}
      </div>

      <div>
        <Routes>
          <Route
            path="/"
            element={
              <AllArtPieces
                pieces={pieces}
                setPieces={setPieces}
                fetchPieces={fetchPieces}
                setError={setError}
              />
            }
          />
          <Route
            path="/tag-results"
            element={
              <TagResults results={tagResults} setTagResults={setTagResults} />
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
