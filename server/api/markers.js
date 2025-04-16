// Importing Express
const express = require("express");
const apiRouter = express.Router();

// Function imports:
const { getAllMarkers, getProjectsByMarkerName } = require("../db/db");

// JSON parser:
apiRouter.use(express.json());

// Middleware for printing information + errors:
apiRouter.use(require("morgan")("dev"));

// Get all markers:
apiRouter.get("/", async (req, res, next) => {
  try {
    const markers = await getAllMarkers();

    res.send({
      markers,
    });
  } catch ({ title, message }) {
    next({ title, message });
  }
});

// Get Projects by MarkerName:
apiRouter.get("/:markerName/projects", async (req, res, next) => {
  let { markerName } = req.params;
  // console.log("Inside api router:", markerName);

  // Ex: decodes %23Teamwork to #Teamwork
  markerName = decodeURIComponent(markerName);
  
  try {
    let result = await getProjectsByMarkerName(markerName);
    res.send(result);
  } catch (ex) {
    next(ex);
  }
});

// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
