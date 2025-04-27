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

export default function ProjectFive({ setSelectedMarker }) {
  const [projectFive, setProjectFive] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();
  /** Photo Carousel */
  const [projectFivePhotos, setProjectFivePhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProjectFive() {
      try {
        const response = await fetch(`${API_URL}/projects/5`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectFive(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectFive();
  }, []);

  useEffect(() => {
    async function fetchProjectFivePhotos() {
      try {
        const response = await fetch(`${API_URL}/projects/5/photos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectFivePhotos(result);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectFivePhotos();
  }, []);
  usePreloadAdjacentImages(projectFivePhotos, currentPhotoIndex);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function goToNextPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === projectFivePhotos.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToPreviousPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? projectFivePhotos.length - 1 : prevIndex - 1
    );
  }

  function handleNextProject() {
    const next = getNextProject(projectFive.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectFive.id);
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
          {projectFive.title}
        </h2>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2013}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectFive.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span>{" "}
          {projectFive.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          Sow Much Good (SMG)
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Christiane
          Repenning & Courtney Reed; SMG Executive Director: Robin Emmons
        </p>
        <p className="project-paragraphs">
          Food insecurity is a significant problem in the metropolitan area of
          Charlotte, North Carolina, with many low-income communities living
          within areas that are considered food deserts. It is estimated that
          over 72,000 residents in Mecklenburg County live in food deserts or
          neighborhoods identified as “food insecure.” The non-profit Sow Much
          Good works to provide fresh fruits and vegetables to communities both
          within and outside the city. The organization has a micro farm that
          produces an average of 5,000 pounds of food a year. Tomatoes, which
          often sell for nearly $2.00 a pound at the Charlotte Regional Farmers
          Market, go for $0.20 cents a pound at SMGs pop-up neighborhood
          markets.
        </p>
        <p className="project-paragraphs">
          With a team of three, I created an educational curriculum for upcoming
          youth outreach programs, including topics like energy and water
          conservation, as well as recycling. The curriculum was constructed to
          facilitate learning about gardening and sustainability for children
          between the ages of six and thirteen. Along with the constructed
          curriculum, I also designed educational brochures on environmental
          topics to provide a condensed information format for easy sharing and
          distribution.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span>
          Curriculum outlines, brochures, and resources for courses on
          watersheds, ecosystems, conservation, and sustainability.
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
          <Link to={"https://www.facebook.com/SowMuchGood/ "}>
            <button style={{ margin: ".5em" }}>Sow Much Good</button>
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
            {projectFivePhotos.length > 0 && (
              <>
                <img
                  src={projectFivePhotos[currentPhotoIndex].image_url}
                  alt={projectFivePhotos[currentPhotoIndex].title}
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
        {projectFivePhotos.length > 0 && (
          <h3 className="image-title">
            {projectFivePhotos[currentPhotoIndex].title}
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
