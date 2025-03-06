/** Express + API Functions */

// Express Imports:
const express = require("express");
const apiRouter = express.Router();

// JSON parser:
apiRouter.use(express.json());


const admin = require("./admin")
apiRouter.use("/admins", admin)

const art = require("./art")
apiRouter.use("/pieces", art)

const contact = require("./contact")
apiRouter.use("/contact", contact)

const project = require("./projects")
apiRouter.use("/projects", project)

const tags = require("./tags")
apiRouter.use("/tags", tags)


// Exporting routes and functions:

module.exports = apiRouter

