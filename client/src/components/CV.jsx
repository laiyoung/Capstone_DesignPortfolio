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
        <h3>
          +1(404)384-0303 | l.d.young@outlook.com | Atlanta, GA, USA |{" "}
          <Link
            to={"https://www.linkedin.com/in/young-laigha/"}
          >
            LinkedIn
          </Link>{" "}
          |{" "}
          <Link
            to={"https://github.com/laiyoung"}
          >
            GitHub
          </Link>
        </h3>
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
            <button
              style={{ marginLeft: ".5em" }}
              className="lang-tools"
              onClick={() => navToMarkerResults()}
            >
              Laboratory Preparation & Management
            </button>
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
            <button
              style={{ marginLeft: ".5em" }}
              className="competencies"
              onClick={() => navToMarkerResults()}
            >
              Customer Service
            </button>
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
          <h2>Technical Projects</h2>
          <div className="project-paragraph" style={{ marginBottom: "1em"}} >
            <h3 style={{ fontWeight: "bold" }}>Recent Paper(s):</h3>
            <li className="cv-project-item" onClick={() => navigate("/project-one")}>
              <span style={{ fontWeight: "bold" }}>YOUNG, LAIGHA</span> “Chapter
              7: The Blues Tradition: Building Dialogical Relation within
              Utopian Imaginaries”. LAPOUTTE, Alexandrine, DUVERGER, Timothée
              and DACHEUX, Eric (eds). Imagine, Studying the Relationship
              between Social and Solidarity Economy (SSE) and Imaginary in the
              Era of Capitalocene. Liège: CIRIEC, 2024. (CIRIEC Studies Series;
              6), pp. 107-131.{" "}
            </li>
          </div>
          <div className="cv-project">
            <h3>
              <span style={{ fontWeight: "bold" }}>The Library App</span> |{" "}
              <span style={{ textDecorationLine: "underline" }}>
                Front End Developer
              </span>{" "}
              | January/2025 |{" "}
              <Link
                to={"https://github.com/laiyoung/The_Library_App"}
                // style={{ color: "#9497dd",  }}
              >
                GitHub Link
              </Link>{" "}
              |{" "}
              <Link
                to={
                  "https://67ef42c09bbe6355ddf358b6--rad-seahorse-bc769a.netlify.app/"
                }
                // style={{ color: "#9497dd", }}
              >
                Deployment Link
              </Link>
            </h3>
            <li style={{ marginLeft: "2em" }}>
              Front end development example for a public library app
            </li>
            <li style={{ marginLeft: "2em" }}>
              Establishing API connections to allow users to access catalog
              information and their account information
            </li>
            <li style={{ marginLeft: "2em" }}>
              Utilizing React components, props, event listeners, and routers to
              manage user experience and control interactions – including
              catalog searches, information pulls, book reservations, and book
              returns
            </li>
            <li style={{ marginLeft: "2em" }}>
              Building a system for user authentication, with dynamic interface
              elements
            </li>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ fontWeight: "bold" }}>Key Tools:</span> JavaScript,
              React, CSS, HTML, Node, Figma
            </li>
          </div>
        </div>
      </div>
    </>
  );
}
