import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AllArtPieces from "./components/AllArtPieces";
import TagResults from "./components/TagResults";
import Login from "./components/Login";
import EditArtDetailsForm from "./components/EditArtDetailsForm";
import Navigation from "./components/Navigation";
import CV from "./components/CV";
import AllProjects from "./components/Projects/AllProjects";
import MarkerResults from "./components/MarkerResults";
import {
  ProjectOne,
  ProjectTwo,
  ProjectThree,
  ProjectFour,
  ProjectFive,
  ProjectSix,
  ProjectSeven,
} from "./components/Projects/index.js";

/** API Link */
export const API_URL = `http://localhost:3000/api`;

function App() {
  const [error, setError] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [tagResults, setTagResults] = useState([]);
  const [selectedMedium, setSelectedMedium] = useState();
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState({});
  const [selectedMarker, setSelectedMarker] = useState();

  const navigate = useNavigate();

  async function fetchPieces() {
    const response = await fetch(`${API_URL}/pieces`);
    const allPieceData = await response.json();
    setPieces(allPieceData);
  }

  useEffect(() => {
    fetchPieces();
  }, [pieces.length]);

  // Resetting the token if it exist in local storage and you do a pg refresh
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

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
      <div className="titlebox">
        <div>
          <h1>Design Portfolio</h1>
          <h2>Laigha Young</h2>
        </div>
        <Navigation token={token} setToken={setToken} />
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
                admin={admin}
                setAdmin={setAdmin}
                tagResults={tagResults}
                setTagResults={setTagResults}
                setSelectedMedium={setSelectedMedium}
                selectedMedium={selectedMedium}
                fetchPieces={fetchPieces}
              />
            }
          />
          <Route
            path="/tag-results"
            element={
              <TagResults
                tagResults={tagResults}
                setTagResults={setTagResults}
                setSelectedMedium={setSelectedMedium}
                selectedMedium={selectedMedium}
                fetchPieces={fetchPieces}
                pieces={pieces}
                setPieces={setPieces}
              />
            }
          />
          <Route path="/marker-results" element={<MarkerResults />} />
          <Route
            path="/:id"
            element={
              <EditArtDetailsForm
                setError={setError}
                error={error}
                token={token}
                admin={admin}
                setAdmin={setAdmin}
              />
            }
          />
          <Route
            path="/login"
            element={<Login setToken={setToken} setAdmin={setAdmin} />}
          />
          <Route path="/cv" element={<CV />} />
          <Route
            path="/projects"
            element={
              <AllProjects
                setSelectedMarker={setSelectedMarker}
                selectedMarker={selectedMarker}
              />
            }
          />
          <Route path="/project-one" element={<ProjectOne />} />
          <Route path="/project-two" element={<ProjectTwo />} />
          <Route path="/project-three" element={<ProjectThree />} />
          <Route path="/project-four" element={<ProjectFour />} />
          <Route path="/project-five" element={<ProjectFive />} />
          <Route path="/project-six" element={<ProjectSix />} />
          <Route path="/project-seven" element={<ProjectSeven />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
