/** Express + API Route Functions */

// Express Imports:
const express = require("express");
const apiRouter = express.Router();

// JSON parser:
apiRouter.use(express.json());

// Routes for api requests (each file needs it's own defined path):
// File declararion:
const admin = require("./admin")
// Route declaration: 
apiRouter.use("/admins", admin)

const art = require("./art")
apiRouter.use("/pieces", art)

const contact = require("./contact")
apiRouter.use("/contact", contact)

const projects = require("./projects")
apiRouter.use("/projects", projects)

const tags = require("./tags")
apiRouter.use("/tags", tags)

const markers = require("./markers")
apiRouter.use("/markers", markers)

// Exporting express router to the various api files:

module.exports = apiRouter

