import React from 'react'; 
import { useState, useEffect } from "react";
import { Router, Routes, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import AllArtPieces from "./components/AllArtPieces";
import TagResults from "./components/TagResults";
import Login from "./components/Login";
import EditArtDetailsForm from "./components/EditArtDetailsForm";
import Navigation from "./components/Navigation";
import CV from "./components/CV";
import AllProjects from "./components/Projects/AllProjects";
import MarkerResults from "./components/MarkerResults.jsx";
import ScrollToTop from "./TopScrollRouterFunc.jsx";
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
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function App() {
  const [error, setError] = useState(null);
  const [pieces, setPieces] = useState([]);
  const [tagResults, setTagResults] = useState([]);
  const [selectedMedium, setSelectedMedium] = useState();
  const [token, setToken] = useState(null);
  const [admin, setAdmin] = useState({});
  const [selectedMarker, setSelectedMarker] = useState();
  const [markerResults, setMarkerResults] = useState([]);

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
        <ScrollToTop />
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
          <Route
            path="/marker-results"
            element={
              <MarkerResults
                markerResults={markerResults}
                setMarkerResults={setMarkerResults}
                selectedMarker={selectedMarker}
                setSelectedMarker={setSelectedMarker}
              />
            }
          />
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
          <Route
            path="/cv"
            element={<CV setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/projects"
            element={<AllProjects setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-one"
            element={<ProjectOne setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-two"
            element={<ProjectTwo setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-three"
            element={<ProjectThree setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-four"
            element={<ProjectFour setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-five"
            element={<ProjectFive setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-six"
            element={<ProjectSix setSelectedMarker={setSelectedMarker} />}
          />
          <Route
            path="/project-seven"
            element={<ProjectSeven setSelectedMarker={setSelectedMarker} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
