import React from "react";
import { useNavigate } from "react-router-dom";

export default function SingleProjectCard({ project }) {
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

  function handleDetails() {
    const selectedRoute = projectsRoutes.find(route => route.id === project.id);

    if (selectedRoute) {
      navigate(selectedRoute.route);
    } else {
      console.warn(`No route found for project ID: ${project.id}`);
    }
  }

  return (
    <div className="project-card">
      <div className="project-title">
        <h2 style={{ textDecorationLine: "underline" }}>{project.title}</h2>
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
    </div>
  );
}
