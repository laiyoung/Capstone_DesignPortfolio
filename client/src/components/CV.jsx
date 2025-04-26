import React from "react";
import { useEffect, useState } from "react";
import { API_URL } from "../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { projectsRoutes, markerTypeToClass } from "./Projects/index.js";

export default function CV({ setSelectedMarker }) {
  const [markers, setMarkers] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch(`${API_URL}/markers`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setMarkers(result.markers);
        // console.log(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchMarkers();
  }, []);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  return (
    <>
      <div>
        {" "}
        <Link to={""}>
          <button>CV in PDF Format</button>
        </Link>
        <h2 style={{ fontStyle: "italic", fontWeight: "bold" }}>
          Organizational Scientist
        </h2>
        <p>
          +1(404)384-0303 | l.d.young@outlook.com | Atlanta, GA, USA |{" "}
          <Link
            to={"https://www.linkedin.com/in/young-laigha/"}
            style={{ color: "#9497dd", onmouseover: "#432dbe" }}
          >
            LinkedIn
          </Link>{" "}
          |{" "}
          <Link
            to={"https://github.com/laiyoung"}
            style={{ color: "#9497dd", onmouseover: "#432dbe" }}
          >
            GitHub
          </Link>
        </p>
        <p>
          Organizational scientist and artist with over 5 years of experience in
          organizational and enterprise network research, developing expertise
          in social science research and sustainability ethics. Adept in
          collaboration infrastructure, participatory design research, and
          network research - trained at University College Cork. Motivated by
          opportunities to expand skills in process engineering and coding
          within the data science field to impact enterprise research.
        </p>
      </div>
      <div className="all-projects">
        <div className="project-card">
          <h2 style={{}}>Technical Skills</h2>
          <h3>
            <span
              style={{ fontWeight: "bold", textDecorationLine: "underline" }}
            >
              Currently Learning
            </span>
            : Full Stack Deployment Methods | Essentials of Generative AI |
            Python & R for Data Analytic
          </h3>
          <div>
            <h3 style={{ fontWeight: "bold" }}>Languages & Tools:</h3>
            {markers["Languages & Tools"]?.map((marker) => (
              <button
                className={`button ${markerTypeToClass[marker.type] || ""}`}
                style={{ marginBottom: "5px" }}
                key={marker.id}
                onClick={() => navToMarkerResults(marker)}
              >
                {marker.title}
              </button>
            ))}
            <h3 style={{ fontWeight: "bold" }}>Competencies:</h3>
            {markers["Competencies"]?.map((marker) => (
              <button
                className={`button ${markerTypeToClass[marker.type] || ""}`}
                style={{ marginBottom: "5px" }}
                key={marker.id}
                onClick={() => navToMarkerResults(marker)}
              >
                {marker.title}
              </button>
            ))}
            <h3 style={{ fontWeight: "bold" }}>
              Additional Critical Proficiencies:
            </h3>
            {markers["Additional Critical Proficiencies"]?.map((marker) => (
              <button
                className={`button ${markerTypeToClass[marker.type] || ""}`}
                style={{ marginBottom: "5px" }}
                key={marker.id}
                onClick={() => navToMarkerResults(marker)}
              >
                {marker.title}
              </button>
            ))}
          </div>
        </div>
        <div className="project-card">
        <h2 style={{}}>Technical Projects</h2>
        </div>

      </div>
    </>
  );
}
