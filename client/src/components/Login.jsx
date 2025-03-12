/* TODO - add your code to create a functional React component that renders a 
login form */
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../App";


export default function Login({ setToken, setAdmin, token, admin }) {
  const navigate = useNavigate();
  const [adminLogin, setAdminLogin] = useState({
    username: "",
    password: "",
  });


 async function accountLogin(adminLogin) {
    try {
      const response = await fetch(`${API_URL}/admins/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminLogin),
      });
      const result = await response.json();
      return result.token;
    } catch (error) {
      console.error(error);
    }
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setAdminLogin((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function submitHandler(event) {
    event.preventDefault();
    setToken(await accountLogin(adminLogin));
    console.log(token);
    navigate("/");
  }

  return (
    <>
      <div className="form">
        <form onSubmit={submitHandler}>
          <label>
            {" "}
            Username:{" "}
            <input
              required
              name="username"
              value={adminLogin.username}
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
              value={adminLogin.password}
              type="password"
              onChange={handleChange}
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
}
