/** Express + API Functions */

// Express Imports:
const express = require("express");
const apiRouter = express.Router();

// JSON parser:
apiRouter.use(express.json());

// Middleware for printing information + errors:
apiRouter.use(require("morgan")("dev"));


// Importing findUserWithToken to build the user request:
const { findUserWithToken } = require("../db");

const requireUser = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

//Information for deployment:
//Static route
const path = require("node:path");
apiRouter.use(express.static(path.join(__dirname, "../client/dist")));
//GET endpoint to render static HTML

apiRouter.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);

// Exporting routes and functions:

module.exports = {
  requireUser,
};
