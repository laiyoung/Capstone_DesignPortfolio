/** Postgres Connection + SQL Interactions */

// Client set up and pg import:
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/design_portfolio_db"
);

//Hashing Encryption + Unique Identifier + JWT Imports:
const uuid = require("uuid");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT = process.env.JWT || "shhh";



// Creating a user data function:
const createUser = async ({ username, password }) => {
  const SQL = `
    INSERT INTO users(id, username, password) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [
    uuid.v4(),
    username,
    await bcrypt.hash(password, 5),
  ]);
  return response.rows[0];
};

// Creating a product data function:
const createProduct = async ({ name }) => {
  const SQL = `
    INSERT INTO products(id, name) 
    VALUES($1, $2) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
// Creating a favorite data function:
const createFavorite = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites(id, user_id, product_id) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};
// Deleting a favorite data function:
const destroyFavorite = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM favorites 
    WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};
// Authentification data function:
const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, username, password 
    FROM users 
    WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);

  if (
    !response.rows.length ||
    (await bcrypt.compare(password, response.rows[0].password)) === false
  ) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id }, JWT);
  console.log(token);
  return { token: token };
};

// Finding a user with a token data function:
const findUserWithToken = async (token) => {
  try {
    const payload = jwt.verify(token, JWT);
    id = payload.id;
    console.log("id: ", id);
  } catch (ex) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username 
    FROM users 
    WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if (!response.rows.length) {
    const error = Error("not authorized");
    error.status = 401;
    throw error;
  }
  console.log("response.rows[0]: ", response.rows[0]);
  return response.rows[0];
};

// Fetch Functions:
const fetchUsers = async () => {
  const SQL = `
    SELECT id, username 
    FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchProducts = async () => {
  const SQL = `
    SELECT * 
    FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchFavorites = async (user_id) => {
  const SQL = `
    SELECT * 
    FROM favorites 
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

// Exporting to the index.js file:
module.exports = {
  client,
  createUser,
  createProduct,
  fetchUsers,
  fetchProducts,
  fetchFavorites,
  createFavorite,
  destroyFavorite,
  authenticate,
  findUserWithToken,
};
