// Problem 2: Created a middleware function for requireUser, allowing a user to add + delete posts

// Importing findUserWithToken to build the user request: 
const { findAdminWithToken } = require("../db/db");

const requireUser = async (req, res, next) => {
  try {
    req.admin = await findAdminWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

// Function export (it's being used in the posts.js):
module.exports = {
  requireUser
}
