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

export default function ProjectFour({ setSelectedMarker }) {
  const [projectFour, setProjectFour] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();
  /** Photo Carousel */
  const [projectFourPhotos, setProjectFourPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProjectFour() {
      try {
        const response = await fetch(`${API_URL}/projects/4`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectFour(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectFour();
  }, []);

  useEffect(() => {
    async function fetchProjectFourPhotos() {
      try {
        const response = await fetch(`${API_URL}/projects/4/photos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectFourPhotos(result);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectFourPhotos();
  }, []);
  usePreloadAdjacentImages(projectFourPhotos, currentPhotoIndex);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function goToNextPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === projectFourPhotos.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToPreviousPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? projectFourPhotos.length - 1 : prevIndex - 1
    );
  }

  function handleNextProject() {
    const next = getNextProject(projectFour.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectFour.id);
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
          {projectFour.title}
        </h2>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2014}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectFour.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span>{" "}
          {projectFour.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          Barbee Farms
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Lucy
          Sexton, Drew Glenn, Emma Krause, and Paul Henderson
        </p>
        <p className="project-paragraphs">
          Barbee Farms is a 3rd generation family farm in Concord, North
          Carolina, participating in Mecklenburg County’s community-supported
          agriculture (CSA) program. The farm cultivates a variety of
          vegetables, beans, and fruit, including squash, cucumbers, apples,
          pinto beans, kale, garlic, black beans, peaches, blueberries,
          collards, spinach, and potatoes, as well as eggs. A full CSA share
          includes approximately $30 worth of seasonal produce per week for a
          12-week period, with three sessions available per year. With the
          success of the CSA program, the farm was considering an expansion into
          value-added products that would require the construction of an
          industrial kitchen.
        </p>
        <p className="project-paragraphs">
          Leading a team of six, I conducted market research within the
          metropolitan Charlotte area to assess the possible expanded revenue
          streams. Potential returns were considered for freezing, dried fruit,
          canned goods, and fruit jams. In addition to calculating the possible
          benefits, we also researched the added cost of constructing the
          necessary industrial kitchen, along with potential increases in labor
          costs. The farm had a current budget of $250,000 USD set aside for
          construction. While the revenue from value-added products could prove
          quite profitable, we recommended allowing the CSA revenue to increase
          further before seeking to expand, allowing for a reduction in the
          potential risks and leverage concerns. After ten years of
          CSA-sustained growth, the farm has now successfully expanded into the
          production of a variety of jams, pickled vegetables, chow chow, salsa,
          and fruit butters.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span> Summary
          portfolio of central findings, as well as more detailed calculations
          and information on utilized formulas, for any necessary further
          analysis once CSA expansion was completed.
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
          <Link to={"https://www.barbeefarms.net/"}>
            <button style={{ margin: ".5em" }}>Barbee Farms</button>
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
            {projectFourPhotos.length > 0 && (
              <>
                <img
                  src={projectFourPhotos[currentPhotoIndex].image_url}
                  alt={projectFourPhotos[currentPhotoIndex].title}
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
        {projectFourPhotos.length > 0 && (
          <h3 className="image-title">
            {projectFourPhotos[currentPhotoIndex].title}
          </h3>
        )}
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
