// Express imports:
const express = require('express');
// Importing the routes from ./api/index.js:
const tagsRouter = express.Router();
// You have to add the "/tags" bit in Postman 

// JSON parser:
tagsRouter.use(express.json());

// Middleware for printing information + errors:
tagsRouter.use(require("morgan")("dev"));

const { 
  getAllTags,
  getPostsByTagName
} = require('../db');

tagsRouter.get('/', async (req, res, next) => {
  try {
    const tags = await getAllTags();
  
    res.send({
      tags
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  let { tagName } = req.params;
  
  // decode %23happy to #happy
  tagName = decodeURIComponent(tagName)

  try {
    const allPosts = await getPostsByTagName(tagName);

    const posts = allPosts.filter(post => {
      if (post.active) {
        return true;
      }

      if (req.user && req.user.id === post.author.id) {
        return true;
      }

      return false;
    })

    res.send({ posts });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = tagsRouter;
