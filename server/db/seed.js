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
// The tag column registers as null initially because the tags don't get added until later
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
        image_url VARCHAR(1000) NOT NULL,
        description TEXT NOT NULL,
        tags TEXT
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
      date: "2010-08-21",
      image_url:
        "https://uc28373a0e1b89a4b10836eb177e.previews.dropboxusercontent.com/p/thumb/ACn8DX4YxIWUTLNJKaMGzg5w24PFSEdahq_cOscctNFhUL38_YSTO9z_eoTQn6uMetntUeIDD4omEsxbYbLE8vDqO2n5oRMoHM1Lx35vxYLTeyLleX1VC9Re9spcs_uIf22Xhk2U7Ol8I7s6bQ2u8B6ZnyoPvu1oZDtv6YnrPBNZzkIc5aCjy0W6P5Wu3yc0FuKd2as6YHg3p65xWVCKG0Z0hJ_wI69M2qoHKifGcD52vD3XkINf5MWo6HSdRZZ6zwfYrZTjZIINvB9F5Zi9cP1j6TY7k5N0IFe0Fz_CEe_r2iXdlHQwVC9qw-D8Tq2dWVLbkm4XiZ38vqvAlVSCFTv-AIVVqdb33-I8KQTlAAOh459FkefJMjUyZhzSg-rNp-7gsDD28TdMDmGZO-q8x_su/p.jpeg?is_prewarmed=true",
      description:
        "Portrait film photo, created using a handmade pinhole lightbox.",
      tags: ["film", "pin-hole", "portrait"],
    });

    await createArtPiece({
      authorId: instructor1.id,
      title: "Pinhole Portrait 2",
      date: "2010-08-22",
      image_url:
        "https://uccfffacff3f433af66f3ff338f4.previews.dropboxusercontent.com/p/thumb/ACm-5fYP0OItYmahEs4FkRa3RDdzyV8d_RCM2iBB_goCqazsJWAMP1lhIGy77b7vRHvWbfDOhrNdWuXldAu0AEqSrdWFtl0q_4HdcoSp50gZbEZaxK2O7_qgVQb-s21S0Ok60sn9fo8lLmyY9JbG8Pz55H1XtLciem4X8JLNcSYFKzX7JskKz-O3m_geyE3iMgsKRuj6lU-6kacnXux2e3peIX-V3Ul-pzD1TYifhWoBQiNKhfxqYaFqsREVVb1xY_6CkjOsg37_Rp7m6QEfFtQydqUSAjSO1RVbfFU8N0On6ZhHDPI0AMTWhjA35MmHNt6kFB-_FXR-SmGqbH5-kRIiqGGFGPEWaQDZH-csJIijlkCP5h2MZ4UFds9aMMPg5f4I3TBuLbAM3ZVL4p2zFUDV/p.jpeg?is_prewarmed=true",
      description:
        "Portrait film photo, created using a handmade pinhole lightbox.",
      tags: ["film", "pin-hole", "portrait"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Calla Lily",
      date: "2018-06-08",
      image_url:
        "https://uca346b4f1abe3adde85a93a06cc.previews.dropboxusercontent.com/p/thumb/AClL7aNj5CeFvibzHuYQHz9nJHB7nE81sEaouS1wad-4R5hZRwLgAJyTXieYLQqLDh4zUOXg9sRyR_vVvEXU_xt_7xpokua5_0CrZzX7uW2qAV1jarcIGtIfp_Rx5Wnwqx-JZFSqObzFcUA8TTuEpmhg83w3VTDbOXgH5nU_V3WjOQy1ROOdIdRXlWka4lSsNAs90s5VeIedKiGQyCjg6PN9fib5ddufblYH67dK_tszWyw38SpVF-lvXcE4vJttsn_2td64eCM3M79U0PcsSMTmBHJL1nLBeMIG7iWqFbQ3imAopYffBU5Tb5qADYuUx9kOeN4Dnnc6CPGtrSxzmZZOgYbJr-zwN96lmwbHMrQwtKjcCxaypku6-9l8Wsg_pL1mgvpx3nsh8LqQHGFPnuyS/p.jpeg?is_prewarmed=true",
      description: "Digital macro of a calla lily.",
      tags: ["digital", "macro"],
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
