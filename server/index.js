/** Express + API Functions */

// Imports from db.js file:
const {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorite,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  destroyFavorite,
  authenticate,
  findUserWithToken,
} = require("./db");

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


// App Routes:

// Get all users
app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUsers());
  } catch (ex) {
    next(ex);
  }
});

// Get all products
app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (ex) {
    next(ex);
  }
});

// User registration
app.post("/api/auth/register", async (req, res, next) => {
  try {
    res.send(await createUser(req.body));
  } catch (ex) {
    next(ex);
  }
});
// User login
app.post("/api/auth/login", async (req, res, next) => {
  try {
    // console.log ("inside login")
    console.log(req.body);
    res.send(await authenticate(req.body));
  } catch (ex) {
    next(ex);
  }
});
// Authorization
app.get("/api/auth/me", isLoggedIn, (req, res, next) => {
  try {
    res.send(req.user);
  } catch (ex) {
    next(ex);
  }
});

// Get all favorites for a user
app.get("/api/users/:id/favorites", isLoggedIn, async (req, res, next) => {
  try {
    if (req.params.id !== req.user.id) {
      const error = Error("not authorized");
      error.status = 401;
      throw error;
    }
    res.send(await fetchFavorites(req.params.id));
  } catch (ex) {
    next(ex);
  }
});
// Add a favorite for a user
app.post("/api/users/:id/favorites", isLoggedIn, async (req, res, next) => {
  try {
    res.status(201).send(
      await createFavorite({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});
// Delete a favorite for a user
app.delete(
  "/api/users/:user_id/favorites/:id",
  isLoggedIn,
  async (req, res, next) => {
    try {
      await destroyFavorite({ user_id: req.params.user_id, id: req.params.id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

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

  await createTables();
  console.log("tables created");
  // Initial data seeding:
  const [moe, lucy, ethyl, curly, foo, bar, bazz, quq, fip] = await Promise.all(
    [
      createUser({ username: "moe", password: "m_pw" }),
      createUser({ username: "lucy", password: "l_pw" }),
      createUser({ username: "ethyl", password: "e_pw" }),
      createUser({ username: "curly", password: "c_pw" }),
      createProduct({ name: "foo" }),
      createProduct({ name: "bar" }),
      createProduct({ name: "bazz" }),
      createProduct({ name: "quq" }),
      createProduct({ name: "fip" }),
    ]
  );

  console.log(await fetchUsers());
  console.log(await fetchProducts());

  console.log(await fetchFavorites(moe.id));
  const favorite = await createFavorite({
    user_id: moe.id,
    product_id: foo.id,
  });

  //Setting listening functionality:
  app.listen(port, () => console.log(`listening on port ${port}`));
};

// Init function invocation:
init();
