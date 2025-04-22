import React from "react";
import { useNavigate } from "react-router-dom";
import { projectsRoutes } from "../Projects/index.js";

export default function SingleProjectCard({ project, setSelectedMarker }) {
  const navigate = useNavigate();



  function handleDetails() {
    const selectedRoute = projectsRoutes.find(route => route.id === project.id);

    if (selectedRoute) {
      navigate(selectedRoute.route);
    } else {
      console.warn(`No route found for project ID: ${project.id}`);
    }
  }

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  return (
    <div className="project-card">
      <div className="project-title">
        <h2 style={{ }}>{project.title}</h2>
      </div>
      <div className="project-content">
        <div className="project-image-wrapper">
          <img
            style={{ display: "block", margin: "0 auto" }}
            src={project.thumbnail}
            alt={project.title}
          />
        </div>
        <div className="project-info">
          <h4>
            <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
            {project.location}
          </h4>
          <h4>
            <span style={{ fontWeight: "bold" }}>Role(s):</span> {project.role}
          </h4>
          <p>{project.blurb}</p>
          <button onClick={handleDetails}>Details</button>
        </div>
      </div>
      <div className="project-title">
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
                {project.markers &&
                  project.markers.map((marker) => (
                    <button
                      style={{ marginBottom: "7px" }}
                      key={marker.id}
                      onClick={() => navToMarkerResults(marker)}
                    >
                      {marker.title}
                    </button>
                  ))}
              </div>
    </div>
  );
}
