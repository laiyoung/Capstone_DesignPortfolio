/** Postgres Connection + SQL Interaction Models */

// Client set up and pg import:
const pg = require("pg");
const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/design_portfolio_db"
);

//Hashing Encryption + Unique Identifier + JWT Imports:
// const uuid = require("uuid");
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
  // console.log(token);
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
  // console.log (fields);
  delete fields.tags;

  if (!tags) {
    tags = [];
  }

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
    if (tags.length === 0) {
      return await getPieceById(pieceId);
    }

    // make any new tags that need to be created
    const tagList = await createTags(tags);
    // console.log(tagList);

    const tagListIdString = tagList.map((tag) => `${tag.id}`).join(", ");
    // console.log(tagListIdString);

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
// Creating a project data function (testDB function):
async function createProject({
  title,
  location,
  role,
  blurb,
  markers = [],
}) {
  try {
    const {
      rows: [project],
    } = await client.query(
      `
      INSERT INTO projects(title, location, role, blurb) 
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [title, location, role, blurb]
    );
    console.log(project);
    const markerList = await createMarkers(markers);

    return await addMarkersToPiece(project.id, markerList);
  } catch (error) {
    throw error;
  }
}

// Getting a project piece by its ID:
async function getProjectById(projectId) {
  try {
    const {
      rows: [project],
    } = await client.query(
      `
      SELECT *
      FROM projects
      WHERE id=$1;
    `,
      [projectId]
    );

    if (!project) {
      throw {
        name: "ProjectNotFoundError",
        message: "Could not find a project with that projectId",
      };
    }

    const { rows: markers } = await client.query(
      `
      SELECT markers.*
      FROM markers
      JOIN project_markers ON markers.id=project_markers."markerId"
      WHERE project_markers."projectId"=$1;
    `,
      [projectId]
    );

    project.markers = markers;
   
    return project;
  } catch (error) {
    throw error;
  }
}

// Creating a project photo data function (testDB function):
const createProjectPhoto = async ({
  title,
  projectId,
  image_url,
}) => {
  const SQL = ` 
  INSERT INTO project_photos(title, projectId, image_url) 
  VALUES($1, (SELECT id FROM projects WHERE name =$2), $3)  
  RETURNING *`;

  const result = await client.query(SQL, [
    title,
    projectId,
    image_url,
  ]);
  return result.rows[0];
};

/**
 * Marker Methods
 */
// Creating a marker type array:
markerList = [
  //Languages & Tools 
  { title: 'JavaScript', type: 'Languages & Tools' },
  { title: 'ArcGIS (Spatial Data Analysis)', type: 'Languages & Tools' },
  { title: 'Adobe Creative Suite', type: 'Languages & Tools' },
  { title: 'HTML', type: 'Languages & Tools' },
  { title: 'CSS', type: 'Languages & Tools' },
  { title: 'Node', type: 'Languages & Tools' },
  { title: 'GitHub/Git', type: 'Languages & Tools' },
  { title: 'SQL', type: 'Languages & Tools' },
  { title: 'Microsoft Office', type: 'Languages & Tools' },
  { title: 'Figma', type: 'Languages & Tools' },
  { title: 'PostgreSQL', type: 'Languages & Tools' },
  { title: 'Express', type: 'Languages & Tools' },
  { title: 'React', type: 'Languages & Tools' },
  { title: 'Postman API Development', type: 'Languages & Tools' },
  { title: 'REST APIs', type: 'Languages & Tools' },

  //Competencies 
  { title: 'Participant Observation', type: 'Competencies' },
  { title: 'Social Research', type: 'Competencies' },
  { title: 'Interviewing', type: 'Competencies' },
  { title: 'Ethnographic & Network Research', type: 'Competencies' },
  { title: 'Bioethics', type: 'Competencies' },
  { title: 'Full Stack Development', type: 'Competencies' },
  { title: 'Front End Development', type: 'Competencies' },
  { title: 'Back End Development', type: 'Competencies' },

  //Additional Critical Proficiencies
  { title: 'Adaptive Problem-Solving', type: 'Additional Critical Proficiencies' },
  { title: 'Data-Informed Decision Making', type: 'Additional Critical Proficiencies' },
  { title: 'Active Listening', type: 'Additional Critical Proficiencies' },
  { title: 'Effective Communication', type: 'Additional Critical Proficiencies' },
  { title: 'Teamwork', type: 'Additional Critical Proficiencies' },
  { title: 'Collaboration', type: 'Additional Critical Proficiencies' },
  { title: 'Relentless Curiosity', type: 'Additional Critical Proficiencies' },

]

// Creating a project marker data function (testDB function):
//Creating markers:
async function createMarkers(markerList) {
  // console.log("markerList in createMarkers", markerList);
  if (!Array.isArray(markerList)) {
    markerList = [markerList];
  }

  if (markerList.length === 0) {
    return;
  }

  const values = [];
  const valuesStringInsert = markerList
    .map((_, index) => {
      const offset = index * 2;
      values.push(markerList[index].title, markerList[index].type);
      return `($${offset + 1}, $${offset + 2})`;
    })
    .join(", ");

  try {
    await client.query(
      `
      INSERT INTO markers(title, type)
      VALUES ${valuesStringInsert}
      ON CONFLICT (title) DO NOTHING;
    `,
      values
    );

    const titles = markerList.map((m) => m.title);
    const valuePlaceholders = titles.map((_, i) => `$${i + 1}`).join(", ");

    const { rows } = await client.query(
      `
      SELECT * FROM markers
      WHERE title IN (${valuePlaceholders});
    `,
      titles
    );

    return rows;
  } catch (error) {
    throw error;
  }
}
// Inserting markers into the junction table
async function createProjectMarkerJunction(pieceId, markerId, type) {
  try {
    await client.query(
      `
      INSERT INTO project_markers("projectId", "markerId", type)
      VALUES ($1, $2, $3)
      ON CONFLICT ("projectId", "markerId") DO NOTHING;
    `,
      [pieceId, markerId, type]
    );
  } catch (error) {
    throw error;
  }
}

//Adding markers to a project
async function addMarkersToPiece(projectId, markerList) {
  try {
    const createProjectMarkerPromises = markerList.map((marker) =>
      createProjectMarkerJunction(projectId, marker.id, marker.type)
    );

    await Promise.all(createProjectMarkerPromises);

    return await getProjectById(projectId);
  } catch (error) {
    throw error;
  }
}


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

// Fetch All Projects (testDB function):
async function getAllProjects() {
  try {
    const { rows: projectIds } = await client.query(`
      SELECT id
      FROM projects;
    `);
    // using getProjectById here allows you to grab the tags along with the project info
    // the Promise.all batches the calls necessary to make the map
    const projects = await Promise.all(
      projectIds.map((project) => getProjectById(project.id))
    );

    return projects;
  } catch (error) {
    throw error;
  }
}

// Fetch All Markers (testDB function):

// Fetch Project Photos by Marker (testDB function):

// Fetch Project Photos by ProjectName (testDB function):






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
  createProject,
  createProjectPhoto,
  getAllAdmins,
  getAllPieces,
  getAllTags,
  getAllProjects,
  getPiecesByTagName,
  getPieceById,
};
