// Importing Express
const express = require("express");
const apiRouter = express.Router();

// Function imports:
const { getAllProjects, getProjectById } = require("../db/db");

// Get all projects:
apiRouter.get("/", async (req, res, next) => {
  try {
    res.send(await getAllProjects());
  } catch (ex) {
    next(ex);
  }
});

// Get project details:
apiRouter.get("/:projectId", async (req, res, next) => {
  try {
    res.send(await getProjectById(req.params.projectId));
  } catch (ex) {
    next(ex);
  }
});


/** Project API Routes that Require a Token */
// These will be the same as the 1s for the art pieces,if I ever add admin capability to this
// part of the website

// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
