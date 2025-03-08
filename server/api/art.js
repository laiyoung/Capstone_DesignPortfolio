// Importing Express
const express = require("express");
const apiRouter = express.Router();
const {client} = require('../db/db');

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
  const { title, date, imageURL, description = "", tags } = req.body;

  const pieceData = {};

  try {
    pieceData.authorId = req.admin.id;
    pieceData.title = title;
    pieceData.date = date;
    pieceData.imageURL = imageURL;
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
apiRouter.patch('/:pieceId', requireAuth, async (req, res, next) => {
  const { pieceId } = req.params;
  console.log(req.body);
  try {
    // Fetch current piece information
    const currentPieceInfo = await client.query(
      `SELECT * FROM pieces WHERE id = $1;`,
      [pieceId]
    );
    const singlePiece = currentPieceInfo.rows[0];
    if (!singlePiece) {
      return next({
        name: "PieceNotFoundError",
        message: "No piece found with that ID."
      });
    }
    // Destructure new values from req.body, falling back to existing values
    const {
      title = singlePiece.title,
      date = singlePiece.date,
      imageurl = singlePiece.imageurl,
      description = singlePiece.description,
      tags: newTags // new tags from request
    } = req.body;
    // Create updatedPiece based on the current piece
    let updatedPiece = { ...singlePiece };
    // Merge tags if new tags are provided
    if (newTags) {
      // Initialize an array for existing tags, whether stored as array or comma-separated string
      let existingTagsArray = [];
      if (singlePiece.tags) {
        if (Array.isArray(singlePiece.tags)) {
          existingTagsArray = singlePiece.tags;
        } else if (typeof singlePiece.tags === 'string') {
          existingTagsArray = singlePiece.tags.split(',').map(tag => tag.trim());
        }
      }
      // Convert new tags into an array
      let newTagsArray = [];
      if (typeof newTags === 'string') {
        newTagsArray = newTags.split(',').map(tag => tag.trim());
      } else if (Array.isArray(newTags)) {
        newTagsArray = newTags;
      }
      // Merge arrays and remove duplicates
      const mergedTags = Array.from(new Set([...existingTagsArray, ...newTagsArray]));
      // Set the merged tags as an array
      updatedPiece.tags = mergedTags;
    }
    // Update other fields from request, if provided
    updatedPiece.title = title;
    updatedPiece.date = date;
    updatedPiece.imageurl = imageurl;
    updatedPiece.description = description;
    // Update the database record with the merged data
    const dbUpdate = await client.query(
      `UPDATE pieces
       SET title = $1, date = $2, imageurl = $3, description = $4, tags = $5
       WHERE id = $6
       RETURNING *;`,
      [updatedPiece.title, updatedPiece.date, updatedPiece.imageurl, updatedPiece.description, updatedPiece.tags, pieceId]
    );
    res.status(201).json(dbUpdate.rows[0]);
  } catch (err) {
    console.error(err);
    next(err);
  }
});



// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
