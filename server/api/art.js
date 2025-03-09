// Importing Express
const express = require("express");
const apiRouter = express.Router();
const { client } = require("../db/db");

// Function imports:
const {
  getAllPieces,
  getPieceById,
  createArtPiece,
  updateArtPiece,
  destroyArtPiece,
} = require("../db/db");

const { requireAuth } = require("./utils");

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

/** Art Piece API Routes that Require a Token */
// Add an art piece
apiRouter.post("/", requireAuth, async (req, res, next) => {
  const { title, date, image_url, description = "", tags } = req.body;

  const pieceData = {};

  try {
    pieceData.authorId = req.admin.id;
    pieceData.title = title;
    pieceData.date = date;
    pieceData.image_url = image_url;
    pieceData.description = description;
    pieceData.tags = tags;

    console.log(pieceData);
    const piece = await createArtPiece(pieceData);
    console.log(piece);

    if (piece) {
      res.send(piece);
    } else {
      next({
        name: "PieceCreationError",
        message: "There was an error creating your piece. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Delete an art piece
apiRouter.delete("/:pieceId", requireAuth, async (req, res, next) => {
  try {
    console.log(req.params);
    await destroyArtPiece(req.params.pieceId);
    res.send({ message: "deletion successful" });
  } catch (ex) {
    next(ex);
  }
});

// Change an art piece's info:
apiRouter.patch("/:pieceId", requireAuth, async (req, res, next) => {
  const { pieceId } = req.params;
  const { title, date, image_url, description = "", tags = [] } = req.body;

  const updateFields = {};

  if (title) {
    updateFields.title = title;
  }
  if (date) {
    updateFields.date = date;
  }
  if (image_url) {
    updateFields.image_url = image_url;
  }
  if (description) {
    updateFields.description = description;
  }
  if (tags) {
    updateFields.tags = tags;
  }

  try {
    const updatedPiece = await updateArtPiece(pieceId, updateFields);
    res.send({ piece: updatedPiece });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
