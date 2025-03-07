// Importing Express
const express = require("express");
const apiRouter = express.Router();

// Function imports:
const {
  getAllPieces,
  getPieceById,
  createArtPiece,
  updateArtPiece,
  destroyArtPiece,
} = require("../db/db");

const { requireUser } = require("./utils");

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
apiRouter.post("/", requireUser, async (req, res, next) => {
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
        name: "PostCreationError",
        message: "There was an error creating your post. Please try again.",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

// Delete an art piece
apiRouter.delete("/:pieceId", requireUser, async (req, res, next) => {
  try {
    console.log(req.params);
    await destroyArtPiece(req.params.pieceId);
    res.send({ message: "deletion successful" });
  } catch (ex) {
    next(ex);
  }
});

// Change an art piece's info:
// postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
//   const { postId } = req.params;
//   const { title, content, tags } = req.body;

//   const updateFields = {};

//   if (tags && tags.length > 0) {
//     updateFields.tags = tags.trim().split(/\s+/);
//   }

//   if (title) {
//     updateFields.title = title;
//   }

//   if (content) {
//     updateFields.content = content;
//   }

//   try {
//     const originalPost = await getPostById(postId);

//     if (originalPost.author.id === req.admin.id) {
//       const updatedPost = await updatePost(postId, updateFields);
//       res.send({ post: updatedPost })
//     } else {
//       next({
//         name: 'UnauthorizedUserError',
//         message: 'You cannot update a post that is not yours'
//       })
//     }
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// All api route files need to export the router so that the api.js file can create a link:
module.exports = apiRouter;
// This can't be in curlies like function exports
