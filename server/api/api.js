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

const project = require("./projects")
apiRouter.use("/projects", project)

const tags = require("./tags")
apiRouter.use("/tags", tags)


// Exporting express router to the various api files:

module.exports = apiRouter

