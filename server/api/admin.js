/** Express + API Function Imports */
// Importing Express
const express = require("express");
const apiRouter = express.Router();

// JSON parser:
apiRouter.use(express.json());

// Middleware for printing information + errors:
apiRouter.use(require("morgan")("dev"));

// Importing bcrypt for comparing passwords:
const bcrypt = require("bcrypt");

// Function imports:
const {
  getAllAdmins,
  getAdminByUsername,
} = require("../db/db");



// Token middleware:
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT || "shhh";

// Possible Admin Routes:
// Get all admin
// So, you only have the '/' because usersRouter is defined as "/users" in the api/server.js.
apiRouter.get("/", async (req, res, next) => {
  try {
   res.send (await getAllAdmins())
  } catch (ex) {
    next(ex);
  }
});

// Admin login
// Same here! You have to add "/admins" in Postman
apiRouter.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password",
    });
  }

  try {
    const admin = await getAdminByUsername(username);
    if (admin && (await bcrypt.compare(password, admin.password)) == true) {
      const token = jwt.sign(
        {
          id: admin.id,
          username,
        },
        JWT_SECRET,
        {
          expiresIn: "1w",
        }
      );

      res.send({
        message: "you're logged in!",
        token,
      });
    } else {
      next({
        name: "IncorrectCredentialsError",
        message: "Username or password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Authorized action path for the front end
apiRouter.get("/auth/me", (req, res, next) => {
  try {
    res.send(req.admin);
  } catch (ex) {
    next(ex);
  }
});




// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
