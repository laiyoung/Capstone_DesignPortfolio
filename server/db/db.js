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

/**
 * Admin Methods
 */
// Creating an admin data function (testDB function):
async function createAdmin({ username, password, name }) {
  try {
    const {
      rows: [admin],
    } = await client.query(
      `
      INSERT INTO admins(username, password, name) 
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
// Getting admin by Username (testDB function):
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
        message: "An admin with that username does not exist",
      };
    }

    return admin;
  } catch (error) {
    throw error;
  }
}

// Getting an admin by ID (testDB function):
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
  console.log(token);
  try {
    const tokenVal = token.split(" ")[1];
    // console.log("Token:"+ tokenVal);
    const payload = jwt.verify(tokenVal, JWT);
    // console.log("Payload:" + payload);
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

/**
 * Art Piece Methods
 */
// Creating an art piece data function (testDB function):
async function createArtPiece({
  authorId,
  title,
  date,
  image_url,
  description,
  tags = [],
}) {
  try {
    const {
      rows: [piece],
    } = await client.query(
      `
      INSERT INTO pieces("authorId", title, date, image_url, description) 
      VALUES($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [authorId, title, date, image_url, description]
    );
    console.log(piece);
    const tagList = await createTags(tags);

    return await addTagsToPiece(piece.id, tagList);
  } catch (error) {
    throw error;
  }
}

// Updating an art piece data function:
async function updateArtPiece(pieceId, fields = {}) {
  // read off the tags & remove that field (they're replaced later)
  const { tags } = fields; // might be undefined
  console.log (fields);
  delete fields.tags;

  // build the set string
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(
        `
        UPDATE pieces
        SET ${setString}
        WHERE id=${pieceId}
        RETURNING *;
      `,
      // Generating string-keyed property values
        Object.values(fields)
      );
    }

    // return early if there's no tags to update
    if (tags === undefined) {
      return await getPieceById(pieceId);
    }

    // make any new tags that need to be created
    const tagList = await createTags(tags);
    console.log(tagList);

    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");
    console.log(tagListIdString);

    // delete any piece_tags from the database which aren't in that tagList
    await client.query(
      `
      DELETE FROM piece_tags
      WHERE "tagId"
      NOT IN (${tagListIdString})
      AND "pieceId"=$1;
    `,
      [pieceId]
    );

    // and create piece_tags as necessary
    await addTagsToPiece(pieceId, tagList);

    return await getPieceById(pieceId);
  } catch (error) {
    throw error;
  }
}


// Deleting an art piece data function:
const destroyArtPiece = async (id) => {
  try {
    await client.query(`DELETE FROM piece_tags WHERE "pieceId"=$1`, [id]);
    await client.query(`DELETE FROM pieces WHERE id=$1`, [id]);
    console.log(id);

    return id;
  } catch (error) {
    throw error;
  }
};

// Getting an art piece by its ID (testDB function):
async function getPieceById(pieceId) {
  try {
    const {
      rows: [piece],
    } = await client.query(
      `
      SELECT *
      FROM pieces
      WHERE id=$1;
    `,
      [pieceId]
    );

    if (!piece) {
      throw {
        name: "PieceNotFoundError",
        message: "Could not find an art piece with that pieceId",
      };
    }

    const { rows: tags } = await client.query(
      `
      SELECT tags.*
      FROM tags
      JOIN piece_tags ON tags.id=piece_tags."tagId"
      WHERE piece_tags."pieceId"=$1;
    `,
      [pieceId]
    );

    const {
      rows: [author],
    } = await client.query(
      `
      SELECT id, username, name
      FROM admins
      WHERE id=$1;
    `,
      [piece.authorId]
    );

    piece.tags = tags;
    piece.author = author;
    delete piece.authorId;

    return piece;
  } catch (error) {
    throw error;
  }
}

/**
 * Project Methods
 */
// If we get here...LOL

/**
 * Tag Methods
 */
//Creating tags:
async function createTags(tagList) {
  // Ensure tagList is an array
  if (!Array.isArray(tagList)) {
    tagList = [tagList];
  }

  if (tagList.length === 0) {
    return;
  }

  const valuesStringInsert = tagList
    .map((_, index) => `$${index + 1}`)
    .join("), (");
  const valuesStringSelect = tagList
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  try {
    // Insert all tags, ignoring duplicates
    await client.query(
      `
      INSERT INTO tags(medium)
      VALUES (${valuesStringInsert})
      ON CONFLICT (medium) DO NOTHING;
    `,
      tagList
    );
    // Grab all tags and return
    const { rows } = await client.query(
      `
      SELECT * FROM tags
      WHERE medium IN (${valuesStringSelect});
    `,
      tagList
    );
    return rows;
  } catch (error) {
    throw error;
  }
}
// Inserting tags into the junction table
async function createPieceTag(pieceId, tagId) {
  try {
    await client.query(
      `
      INSERT INTO piece_tags("pieceId", "tagId")
      VALUES ($1, $2)
      ON CONFLICT ("pieceId", "tagId") DO NOTHING;
    `,
      [pieceId, tagId]
    );
  } catch (error) {
    throw error;
  }
}

//Adding tags to a piece
async function addTagsToPiece(pieceId, tagList) {
  try {
    const createPieceTagPromises = tagList.map((tag) =>
      createPieceTag(pieceId, tag.id)
    );

    await Promise.all(createPieceTagPromises);

    return await getPieceById(pieceId);
  } catch (error) {
    throw error;
  }
}

/**
 * Basic Group-Fetching Data Functions
 */
// Fetch All Admin (testDB function):
const getAllAdmins = async () => {
  const SQL = `
    SELECT id, username 
    FROM admins;
  `;
  const response = await client.query(SQL);
  return response.rows;
};
// Fetch All Art Pieces (testDB function):
async function getAllPieces() {
  try {
    const { rows: pieceIds } = await client.query(`
      SELECT id
      FROM pieces;
    `);
    // using getPieceById here allows you to grab the tags along with the piece info
    // the Promise.all batches the calls necessary to make the map
    const pieces = await Promise.all(
      pieceIds.map((piece) => getPieceById(piece.id))
    );

    return pieces;
  } catch (error) {
    throw error;
  }
}

// Fetch All Tags (testDB function):
async function getAllTags() {
  try {
    const { rows } = await client.query(`
      SELECT * 
      FROM tags;
    `);

    return { rows };
  } catch (error) {
    throw error;
  }
}

// Fetch Pieces by TagName (testDB function):
async function getPiecesByTagName(tagName) {
  try {
    const pieceIds = await client.query(
      `
      SELECT *
      FROM piece_tags
      WHERE "tagId"=(SELECT tags.id FROM tags WHERE tags.medium=$1);
    `,
      [tagName]
    );

    return pieceIds.rows;
  } catch (error) {
    throw error;
  }
}

// Fetch All Projects:
// Again, if we get here...LOL

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
  getPieceById,
};
