// Importing Express
const express = require("express");
const apiRouter = express.Router();


// Get all art pieces: 
apiRouter.get("/api/products", async (req, res, next) => {
        try {
          res.send(await fetchProducts());
        } catch (ex) {
          next(ex);
        }
      });