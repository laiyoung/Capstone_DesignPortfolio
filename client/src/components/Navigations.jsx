/* This will be tied in later, when projects and documents are added **/
import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Navigation({ token, setToken }) {
  const navigate = useNavigate();
  async function handlelogOut() {
    navigate("/");
    setToken(null);
  }

  return token ? (
    <div className="nav">
      <Link to={"/"}>
        {" "}
        <h2>Full Catalog</h2>
      </Link>
      <Link to={"/account-view"}>
        <h2>Make a Reservation</h2>
      </Link>
      <button onClick={handlelogOut}>Log Out</button>
    </div>
  ) : (
    <div className="nav">
      <Link to={"/"}>
        {" "}
        <h2>Full Catalog</h2>
      </Link>
      <Link to={"/login"}>
        <h2>Login for Reservations</h2>
      </Link>
    </div>
  );
}
