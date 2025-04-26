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
      <div className={`navigation ${isOpen ? "open" : ""}`}>
        <Link style={{ color: "#eaebf9" }} to={"/"}>
          {" "}
          <h2>Art</h2>
        </Link>
        <Link style={{ color: "#eaebf9" }} to={"/projects"}>
          <h2>Projects</h2>
        </Link>
        <Link style={{ color: "#eaebf9" }} to={"/cv"}>
          {" "}
          <h2>CV</h2>
        </Link>
      </div>
    </>
  );
}
