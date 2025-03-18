/* This will be tied in later, when projects and documents are added **/
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navigation() {
  // const navigate = useNavigate();
  // async function handlelogOut() {
  //   navigate("/");
  // }

  return (
    <>
      <div>
        <Link to={"/"}>
          {" "}
          <h2>Art</h2>
        </Link>
        <Link to={"/account-view"}>
          <h2>Projects</h2>
        </Link>
        <Link to={"/"}>
          {" "}
          <h2>CV</h2>
        </Link>
        <Link to={"/login"}>
          <h2> Send a Message</h2>
        </Link>
      </div>
    </>
  );
}
