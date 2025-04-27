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

export default function ProjectSeven({ setSelectedMarker }) {
  const [projectSeven, setProjectSeven] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjectSeven() {
      try {
        const response = await fetch(`${API_URL}/projects/7`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectSeven(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectSeven();
  }, []);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function handleNextProject() {
    const next = getNextProject(projectSeven.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectSeven.id);
    if (prev) {
      navigate(prev.route);
    }
  }

  return (
    <>
      <div className="titlebox">
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
          {projectSeven.title}
        </h2>
        <div
          className="hero-image-wrapper"
          style={{
            marginLeft: "auto",
            textAlign: "right",
          }}
        >
          <img
            src={projectSeven.thumbnail}
            alt={projectSeven.title}
            className="hero-image"
          />
        </div>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2025}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectSeven.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span>{" "}
          {projectSeven.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          N/A
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Individual
          Project
        </p>
        <p className="project-paragraphs">
          The beginning of this project was used as the capstone for my software
          engineering bootcamp at the Grace Hopper Program. The full stack
          website functions as a design portfolio to highlight my completed
          projects, art, and curriculum vitae in a dynamic and engaging manor.
          During the capstone, I was able to design and build the art gallery
          portion of the portfolio. To move data between the client and server,
          a backend environment was created with API routes, and Postman was
          used to assess routes prior to beginning the front end of the
          application. React was utilized to design the user and administrator
          experience, as well as control interactions with certain components.
          API connections were created on the front end to allow users to view
          gallery information, and to facilitate searches using dynamic tag
          filters. This dynamic tag filter structure proved to be the most
          challenging aspect of the project. I had to be particularly mindful of
          which array methods were used to manipulate this attribute, as well as
          how certain display methods could affect necessary functionality
          downstream.
        </p>
        <p className="project-paragraphs">
          Because of the complexity of the data structures, SQL interaction
          models were created for processing inputs, and middleware was included
          for encrypting administrator passwords, as well as for administrator
          authentication. Managing data flow was another challenging aspect of
          this project. During front end development a few API route responses
          required modification so that certain information could be provided
          for data manipulations within React components. Clear documentation
          and annotations proved key to quickly addressing these necessary
          modifications.
        </p>

        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span>
          <Link to={"https://github.com/laiyoung/Capstone_DesignPortfolio"}>
            <button>GitHub Link</button>
          </Link>
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Links:</span>
          <Link to={""}>
            <button>Deployment Link</button>
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
      <div className="titlebox">
        <button
          className="navbtn-long"
          style={{
            fontSize: "1.2em",
            padding: ".5em",
          }}
          onClick={() => navigate("/projects")}
        >
          Back to Full Project List
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
          Back to CV
        </button>
      </div>
    </>
  );
}
