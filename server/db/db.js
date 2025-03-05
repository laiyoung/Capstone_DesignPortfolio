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


/** Administrator data functions */
// Creating an admin data function:
async function createAdmin({ username, password, name }) {
  try {
    const {
      rows: [admin],
    } = await client.query(
      `
      INSERT INTO users(username, password, name) 
      VALUES($1, $2, $3) 
      ON CONFLICT (username) DO NOTHING 
      RETURNING *;
    `,
      [username, await bcrypt.hash(password, 5), name]
    );

    return admin;
  } catch (error) {
    throw error;
  }
}
// Getting admin by Username:
async function getAdminByUsername(username) {
  try {
    const {
      rows: [admin],
    } = await client.query(
      `
      SELECT *
      FROM admins
      WHERE username=$1
    `,
      [username]
    );

    if (!admin) {
      throw {
        name: "AdminNotFoundError",
        message: "A admin with that username does not exist",
      };
    }

    return admin;
  } catch (error) {
    throw error;
  }
}

// Getting an admin by ID:
async function getAdminById(adminId) {
  try {
    const {
      rows: [admin],
    } = await client.query(`
      SELECT id, username, name, active
      FROM admins
      WHERE id=${adminId}
    `);

    if (!admin) {
      throw {
        name: "AdminNotFoundError",
        message: "An admin with that id does not exist",
      };
    }

    return admin;
  } catch (error) {
    throw error;
  }
}


// Authentification data function:
const authenticate = async ({ username, password }) => {
  const SQL = `
    SELECT id, username, password 
    FROM admins 
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

// Finding an admin with a token data function:
const findAdminWithToken = async (token) => {
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
    FROM admins 
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

/** Art Piece data functions */
// Creating an art piece data function:
const createArtPiece = async ({ name }) => {
  const SQL = `
    INSERT INTO products(id, name) 
    VALUES($1, $2) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name]);
  return response.rows[0];
};
// Updating an art piece data function:
const updateArtPiece = async ({ user_id, product_id }) => {
  const SQL = `
    INSERT INTO favorites(id, user_id, product_id) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, product_id]);
  return response.rows[0];
};
// Deleting a favorite data function:
const destroyArtPiece = async ({ user_id, id }) => {
  const SQL = `
    DELETE FROM favorites 
    WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

/** Basic Fetching data functions */
// Fetch All Admin:
const getAllAdmins = async () => {
  const SQL = `
    SELECT id, username 
    FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};
// Fetch All Art Pieces:
const getAllPieces = async () => {
  const SQL = `
    SELECT * 
    FROM products;
  `;
  const response = await client.query(SQL);
  return response.rows;
};
// Fetch All Tags:
const getAllTags = async (user_id) => {
  const SQL = `
    SELECT * 
    FROM favorites 
    WHERE user_id = $1
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};
// Fetch Pieces by TagName:



// Exporting to the index.js file:
module.exports = {
  client,
  createAdmin,
  getAdminById,
  getAdminByUsername,
  authenticate,
  findAdminWithToken,
  createArtPiece,
  updateArtPiece,
  destroyArtPiece,
  getAllAdmins,
  getAllPieces,
  getAllTags,
  getPiecesByTagName,
};
