import React from "react";
import { useNavigate } from "react-router-dom";

export default function SingleProjectCard({ project }) {
  const navigate = useNavigate();

  function handleDetails() {
    navigate(`/${project.id}`);
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
