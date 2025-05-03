import React from "react";
import { useEffect, useState } from "react";
import { API_URL } from "../../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getNextProject,
  getPreviousProject,
  markerTypeToClass,
} from "../Projects/index.js";

export default function ProjectOne({ setSelectedMarker }) {
  const [projectOne, setProjectOne] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjectOne() {
      try {
        const response = await fetch(`${API_URL}/projects/1`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectOne(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectOne();
  }, []);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function handleNextProject() {
    const next = getNextProject(projectOne.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectOne.id);
    if (prev) {
      navigate(prev.route);
    }
  }

  return (
    <>
      <div className="topbox">
        <button
          className="navbtn-long"
          style={{
            fontSize: "1.2em",
          }}
          onClick={handlePreviousProject}
        >
          &#x21D0; Previous Project
        </button>

        <button
          className="navbtn-long"
          style={{
            fontSize: "1.2em",
            marginRight: "1.5em",
          }}
          onClick={handleNextProject}
        >
          Next Project &#x21D2;
        </button>
      </div>
      <div className="project-details-view">
        <h2
          className="project-title"
          style={{
            marginLeft: "auto",
            textAlign: "center",
            paddingRight: "3em",
            paddingTop: "1em",
          }}
        >
          {projectOne.title}
        </h2>
        <div
          className="hero-image-wrapper"
          style={{
            marginLeft: "auto",
            textAlign: "right",
          }}
        >
          <img
            src={projectOne.thumbnail}
            alt={projectOne.title}
            className="hero-image"
          />
        </div>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2024}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectOne.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span> {projectOne.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          International Centre of Research and Information on the Public, Social
          and Cooperative Economy (CIRIEC)
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Individual
          Project
        </p>
        <p className="project-paragraphs">
          A working group Social Solidarity Economy (SSE), Utopias, and
          Imaginary Narratives was formed from the CIRIEC Commission for Social
          and Cooperative Economy. This two-year collaboration occurred between
          2022 and 2024. The working group featured 12 researchers and included
          regular dialogues and meetings for editing entries. During the
          project, I had the opportunity to both produce my own piece, as well
          as acted as an editor for a peer’s final paper. The utopian dimensions
          of SSEs were examined from four different perspectives: Stories and
          Mobilization in Organizations, Utopia as a Catalyst for Local
          Transitions, Imagining Solidarity through Cultural Works, and
          Deconstructing Economic Myths. The deliverable for this exploration
          was a book that features the outputs of the working group and was
          published within the CIRIEC Studies Series: CIRIEC Studies Series – 6.
          ISBN 978-2-931051-84-9 (epdf).
        </p>

        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Abstract:</span> The Blues, as a
          countercultural art form, has engendered dialogical consciousness –
          both in terms of production practices and the creation of broader
          relational ontologies. This conceptual investigation explores the
          Blues genre as an “axiology-in-practice” within African American
          alter-collectivities. Using imaginary reconstitution as a utopian
          method of analysis, and assemblage theory as a medium of musical
          understanding, the following piece investigates everyday utopias
          within Blues production. These everyday utopias have reverberating
          materializations within Black socioeconomic spaces. With the integral
          nature of dialogical art forms in crafting cooperative consciousness
          and collective survivance, the epistemology of the Blues genre becomes
          the foundation to an embodied ethical economic practice.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span>
          <Link
            to={
              "https://www.ciriec.uliege.be/wp-content/uploads/2025/02/CSS6-CHAP7.pdf"
            }
          >
            <button>Chapter Link</button>
          </Link>
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Links:</span>
          <Link to={"https://www.ciriec.uliege.be/en/ "}>
            <button>CIRIEC</button>
          </Link>
          <Link
            to={
              "https://www.ciriec.uliege.be/en/publications/ouvrages/imagine-studying-the-relationship-between-social-and-solidarity-economy-sse-and-imaginary-in-the-era-of-capitalocene-alexandrine-lapoutte-timothee-duverger-eric-dacheux-eds-2024/ "
            }
          >
            <button>Working Group (Studies Series 6)</button>
          </Link>
        </h4>
        <div className="project-methods">
          <h4
            style={{
              marginLeft: "auto",
              textAlign: "left",
              paddingRight: "3em",
              fontWeight: "bold",
            }}
          >
            Methods:
          </h4>
          {markerButtons &&
            markerButtons.map((marker) => (
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
      <div className="topbox">
        <button
          className="navbtn-long"
          style={{
            fontSize: "1.2em",
            padding: ".5em",
          }}
          onClick={() => navigate("/projects")}
        >
          &#x21D0; Full Project List
        </button>
        <button
          className="navbtn-long"
          style={{
            fontSize: "1.2em",
            padding: ".5em",
            marginRight: "1.5em",
          }}
          onClick={() => navigate("/cv")}
        >
          CV &#x21D2;
        </button>
      </div>
    </>
  );
}
