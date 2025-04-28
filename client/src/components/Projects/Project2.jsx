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

export default function ProjectTwo({ setSelectedMarker }) {
  const [projectTwo, setProjectTwo] = useState({});
  const [markerButtons, setMarkerButtons] = useState([]);
  const navigate = useNavigate();
  /** Photo Carousel */
  const [projectTwoPhotos, setProjectTwoPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    async function fetchProjectTwo() {
      try {
        const response = await fetch(`${API_URL}/projects/2`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectTwo(result);
        setMarkerButtons(result.markers);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectTwo();
  }, []);

  useEffect(() => {
    async function fetchProjectTwoPhotos() {
      try {
        const response = await fetch(`${API_URL}/projects/2/photos`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const result = await response.json();
        setProjectTwoPhotos(result);
        // console.log(result);
      } catch (err) {
        console.log(err);
      }
    }
    fetchProjectTwoPhotos();
  }, []);
  usePreloadAdjacentImages(projectTwoPhotos, currentPhotoIndex);

  function navToMarkerResults(marker) {
    setSelectedMarker(marker.title);
    // console.log(marker.title);
    navigate("/marker-results");
  }

  function goToNextPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === projectTwoPhotos.length - 1 ? 0 : prevIndex + 1
    );
  }

  function goToPreviousPhoto() {
    setCurrentPhotoIndex((prevIndex) =>
      prevIndex === 0 ? projectTwoPhotos.length - 1 : prevIndex - 1
    );
  }

  function handleNextProject() {
    const next = getNextProject(projectTwo.id);
    if (next) {
      navigate(next.route);
    }
  }

  function handlePreviousProject() {
    const prev = getPreviousProject(projectTwo.id);
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
          {projectTwo.title}
        </h2>
        <h4>
          <span style={{ fontWeight: "bold" }}>Year:</span> {2017}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Location:</span>{" "}
          {projectTwo.location}
        </h4>
        <h4>
          <span style={{ fontWeight: "bold" }}>Role(s):</span> {projectTwo.role}
        </h4>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>
            Participating Organizations:
          </span>{" "}
          Vancouver Island Health Authority (Island Health)
        </p>
        <p className="project-paragraphs">
          <span style={{ fontWeight: "bold" }}>Collaborators:</span> Guy
          Evans,Cindy Li, Alyssa Koniuk, Leon Li, Linden Querengesser, Judy Yu,
          Lauren Zeleschuk, Billy Li, and Dian Zhang
        </p>
        <p className="project-paragraphs">
          The Vancouver Island Health Authority (Island Health) is responsible
          for delivering health and care services to the populations of
          Vancouver Island, the islands in the Salish Sea and the Johnstone
          Strait, and the mainland communities north of Powell River. The
          network of 145 facilities serves close to one million people,
          including 50 First Nation communities. Acting as a senior analyst in a
          team of ten, I worked to build solutions that could reduce staff
          burnout and increase department resilience and efficiency. Three
          departments were identified by Island Health as critical choke points
          with high-stress environments: Radiology Services, the Pathologies
          Laboratory, and Diabetes Education Services.
        </p>
        <p className="project-paragraphs">
          The Pathologies Laboratory processed samples from an average of 350
          patients daily, with a team of 20 pathologists. The department desired
          an interface to enhance the staff’s capacity to sort samples more
          efficiently and better organize slides, both by patient and by
          intended testing procedure. I was tasked with conducting participant
          observation to document how the department’s pathologists interacted
          with the constructed protype interface and track any reductions in
          processing times. I also conducted follow-up interviews to gather
          feedback about the pathologists’ experience with the prototype. This
          information proved critical for revising how the prototype’s software
          would be integrated with the information management systems that were
          already in use throughout the department.
        </p>
        <p className="project-paragraphs">
          The Radiology department was overloaded with cases from patients
          commuting into the city for treatment. While the upcoming 10-year
          Island Health Cancer Action Plan would work to address these strained
          services by building a radiology facility at the edge of the
          metropolitan zone, the department needed a solution that could more
          quickly address technician exhaustion. A new management system was
          designed to decrease the changes made to patient appointment times, a
          sign-in system was added to allow patients to input some data prior to
          arrival, and the booking system was updated to alert staff and
          radiation therapists if double-booking occurred. The booking system
          was also modified to support the approaches staff had previously
          designed in an ad-hoc manor to help with efficiency. Clerks already
          searched for chemotherapy appointments to make sure radiology
          treatments were booked on the same day. The system was updated to
          provide this information automatically to reduce the time clerks would
          need to spend to accomplish this task and reduce possible search
          errors. Overall, the re-designed management system was able to reduce
          the daily caseloads from 120% to 80%.
        </p>
        <p className="project-paragraphs">
          Building tailored system triggers proved useful in the context of the
          Diabetes Education clinic as well. The clinic wanted to increase
          initial appointment attendance by creating a system for charging
          patients for missed appointments. Upon conducting user research,
          however, I discovered that a significant portion of missed
          appointments were related to apprehension, making punitive measures a
          poor method for behavioral change. Our team was able to enhance
          existing systems for patient connection and participation,
          reallocating practitioner engagement to focus on connecting with new
          patients via initial phone calls. The management system also
          benefitted from tailored alerts similar to the radiology case. Instead
          of alerting staff to double-bookings, we modified the alert structure
          to automatically flag persistent missed appointments, allowing for
          earlier practitioner intervention. An alert was also created to notify
          staff and practitioners to initial appointment bookings specifically,
          allowing the teams to maximize pre-appointment patient engagement. The
          experience was an important lesson in the critical nature of community
          engagement and in how framing plays a key role in designing solutions.
          Overall patient retention increased by 27% and the new engagement
          frameworks were able to reduce initial appointment absences by 90%.
          The resulting efficiency increases have allowed the diabetes center to
          expand its patient load to support self-referrals. In the following
          years, Island Health maximized the feedback collected from these
          projects and significantly expanded their evidence-based and
          participatory design approaches throughout the network.
        </p>
        <h4>
          <span style={{ fontWeight: "bold" }}>Deliverables:</span> Final report
          with UI models for redesigning alert systems and flow diagrams to
          highlight the underlying logic of process changes.
        </h4>
        <h4>
          <span
            style={{
              marginLeft: "auto",
              textAlign: "left",
              paddingRight: "3em",
              fontWeight: "bold",
            }}
          >
            Links:
          </span>
        </h4>
        <div>
          <Link
            to={
              "https://www.islandhealth.ca/news/stories/everyday-innovators-hatch-new-solutions-health-care-fifth-code-hack "
            }
          >
            <button style={{ margin: ".5em" }}>Island Health Innovation</button>
          </Link>
          <Link
            to={
              "https://www.islandhealth.ca/news/stories/safer-care-through-evidence-based-design"
            }
          >
            <button style={{ margin: ".5em" }}>
              Island Health Evidence-Based Design Initiatives
            </button>
          </Link>
          <Link
            to={
              "https://www.islandhealth.ca/our-services/diabetes-services/diabetes-education-services "
            }
          >
            <button style={{ margin: ".5em" }}>
              Island Health Diabetes Education Services
            </button>
          </Link>
        </div>

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
            {projectTwoPhotos.length > 0 && (
              <>
                <img
                  src={projectTwoPhotos[currentPhotoIndex].image_url}
                  alt={projectTwoPhotos[currentPhotoIndex].title}
                  className="slider-image"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "auto",
                    borderRadius: "10px",
                    marginBottom: "1em",
                  }}
                />
              </>
            )}
          </div>

          <button onClick={goToNextPhoto}>Next &#8594;</button>
        </div>
        {projectTwoPhotos.length > 0 && (
          <h3 className="image-title">
            {projectTwoPhotos[currentPhotoIndex].title}
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
