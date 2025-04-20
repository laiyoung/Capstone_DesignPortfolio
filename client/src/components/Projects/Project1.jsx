import React from "react";
import { useEffect, useState } from "react";
import { API_URL } from "../../App";

export default function ProjectOne() {
  const [projectOne, setProjectOne] = useState({});

  useEffect(() => {
    async function fetchProjectOne() {
      try {
        const response = await fetch(`${API_URL}/projects/1`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectOne(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectOne();
  }, []);

  return (
    <>
      <div className="project-details-view">
        <h2
          className="project-title"
          style={{
            marginLeft: "auto",
            textAlign: "right",
            paddingRight: "3em",
          }}
        >
          {projectOne.title}
        </h2>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2024}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectOne.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span> {projectOne.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          International Centre of Research and Information on the Public, Social
          and Cooperative Economy (CIRIEC)
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Individual
          Project
        </p>
        <p className="project-paragraphs">
          A working group Social Solidarity Economy (SSE), Utopias, and
          Imaginary Narratives was formed from the CIRIEC Commission for Social
          and Cooperative Economy. This two-year collaboration occurred between
          2022 and 2024. The working group featured 12 researchers and included
          regular dialogues and meetings for editing entries. During the
          project, I had the opportunity to both produce my own piece, as well
          as acted as an editor for a peer’s final paper. The utopian dimensions
          of SSEs were examined from four different perspectives: Stories and
          Mobilization in Organizations, Utopia as a Catalyst for Local
          Transitions, Imagining Solidarity through Cultural Works, and
          Deconstructing Economic Myths. The deliverable for this exploration
          was a book that features the outputs of the working group and was
          published within the CIRIEC Studies Series: CIRIEC Studies Series – 6.
          ISBN 978-2-931051-84-9 (epdf).
        </p>

        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Abstract:</span> The Blues, as a
          countercultural art form, has engendered dialogical consciousness –
          both in terms of production practices and the creation of broader
          relational ontologies. This conceptual investigation explores the
          Blues genre as an “axiology-in-practice” within African American
          alter-collectivities. Using imaginary reconstitution as a utopian
          method of analysis, and assemblage theory as a medium of musical
          understanding, the following piece investigates everyday utopias
          within Blues production. These everyday utopias have reverberating
          materializations within Black socioeconomic spaces. With the integral
          nature of dialogical art forms in crafting cooperative consciousness
          and collective survivance, the epistemology of the Blues genre becomes
          the foundation to an embodied ethical economic practice.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span>
          <button>Chapter Link</button>
        </h4>
        
      </div>
    </>
  );
}
