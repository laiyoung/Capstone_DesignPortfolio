/** Middleware and Listening Functionality */

// Functon imports:
const { client, findUserWithToken } = require("./db");

// Express imports:
const express = require("express");
const app = express();

// JSON parser:
app.use(express.json());

// Middleware for printing information + errors:
app.use(require("morgan")("dev"));

//For deployment only:
const path = require("path");
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../client/dist/index.html"))
);
app.use(
  "/assets",
  express.static(path.join(__dirname, "../client/dist/assets"))
);

// Middleware for logging in:
const isLoggedIn = async (req, res, next) => {
  try {
    req.user = await findUserWithToken(req.headers.authorization);
    next();
  } catch (ex) {
    next(ex);
  }
};

/**This little function produces a lovely print out of any error messages thrown by
 * any of the callback functions. It makes an object displayed in the console that
 * you can also grab and display on the client side:
 */
app.use((err, req, res, next) => {
  console.log(err);
  res
    .status(err.status || 500)
    .send({ error: err.message ? err.message : err });
});

// Init function declaration:
const init = async () => {
  // Client connection and port creation:
  const port = process.env.PORT || 3000;
  await client.connect();
  console.log("connected to database");

  //Setting listening functionality:
  app.listen(port, () => console.log(`listening on port ${port}`));
};

// Init function invocation:
init();

module.exports = {
  isLoggedIn,
};
