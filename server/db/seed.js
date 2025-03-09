/** File for Seeding Table Data */

// Imports from ./db/index.js:
const {
  client,
  createAdmin,
  createArtPiece,
  getAllAdmins,
  getAdminById,
  getAllPieces,
  getAllTags,
  getPiecesByTagName,
  getAdminByUsername,
  getPieceById,
} = require("./db");

// Dropping tables function:
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order (children first, then parents)
    await client.query(`
      DROP TABLE IF EXISTS piece_tags;
      DROP TABLE IF EXISTS pieces;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS admins;
    `);

    console.log("Finished dropping tables!");
  } catch (error) {
    console.error("Error dropping tables!");
    throw error;
  }
}

// Creating table function:
async function createTables() {
  try {
    console.log("Starting to build tables...");
    // create in  the reverse order of drop (parents first, then children)
    await client.query(`
      CREATE TABLE admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        active boolean DEFAULT true
      );

      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL
      );
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        medium VARCHAR(255) UNIQUE NOT NULL
      );

      CREATE TABLE pieces (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES admins(id),
        title TEXT NOT NULL,
        date DATE NOT NULL,
        image_url TEXT NOT NULL,
        description TEXT NOT NULL
      );


      CREATE TABLE piece_tags (
        "pieceId" INTEGER REFERENCES pieces(id) ON DELETE CASCADE,
        "tagId" INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY ("pieceId", "tagId")
      );

    `);

    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

// Creating initial admins:
async function createInitialAdmins() {
  try {
    console.log("Starting to create admins...");

    await createAdmin({
      username: "laiyoung",
      password: "hello",
      name: "Laigha",
    });

    await createAdmin({
      username: "instructor1",
      password: "grading",
      name: "Insructor",
    });

    console.log("Finished creating admins!");
  } catch (error) {
    console.error("Error creating admins!");
    throw error;
  }
}

// Creating initial pieces:
// Requires date format of: yyyy-mm-dd
async function createInitialPieces() {
  try {
    const [laiyoung, instructor1] = await getAllAdmins();

    console.log("Starting to create pieces...");
    await createArtPiece({
      authorId: laiyoung.id,
      title: "Pinhole Portrait 1",
      date:"2010-08-21",
      image_url: "https://www.dropbox.com/scl/fi/yo0x9rthszynr7q2kr8pw/2010Aug21_Art-Portfolio_010.jpg?rlkey=z1jvt0kmo7ij4y0zz7kn46v44&st=ijiww6sk&dl=0",
      description:
      "Portrait film photo, created using a handmade pinhole lightbox.",  
      tags: ["film", "pin-hole", "portrait"],
    });

    await createArtPiece({
      authorId: instructor1.id,
      title: "Pinhole Portrait 2",
      date:"2010-08-22",
      image_url: "https://www.dropbox.com/scl/fi/oxe1w7sd5p5wy99d4i6dj/2010Aug22_Art-Portfolio_021.jpg?rlkey=y747l2fet6ub0hr41y290s15q&st=b1lu9e2j&dl=0",
      description:
      "Portrait film photo, created using a handmade pinhole lightbox.",  
      tags: ["film", "pin-hole", "portrait"],
    });



    console.log("Finished creating art pieces!");
  } catch (error) {
    console.log("Error creating art pieces!");
    throw error;
  }
}
// Creating initial projects:

// Database function:
async function rebuildDB() {
  client.connect();
  try {
    // Running database creation functions
    await dropTables();
    await createTables();
    await createInitialAdmins();
    await createInitialPieces();
  } catch (error) {
    console.log("Error during rebuildDB");
    throw error;
  }
}

// Function for testing all database connections:
async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllAdmins");
    const admins = await getAllAdmins();
    console.log("Result:", admins);

    console.log("Calling getAllPieces");
    const pieces = await getAllPieces();
    console.log("Result:", pieces);

    console.log("Calling getAdminById with 2");
    const instructor1 = await getAdminById(2);
    console.log("Result:", instructor1);

    console.log("Calling getAdminByUsername laiyoung");
    const singleAdmin = await getAdminByUsername("laiyoung");
    console.log("Result:", singleAdmin);

    console.log("Calling getAllTags");
    const allTags = await getAllTags();
    console.log("Result:", allTags);

    console.log("Calling getPiecesByTagName with film");
    const piecesWithFilm = await getPiecesByTagName("film");
    console.log("Result:", piecesWithFilm);

    console.log("Calling getPieceById with 1");
    const artPiece1 = await getPieceById(1);
    console.log("Result:", artPiece1);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

// Promise methods for the database rebuild:
rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
