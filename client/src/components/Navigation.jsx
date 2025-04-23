import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navigation() {
  // const navigate = useNavigate();
  // async function handlelogOut() {
  //   navigate("/");
  // }
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button
        className={`navbtn-tall ${isOpen ? "open" : ""}`}
        onClick={toggleMenu}
        style={{
          fontSize: "1.2em",
        }}
      >
        {" "}
        ☰ Explore
      </button>
      <div
        className={`navigation ${isOpen ? "open" : ""}`}
        style={{ color: "white" }}
      >
        <Link to={"/"}>
          {" "}
          <h2>Art</h2>
        </Link>
        <Link to={"/projects"}>
          <h2>Projects</h2>
        </Link>
        <Link to={"/cv"}>
          {" "}
          <h2>CV</h2>
        </Link>
      </div>
    </>
  );
}
