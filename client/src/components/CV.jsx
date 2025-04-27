import React from "react";
import { useEffect, useState } from "react";
import { API_URL } from "../App";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { projectsRoutes, markerTypeToClass } from "./Projects/index.js";

export default function CV({ setSelectedMarker }) {
  const [markers, setMarkers] = useState({});
  const navigate = useNavigate();
  useEffect(() => {
    async function fetchMarkers() {
      try {
        const response = await fetch(`${API_URL}/markers`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setMarkers(result.markers);
        // console.log(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchMarkers();
  }, []);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  return (
    <>
      <div>
        {" "}
        <Link to={""}>
          <button>CV in PDF Format</button>
        </Link>
        <h2 style={{ fontStyle: "italic", fontWeight: "bold" }}>
          Organizational Scientist
        </h2>
        <h3>
          +1(404)384-0303 | l.d.young@outlook.com | Atlanta, GA, USA |{" "}
          <Link to={"https://www.linkedin.com/in/young-laigha/"}>LinkedIn</Link>{" "}
          | <Link to={"https://github.com/laiyoung"}>GitHub</Link>
        </h3>
        <p>
          Organizational scientist and artist with over 5 years of experience in
          organizational and enterprise network research, developing expertise
          in social science research and sustainability ethics. Adept in
          collaboration infrastructure, participatory design research, and
          network research - trained at University College Cork. Motivated by
          opportunities to expand skills in process engineering and coding
          within the data science field to impact enterprise research.
        </p>
      </div>
      <div className="all-projects">
        <div className="project-card">
          <h2 style={{ textDecorationLine: "overline underline" }}>
            Technical Skills
          </h2>
          <h3>
            <span
              style={{ fontWeight: "bold", textDecorationLine: "underline" }}
            >
              Currently Learning
            </span>
            : Full Stack Deployment Methods | Essentials of Generative AI |
            Python & R for Data Analytic
          </h3>
          <div>
            <h3 style={{ fontWeight: "bold" }}>Languages & Tools:</h3>
            {markers["Languages & Tools"]?.map((marker) => (
              <button
                className={`button ${markerTypeToClass[marker.type] || ""}`}
                style={{ marginBottom: "5px" }}
                key={marker.id}
                onClick={() => navToMarkerResults(marker)}
              >
                {marker.title}
              </button>
            ))}
            <button
              style={{ marginLeft: ".5em" }}
              className="lang-tools"
              onClick={() => navToMarkerResults()}
            >
              Laboratory Preparation & Management
            </button>
            <h3 style={{ fontWeight: "bold" }}>Competencies:</h3>
            {markers["Competencies"]?.map((marker) => (
              <button
                className={`button ${markerTypeToClass[marker.type] || ""}`}
                style={{ marginBottom: "5px" }}
                key={marker.id}
                onClick={() => navToMarkerResults(marker)}
              >
                {marker.title}
              </button>
            ))}
            <button
              style={{ marginLeft: ".5em" }}
              className="competencies"
              onClick={() => navToMarkerResults()}
            >
              Customer Service
            </button>
            <h3 style={{ fontWeight: "bold" }}>
              Additional Critical Proficiencies:
            </h3>
            {markers["Additional Critical Proficiencies"]?.map((marker) => (
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
        </div>
        <div className="project-card">
          <h2 style={{ textDecorationLine: "overline underline" }}>
            Technical Projects
          </h2>
          <div className="project-paragraph" style={{ marginBottom: "1em" }}>
            <h3 style={{ fontWeight: "bold" }}>Recent Paper(s):</h3>
            <li
              className="cv-project-item"
              onClick={() => navigate("/project-one")}
            >
              <span style={{ fontWeight: "bold" }}>YOUNG, LAIGHA</span> “Chapter
              7: The Blues Tradition: Building Dialogical Relation within
              Utopian Imaginaries”. LAPOUTTE, Alexandrine, DUVERGER, Timothée
              and DACHEUX, Eric (eds). Imagine, Studying the Relationship
              between Social and Solidarity Economy (SSE) and Imaginary in the
              Era of Capitalocene. Liège: CIRIEC, 2024. (CIRIEC Studies Series;
              6), pp. 107-131.{" "}
            </li>
          </div>
          <div className="cv-project" onClick={() => navigate("/project-six")}>
            <h3>
              <span style={{ fontWeight: "bold" }}>The Library App</span> |{" "}
              <span style={{ textDecorationLine: "underline" }}>
                Front End Developer
              </span>{" "}
              | January/2025 |{" "}
              <Link to={"https://github.com/laiyoung/The_Library_App"}>
                GitHub Link
              </Link>{" "}
              |{" "}
              <Link
                to={
                  "https://67ef42c09bbe6355ddf358b6--rad-seahorse-bc769a.netlify.app/"
                }
              >
                Deployment Link
              </Link>
            </h3>
            <li style={{ marginLeft: "2em" }}>
              Front end development example for a public library app
            </li>
            <li style={{ marginLeft: "2em" }}>
              Establishing API connections to allow users to access catalog
              information and their account information
            </li>
            <li style={{ marginLeft: "2em" }}>
              Utilizing React components, props, event listeners, and routers to
              manage user experience and control interactions – including
              catalog searches, information pulls, book reservations, and book
              returns
            </li>
            <li style={{ marginLeft: "2em" }}>
              Building a system for user authentication, with dynamic interface
              elements
            </li>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ fontWeight: "bold" }}>Key Tools:</span> JavaScript,
              React, CSS, HTML, Node, Figma
            </li>
          </div>
          <div
            className="cv-project"
            onClick={() => navigate("/project-seven")}
          >
            <h3>
              <span style={{ fontWeight: "bold" }}>Design Portfolio</span> |{" "}
              <span style={{ textDecorationLine: "underline" }}>
                Full Stack Developer
              </span>{" "}
              | May/2025 |{" "}
              <Link to={"https://github.com/laiyoung/Capstone_DesignPortfolio"}>
                GitHub Link
              </Link>{" "}
              | <Link to={""}>Deployment Link</Link>
            </h3>
            <li style={{ marginLeft: "2em" }}>
              Full stack design engineering portfolio
            </li>
            <li style={{ marginLeft: "2em" }}>
              Building a backend environment with API routes for moving data
              between the client and server
            </li>
            <li style={{ marginLeft: "2em" }}>
              Including SQL interaction models for processing inputs from the
              front end, along with middleware for encryption
            </li>
            <li style={{ marginLeft: "2em" }}>
              Creating front end API connections to allow users to view gallery
              information and for administrators to alter project informatio
            </li>
            <li style={{ marginLeft: "2em" }}>
              Utilizing React components, props, event listeners, and routers to
              manage user and administrator experience and control interactions
              – including gallery searches using dynamic tag filters.
            </li>
            <li style={{ marginLeft: "2em" }}>
              Building a system for administrator authentication, with dynamic
              interface elements
            </li>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ fontWeight: "bold" }}>Key Tools:</span> JavaScript,
              React, CSS, HTML, Postman API Development, Node
            </li>
          </div>
        </div>
        <div className="project-card">
          <h2 style={{ textDecorationLine: "overline underline" }}>
            Experience
          </h2>
          <div className="cv-project" onClick={() => navigate("/project-one")}>
            <h3>
              <span style={{ fontWeight: "bold" }}>Researcher</span> |{" "}
              <span style={{ fontStyle: "italic" }}>
                Co-operative College: Early Researchers Network
              </span>{" "}
              | Manchester, UK |{" "}
              <span style={{ fontWeight: "bold" }}>March/2017 - Present</span>
            </h3>
            <li style={{ marginLeft: "2em" }}>
              Collaborate with 50 social scientists, entrepreneurs, and
              changemakers to improve economic access for disadvantaged
              communities in 17 countries, across 4 continents
            </li>
            <li style={{ marginLeft: "2em" }}>
              Working with community organizations, like Cooperation Jackson, to
              scale sustainability frameworks for increased market control,
              racial equity, and community engagement in large cooperative
              networks
            </li>
            <li style={{ marginLeft: "2em" }}>
              Including SQL interaction models for processing inputs from the
              front end, along with middleware for encryption
            </li>
            <li style={{ marginLeft: "2em" }}>
              Research the cooperative model as a comprehensive mechanism for
              communities of color to generate self-sustaining economic
              ecosystems, using business-to-business collaboration processes
            </li>
          </div>
          <div className="project-paragraph" style={{ marginBottom: "1em" }}>
            <h3>
              <span style={{ fontWeight: "bold" }}>Researcher & Designer</span>{" "}
              |{" "}
              <span style={{ fontStyle: "italic" }}>
                University of Victoria
              </span>{" "}
              | Victoria, BC, Canada |{" "}
              <span style={{ fontWeight: "bold" }}>
                August/2016 - January/2017
              </span>
            </h3>
            <li
              className="cv-project-item"
              onClick={() => navigate("/project-two")}
            >
              <span style={{ textDecorationLine: "underline" }}>
                Vancouver Island Health Authority
              </span>
              :
              <div>
                &#9642; Developed interface to streamline 20 pathologists’
                process for assessing cancer risks in 350 patients daily
              </div>
              <div>
                &#9642; Designed radiology patient management system to increase
                efficiency in appointment creation and reduce caseload from 120%
                to 80%
              </div>
              <div>
                &#9642; Modernized diabetes team’s approach to patient care
                through simplified software and relationship building programs
                between nurses and patients, improving patient retention rates
                by 27%
              </div>
            </li>
            <li
              className="cv-project-item"
              onClick={() => navigate("/project-three")}
            >
              <span style={{ textDecorationLine: "underline" }}>
                Victoria Placemaking Society and BC Libraries Cooperative
              </span>
              :
              <div>
                &#9642; Advised a group of 30 project personnel on best plan of
                implementation for $20 million urban development project
              </div>
              <div>
                &#9642; Conducted research in downtown Victoria to assess the
                feasibility of a 10-mile BeltLine connecting the city’s core
                neighborhoods through green spaces and trails
              </div>
              <div>
                &#9642; Formulated methods to better connect library patrons of
                200 institutions in the BC Libraries Cooperative network
              </div>
            </li>
          </div>
          <div className="project-paragraph" style={{ marginBottom: "1em" }}>
            <h3>
              <span style={{ fontWeight: "bold" }}>
                Circulator and Patient Escort
              </span>{" "}
              | <span style={{ fontStyle: "italic" }}>Piedmont Healthcare</span>{" "}
              | Atlanta, GA, USA |{" "}
              <span style={{ fontWeight: "bold" }}>
                July/2013 - January/2016
              </span>
            </h3>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ textDecorationLine: "underline" }}>
                Patient Escort
              </span>
              :
              <div>
                &#9642; Served as first point of contact for patients upon
                arrival at the hospital
              </div>
              <div>
                &#9642; Employed Epic EMR software to manage patient
                appointments
              </div>
              <div>
                &#9642; Facilitated communication between patients and medical
                professionals to create a seamless experience pre and post
                appointment
              </div>
              <div>
                &#9642; Coordinated movement and discharge of up to 20 patients
                per day
              </div>
            </li>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ textDecorationLine: "underline" }}>
                Circulator
              </span>
              :
              <div>
                &#9642; Assisted laboratory practitioners in collecting blood
                samples, performing centrifugation, and processing X-rays
              </div>
              <div>
                &#9642; Aided cardiovascular and neonatal ICU nurses for 8 to 12
                hours weekly
              </div>
              <div>
                &#9642; Accommodated any patient needs not addressed by medical
                staff
              </div>
            </li>
          </div>
          <div className="project-paragraph" style={{ marginBottom: "1em" }}>
            <h3>
              <span style={{ fontWeight: "bold" }}>
                Laboratory Manager & Technician
              </span>{" "}
              | <span style={{ fontStyle: "italic" }}>Davidson Chemistry</span>{" "}
              | Davidson, NC, USA |{" "}
              <span style={{ fontWeight: "bold" }}>August/2011 - May/2011</span>
            </h3>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ textDecorationLine: "underline" }}>
                Lab Preparation
              </span>
              : Workshopped and constructed laboratory procedures; Manufactured
              reagents; Processed students’ gels for PCR and gel
              electrophoresis; Prepared bacterial cultures for study
            </li>
            <li style={{ marginLeft: "2em" }}>
              <span style={{ textDecorationLine: "underline" }}>
                Lab Management
              </span>
              : Biochemistry; Environmental Chemistry; Principles of Chemistry;
              Chemistry of Art and Artifacts; Organic Chemistry 1 and 2;
              Introduction to Analytical, Experiential, and Physical Chemistry;
              Chemistry of Society
            </li>
            <li style={{ marginLeft: "2em" }}>
              {" "}
              Assisted with chemical and equipment inventory and distribution
            </li>
          </div>
        </div>
        <div className="project-card">
          <h2 style={{ textDecorationLine: "overline underline" }}>
            Education
          </h2>
          
        </div>
      </div>
    </>
  );
}
