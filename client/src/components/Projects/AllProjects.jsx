import React from "react";
import { useEffect, useState } from "react";
import  {API_URL} from "../../App";
import SingleProjectCard from "./SingleProjectCard";



export default function AllProjects({ setSelectedMarker, selectedMarker }) {
  const [projects, setProjects] = useState([]);


  useEffect(() => {
    async function fetchAllProjects() {
      try {
        const response = await fetch(`${API_URL}/projects`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjects(result);
      } catch (err) {
        console.log (err);
      }
    }
    fetchAllProjects();
  }, []);



  return (
    <>
      <div className="all-projects">
        {projects.map((project) => (
          <SingleProjectCard
            projects={projects}
            key={project.id}
            projectId={project.id}
            project={project}
            setSelectedMarker={setSelectedMarker}
            selectedMarker={selectedMarker}
          />
        ))}
      </div>
    </>
  );
}
