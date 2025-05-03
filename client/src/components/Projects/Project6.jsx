import React from "react";
import { useEffect, useState } from "react";
import { API_URL } from "../../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getNextProject,
  getPreviousProject,
  markerTypeToClass,
  usePreloadAdjacentImages,
} from "../Projects/index.js";

export default function ProjectSix({ setSelectedMarker }) {
  const [projectSix, setProjectSix] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();
  /** Photo Carousel */
  const [projectSixPhotos, setProjectSixPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProjectSix() {
      try {
        const response = await fetch(`${API_URL}/projects/6`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectSix(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectSix();
  }, []);

  useEffect(() => {
    async function fetchProjectSixPhotos() {
      try {
        const response = await fetch(`${API_URL}/projects/6/photos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectSixPhotos(result);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectSixPhotos();
  }, []);
  usePreloadAdjacentImages(projectSixPhotos, currentPhotoIndex);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function goToNextPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === projectSixPhotos.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToPreviousPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? projectSixPhotos.length - 1 : prevIndex - 1
    );
  }

  function handleNextProject() {
    const next = getNextProject(projectSix.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectSix.id);
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
          {projectSix.title}
        </h2>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2025}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectSix.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span> {projectSix.role}
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
          This application is a prototype for a public library service. The
          website includes functionality for catalog searches, information
          pulls, book reservations, and book returns. As my first foray into
          complex front end web design, the project greatly enhanced my
          understanding of the React framework. API connections were built to
          allow users to access catalog information, along with their account
          information. I was also able to construct a system for user
          authentication. Multiple React components were used, including nested
          components to allow for fine tuning functionality and information d
          isplays. Event listeners, routers, and conditional operators, like
          ternary statements, played a key role in website navigation. Component
          dependencies proved to be a key learning opportunity for understanding
          how to properly utilize useEffect hooks and cluster related actions.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span>
          <Link to={"https://github.com/laiyoung/The_Library_App"}>
            <button style={{ margin: ".5em" }}>GitHub Link</button>
          </Link>
        </h4>
        <h4>
          <span
            style={{
              marginLeft: "auto",
              textAlign: "left",
              fontWeight: "bold",
            }}
          >
            Links:
          </span>
          <Link
            to={
              "https://67ef42c09bbe6355ddf358b6--rad-seahorse-bc769a.netlify.app/"
            }
          >
            <button style={{ margin: ".5em" }}>Deployment Link</button>
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

        <div className="sliding-carousel" style={{ marginTop: "3em" }}>
          <button onClick={goToPreviousPhoto} style={{}}>
            &#8592; Previous
          </button>

          <div className="carousel-container">
            {projectSixPhotos.length > 0 && (
              <>
                <img
                  src={projectSixPhotos[currentPhotoIndex].image_url}
                  alt={projectSixPhotos[currentPhotoIndex].title}
                  className="slider-image"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    maxHeight: "450px",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "10px",
                    marginBottom: "1em",
                  }}
                />
              </>
            )}
          </div>

          <button onClick={goToNextPhoto}>Next &#8594;</button>
        </div>
        {projectSixPhotos.length > 0 && (
          <h3 className="image-title">
            {projectSixPhotos[currentPhotoIndex].title}
          </h3>
        )}
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
