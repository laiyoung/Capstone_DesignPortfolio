/** Express + API Function Imports */
// Importing Express
const express = require("express");
const apiRouter = express.Router();

// JSON parser:
apiRouter.use(express.json());

// Middleware for printing information + errors:
apiRouter.use(require("morgan")("dev"));

// Importing bcrypt for comparing passwords:
const bcrypt = require("bcrypt");

// Function imports:
const {
  createAdmin,
  getAllAdmins,
  getAdminByUsername,
  findAdminWithToken,
} = require("../db/db");

// Token middleware:
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT || "shhh";

// Possible Admin Routes:
// Get all admin
apiRouter.get("/", async (req, res, next) => {
  try {
    res.send(await getAllAdmins());
  } catch (ex) {
    next(ex);
  }
});

// Admin login
apiRouter.post("/api/auth/login", async (req, res, next) => {
  try {
    // console.log ("inside login")
    console.log(req.body);
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});

// Authorization
apiRouter.get("/api/auth/me", findAdminWithToken, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

/** Art Piece API Routes that Require a Token */
// Add an art piece
// apiRouter.post(
//   "/api/users/:id/favorites",
//   findAdminWithToken,
//   async (req, res, next) => {
//     try {
//       res.status(201).send(
//         await createFavorite({
//           user_id: req.params.id,
//           product_id: req.body.product_id,
//         })
//       );
//     } catch (ex) {
//       next(ex);
//     }
//   }
// );

// Delete an art piece
// apiRouter.delete(
//   "/api/users/:user_id/favorites/:id",
//   findAdminWithToken,
//   async (req, res, next) => {
//     try {
//       await destroyFavorite({ user_id: req.params.user_id, id: req.params.id });
//       res.sendStatus(204);
//     } catch (ex) {
//       next(ex);
//     }
//   }
// );

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

//     if (originalPost.author.id === req.user.id) {
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

/** Project API Routes that Require a Token */
// These will be the same as the 1s for the art pieces

// More possible routes(these are more complex):
// So, you only have the '/' because usersRouter is defined as "/users" in the api/index.js.
// apiRouter.get("/", async (req, res, next) => {
//   try {
//     const users = await getAllUsers();

//     res.send({
//       users,
//     });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

// // Same here! You have to add "/users" in Postman
// apiRouter.post("/login", async (req, res, next) => {
//   const { username, password } = req.body;

//   // request must have both
//   if (!username || !password) {
//     next({
//       name: "MissingCredentialsError",
//       message: "Please supply both a username and password",
//     });
//   }

//   try {
//     const user = await getUserByUsername(username);
//     if (user && (await bcrypt.compare(password, user.password)) == true) {
//       const token = jwt.sign(
//         {
//           id: user.id,
//           username,
//         },
//         JWT_SECRET,
//         {
//           expiresIn: "1w",
//         }
//       );

//       res.send({
//         message: "you're logged in!",
//         token,
//       });
//     } else {
//       next({
//         name: "IncorrectCredentialsError",
//         message: "Username or password is incorrect",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//     next(error);
//   }
// });

// apiRouter.post("/register", async (req, res, next) => {
//   const { username, password, name, location } = req.body;

//   try {
//     const _user = await getUserByUsername(username);

//     if (_user) {
//       next({
//         name: "UserExistsError",
//         message: "A user by that username already exists",
//       });
//     }

//     const user = await createUser({
//       username,
//       password,
//       name,
//       location,
//     });

//     const token = jwt.sign(
//       {
//         id: user.id,
//         username,
//       },
//       JWT_SECRET,
//       {
//         expiresIn: "1w",
//       }
//     );

//     res.send({
//       message: "thank you for signing up",
//       token,
//     });
//   } catch ({ name, message }) {
//     next({ name, message });
//   }
// });

module.exports = apiRouter;
