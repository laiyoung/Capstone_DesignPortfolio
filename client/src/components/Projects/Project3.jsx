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

export default function ProjectThree({ setSelectedMarker }) {
  const [projectThree, setProjectThree] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();
  /** Photo Carousel */
  const [projectThreePhotos, setProjectThreePhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProjectThree() {
      try {
        const response = await fetch(`${API_URL}/projects/3`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectThree(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectThree();
  }, []);

  useEffect(() => {
    async function fetchProjectThreePhotos() {
      try {
        const response = await fetch(`${API_URL}/projects/3/photos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectThreePhotos(result);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectThreePhotos();
  }, []);
  usePreloadAdjacentImages(projectThreePhotos, currentPhotoIndex);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function goToNextPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === projectThreePhotos.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToPreviousPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? projectThreePhotos.length - 1 : prevIndex - 1
    );
  }

  function handleNextProject() {
    const next = getNextProject(projectThree.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectThree.id);
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
          {projectThree.title}
        </h2>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2017}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectThree.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span>{" "}
          {projectThree.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          AmbientEase Consulting; BC Libraries Cooperative; The Greater Victoria
          Placemaking Society
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Patricia
          Mckenna
        </p>
        <p className="project-paragraphs">
          Working with the facilitator and senior analyst Patricia Mckenna of
          AmbientEase Consulting and The Victoria Placemaking Society, I advised
          a group of 30 urban development personnel on the implementation of a
          $20 million USD BeltLine project in downtown Victoria, BC, Canada. The
          10-mile BeltLine was designed to connect the city’s core neighborhoods
          through green spaces, historical pathways, and walking trails. I
          conducted research to identify existing green spaces and culturally
          significant alleyways that could possibly serve as an initial network
          of locations. I also assisted in hosting brainstorming events and
          neighborhood walks with the diverse stakeholders invested in the
          project’s success, including architects, students, city planners, and
          community members. These events gave me an opportunity to gain novel
          and critical skills in facilitation.
        </p>
        <p className="project-paragraphs">
          In addition to this facilitation project, I also collaborated with the
          cooperative network BC Libraries Cooperative. The network provides IT
          services for over 200 libraries and learning institutions. Their
          Victoria node wanted to begin expanding their capacity to act as a hub
          for community resilience by partnering with locally active
          organizations like the Greater Victoria Placemaking Society. Working
          along with AmbientEase, I was able to begin research on how the
          network could leverage their Victoria locations to connect library
          patrons to other stakeholders and local projects, like hosting living
          streets events and providing space for community gardens.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span>
          Feasibility report for expanding BC Libraries Cooperative’s impact
          projects within the Victoria area, and an initial short list of city
          trails and culturally significant alleyways to start building an open
          data reservoir for Greenways Victoria.
        </h4>
        <h4>
          <span
            style={{
              marginLeft: "auto",
              textAlign: "left",
              paddingRight: "3em",
              fontWeight: "bold",
            }}
          >
            Links:
          </span>
        </h4>
        <div>
          <Link to={"https://victoriaplacemaking.ca/"}>
            <button style={{ margin: ".5em" }}>
              Greater Victoria Placemaking Network
            </button>
          </Link>
          <Link to={"https://www.ambientease.com/ "}>
            <button style={{ margin: ".5em" }}>
              Emergent-Adaptive Solutions Everywhere (AmbientEase)
            </button>
          </Link>
          <Link to={"https://bc.libraries.coop/ "}>
            <button style={{ margin: ".5em" }}>BC Libraries Cooperative</button>
          </Link>
          <Link to={"https://open-vicmap.opendata.arcgis.com/"}>
            <button style={{ margin: ".5em" }}>
              City of Victoria-Open Data Portal
            </button>
          </Link>
          <Link
            to={
              "https://open-vicmap.opendata.arcgis.com/datasets/d67e6fb09ae84b9eb42e0901174ed2b5_5/explore?location=48.426099%2C-123.358300%2C15.00"
            }
          >
            <button style={{ margin: ".5em" }}>Greenways Victoria</button>
          </Link>
        </div>

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
            {projectThreePhotos.length > 0 && (
              <>
                <img
                  src={projectThreePhotos[currentPhotoIndex].image_url}
                  alt={projectThreePhotos[currentPhotoIndex].title}
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
        {projectThreePhotos.length > 0 && (
          <h3 className="image-title">
            {projectThreePhotos[currentPhotoIndex].title}
          </h3>
        )}
      </div>
      <div>
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
      </div>
    </>
  );
}
