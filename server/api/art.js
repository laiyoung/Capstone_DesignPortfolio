// Importing Express
const express = require("express");
const apiRouter = express.Router();

// Function imports:
const { getAllPieces, getPieceById } = require("../db/db");

// Get all art pieces:
apiRouter.get("/", async (req, res, next) => {
  try {
    res.send(await getAllPieces());
  } catch (ex) {
    next(ex);
  }
});

// Get art piece details:
apiRouter.get("/:pieceId", async (req, res, next) => {
  try {
    res.send(await getPieceById(req.params.pieceId));
  } catch (ex) {
    next(ex);
  }
});



// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
