import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";

export default function MarkerResults({
  markerResults,
  setMarkerResults,
  selectedMarker,
  setSelectedMarker,
}) {
  const [currentProjects, setCurrentProjects] = useState([]);
  const navigate = useNavigate();

  const projectsRoutes = [
    { id: 1, route: "/project-one" },
    { id: 2, route: "/project-two" },
    { id: 3, route: "/project-three" },
    { id: 4, route: "/project-four" },
    { id: 5, route: "/project-five" },
    { id: 6, route: "/project-six" },
    { id: 7, route: "/project-seven" },
  ];

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
  function handleDetails() {
    const selectedRoute = projectsRoutes.find(
      (route) => route.id === filteredProject.id
    );

    if (selectedRoute) {
      navigate(selectedRoute.route);
    } else {
      console.warn(`No route found for project ID: ${project.id}`);
    }
  }

  async function handleBack() {
    navigate("/projects");
  }

  return (
    <>
      <div>
        <button onClick={handleBack}>Back To Full Project List</button>
        <h2 style={{ textDecorationLine: "underline", paddingLeft: "4em" }}>
          {" "}
          {selectedMarker} Projects:{" "}
        </h2>
      </div>
      <div lang="en" className="all-projects">
        {markerResults.map((filteredProject) => {
          return (
            <div key={filteredProject.id} className="project-card">
              <div className="project-title">
                <h2 style={{ textDecorationLine: "underline" }}>
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
