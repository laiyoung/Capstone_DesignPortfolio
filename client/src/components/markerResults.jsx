import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";
import { projectsRoutes } from "./Projects/index.js";

export default function MarkerResults({
  markerResults,
  setMarkerResults,
  selectedMarker,
  setSelectedMarker,
}) {
  const [currentProjects, setCurrentProjects] = useState([]);
  const navigate = useNavigate();

  // Add "Back to All Projects" button
  useEffect(() => {
    async function fetchAllProjects() {
      try {
        const response = await fetch(`${API_URL}/projects`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setCurrentProjects(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchAllProjects();
  }, []);

  useEffect(() => {
    setMarkerResults(
      currentProjects.filter((item) =>
        item.markers.some((marker) => marker.title === selectedMarker)
      )
    );
  }, [currentProjects.length, selectedMarker]);

  function refreshMarkerResults(marker) {
    setSelectedMarker(marker.title);
  }

  function handleDetails(projectId) {
    const selectedRoute = projectsRoutes.find(
      (route) => route.id === projectId
    );

    if (selectedRoute) {
      navigate(selectedRoute.route);
    } else {
      console.warn(`No route found for project ID: ${projectId}`);
    }
  }

  async function handleBack() {
    navigate("/projects");
  }

  return (
    <>
      <div>
        <button onClick={handleBack}>Back To Full Project List</button>
        <h2 style={{ textDecorationLine: " overline underline", paddingLeft: "4em", }}>
          {" "}
          {selectedMarker} Projects:{" "}
        </h2>
      </div>
      <div lang="en" className="all-projects">
        {markerResults.map((filteredProject) => {
          return (
            <div key={filteredProject.id} className="project-card">
              <div className="project-title">
                <h2 style={{ }}>
                  {filteredProject.title}
                </h2>
              </div>
              <div className="project-content">
                <div className="project-image-wrapper">
                  <img
                    style={{ display: "block", margin: "0 auto" }}
                    src={filteredProject.thumbnail}
                    alt={filteredProject.title}
                  />
                </div>
                <div className="project-info">
                  <h4>
                    <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
                    {filteredProject.location}
                  </h4>
                  <h4>
                    <span style={{ fontWeight: "bold" }}>Role(s):</span>{" "}
                    {filteredProject.role}
                  </h4>
                  <p>{filteredProject.blurb}</p>
                  <button onClick={() => handleDetails(filteredProject.id)}>
                    Details
                  </button>
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
                {filteredProject.markers &&
                  filteredProject.markers.map((marker) => (
                    <button
                      style={{ marginBottom: "7px" }}
                      key={marker.id}
                      onClick={() => refreshMarkerResults(marker)}
                    >
                      {marker.title}
                    </button>
                  ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
