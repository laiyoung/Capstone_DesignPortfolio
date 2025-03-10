/* TODO - add your code to create a functional React component that renders a 
login form */
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { accountLogin } from "../api";

export default function Login({ setToken, setUser }) {
  const navigate = useNavigate();
  const [userLogin, setUserLogin] = useState({
    email: "",
    password: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;
    setUserLogin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    setToken(await accountLogin(userLogin));
    setUser();
    navigate("/account-view");
  }

  return (
    <>
      <div className="form">
        <form onSubmit={submitHandler}>
          <label>
            {" "}
            Email:{" "}
            <input
              required
              name="email"
              value={userLogin.email}
              type="text"
              onChange={handleChange}
            />
          </label>
          <label>
            {" "}
            Password:{" "}
            <input
              required
              name="password"
              value={userLogin.password}
              type="password"
              onChange={handleChange}
            />
          </label>
          <button type="submit">submit</button>
          <div>
            <h2>
              Not a user? <Link to="/register">Register Here!</Link>
            </h2>
          </div>
        </form>
      </div>
    </>
  );
}
