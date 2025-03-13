import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AllArtPieces from "./components/AllArtPieces";
import TagResults from "./components/TagResults";
import Login from "./components/Login";
import EditArtDetailsForm from "./components/EditArtDetailsForm";

/** API Link */
export const API_URL = `http://localhost:3000/api`;

function App() {
  const [error, setError] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [tagResults, setTagResults] = useState([]);
  const [token, setToken] = useState();
 
  // const [admin, setAdmin] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPieces() {
      const response = await fetch(`${API_URL}/pieces`);
      const allPieceData = await response.json();
      setPieces(allPieceData);
      // console.log(allPieceData);
    }
    fetchPieces();
  }, [pieces.length]);

  async function handlelogOut() {
    navigate("/");
    setToken(null);
  }

  return (
    <>
      <header className="login">
        {!token ? (
          <Link to={"/login"}>Login</Link>
        ) : (
          <button onClick={handlelogOut}>Logout </button>
        )}
      </header>
      <div>{error && <p>{error.error}</p>}</div>
      <div>
        <h1>Design Portfolio</h1>
        <h2>Laigha Young</h2>
      </div>

      <div>
        <Routes>
          <Route
            path="/"
            element={
              <AllArtPieces
                pieces={pieces}
                setPieces={setPieces}
                setError={setError}
                error={error}
                token={token}
              />
            }
          />
          <Route
            path="/tag-results"
            element={
              <TagResults results={tagResults} setTagResults={setTagResults} />
            }
          />
          <Route
            path="/:id"
            element={
              <EditArtDetailsForm
                setError={setError}
                error={error}
                token={token}
              />
            }
          />
          <Route path="/login" element={<Login setToken={setToken} />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
