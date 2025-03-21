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
      name: "Instructor",
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

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Spring",
      date: "2007-03-08",
      image_url:
        "https://uca9656cbb64417d5cc2b37f27ea.previews.dropboxusercontent.com/p/thumb/ACmVJ0t2z0jlmYbeHbbDSqD5KMZ0a3r8_8wKbBiYVO8Y1L8XGYub0Q8S0EgmvV5O4oRJjefwQ2Zau16BtXR9_iO-VIjWuLYW3KodcJWDvvU5BQyFH7LQD--6LhRb7yflPyhmYzyjzEkGGwKSQs0BGxq39QXglU_snuRNhWf0y3ArjQI9LtsOPYdIWqfW7P4KOtEmu4x8tdRJkjgUskjHh2wO-eyQB0LQCw4gEmonIRmtcs-pnsAEAIvl5-dnAYoDBXjaXEwZj_KYtkHJXEYGcCPVX94sUx_4ZPQnWHz5bHo5BBVQZlFXxSiYTz0lnEu6kLafDIfLyuXZZiCbdDwR6nmaCBF347douR2dodQFWTRxastxHbwzT5xD3OIHh_1zWucjfdr1kBD2Yq-WlyrFQdct/p.jpeg?is_prewarmed=true",
      description: "Digital grayscale portrait.",
      tags: ["portrait", "digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Mirrored Rose",
      date: "2008-07-05",
      image_url:
        "https://ucce18c2495531084b7eb81bd6d3.previews.dropboxusercontent.com/p/thumb/ACmJtU8M1xGYcbpDCXjHUYmuvOSw3Nttvx0RAPKw9EEvi9zPjwbW5WRy5iOrMPHJp6LA60cRcEWj0bxweIQiN-c3TWbxCTPfR_Su8SRBSvOJTgzeqXLXC8odM1uwGmvke-JH0QAQMYy7lNSeDjvuErXhG7VzGPntlihb1Zh2Om8k0TrsEXjP5zdefS3kdwfWTZpP2LugvZ2NheOtC04yqYwjera36Bp4cVlTXLHei9cTX_uI2Do_GIxLVanR8mmVrdkabqJf5ffkD2q1fEADp9bHfgwbq6tS1efuwoVsSmX2gwropz-f0-cZASm4bljNOyBYuk-8jacz4RsLvnsgRcAN9PkL_ipfa2ElNkAZMJL59xa6YReuQ9pqqRQpDeR-W-vZtvVsSkmBwcFhao3fncHW/p.jpeg?is_prewarmed=true",
      description: "Digital art macro piece, enhanced using Adobe Photoshop.",
      tags: ["graphics", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "NYC Summer",
      date: "2009-05-31",
      image_url:
        "https://uc2e7ecf2ca701bc1dee68490ef3.previews.dropboxusercontent.com/p/thumb/ACl8Md8gHxYHx8n26KJG9uPriHldQfU6rkFI-woKDWVsabCvo5w0ZzVdsjwuhHicwohQWY4FZQ5V7JlxviPs66oYHTGbkio84Z8IgldBs-qwG_FMFna_cEjbILJzl8lL9udKlrJCyNDsJMrZu_mQMY_o6i1Mryfx4Xm8kd2jlBOJXX8hiYJbj1ML7mJjs6wQgOhQ_s713xBsaHMvA-JMQLz8qhZhgLpKo09iELprFOfOwSxmAyidJ-aHC9fL6oWHEFv7PkJyrVHJOPNmGhgco21YY0O9EVTwd82KSclEIohkEFZRsJzUBBkStAYFUEUq1EFsWOHB43pVjW-LPQOKYlbiN6b_TQsM5RecnXpneUVOrxpF25kBOqsqFz4ZEy6HmnXfik6n6Gjt2TCkNYFFWOBX/p.jpeg?is_prewarmed=true",
      description: "The Statue of Liberty in grayscale.",
      tags: ["digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Classic Chrome",
      date: "2010-08-21",
      image_url:
        "https://ucd472621bc51545df488719fa16.previews.dropboxusercontent.com/p/thumb/ACkiRowRL6h-gLAqpitRKe41VhZawKMka_C_FHY_AIbnCXzFunKz21J3BD68j1QxBIpNSskYqwSx1YyYkoNHNukUBWskiPixKJa1iVfM5StRZpgYxoCedjsXVufA0nsKkR95Ehmmm-TuHZpggyB43H1XFlDggMbow4J7QCFNk7Pi4eNCtQXxQxbSRT6jWFAk04fACS4YwGyvbQ0OcGgSk0nbMCI75s2IB89lYVPgGUXPoq6Bev-8Lfqd0PLGGFtqvHTYK4hhb9GdKntUXJ9sRZtYCCCirCr9lPo-Ej4ti5SZmYPLDkuRBKIp-pbH1aifFMpoI47RdjZSAr6m8xLUS90NklQB6glNEkHKs3RDpLYbgIV0idpDqhLG93zy9CBC6aAp-HHdSjgpSC_0CzYvA3i4/p.jpeg?is_prewarmed=true",
      description: "Film photo of a 1920s Ford, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cherub",
      date: "2010-08-23",
      image_url:
        "https://uccaac90cbe8440f3293f39d1af6.previews.dropboxusercontent.com/p/thumb/ACktqNmKma6HOJveys1-gXax32u_n_kCmqvQyfuquGXXq0vQnmwCj-LaY7CIP5tkVAZbdfw-ECK0NsGL-4k0frQjzts4o3CX7q7TdBC0Kq0UbEZqv8LObeK-aXRCnK1X6NmjCwHehyLUSsSwMbNiV8jxyWDvl8mInyZUvGAI6hQ5HuzjdjDlQH6x2F3CsHYGX_aNHzXBCAzGL3slfUvfpd0KGion8z5UGw2RWpy1kfC8oy_gj0v67ILT3Z0dsnbpqdi3rWvEzngAiZOWWkZjACyiJBNjKb0J8ycYRuSNgmNaKwFph6TmUeasG7Pg7lUm-ZlXiESuDRQ-BDDVNnNwO1zvJCknfliyRIW0aZQb5lg3Q3Weecn-KAK8Rp4VCPaI1Cnlabe5j9dqMoO_2tbgqBR9/p.jpeg?is_prewarmed=true",
      description: "A cherub statue at Oakland Cemetary in Atlanta, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Stained Dove",
      date: "2010-08-25",
      image_url: "https://ucb3cfc8faaeaeda313eb6208766.previews.dropboxusercontent.com/p/thumb/AClEO2gQQUGfphUwGNlwh4JrPW8DQImBbD45xu0TjwO4b7xF3SSELbKckD8ELMyLyLt13Sb8T9cq2QKP124R-ZlfAMJ_ikCBZ9TK-SKNSknxzqIdKULbGQXU9ajLRFWeLStT8n7ZbX1u3p7fDh6TCulEEX1PBjZ5c4cXQi9uQ9D-D7dGwwIvYDcOlmHvOj1_1des8K77YxriqvLmY80AK1eFyptQX4XF_BkLXk9Gd96I-NzmU7HZY829iqx64ZXKLJJCuSED2JYGmy3thSrmzIKx2BwcJohL2D6n6ci8gWXkAeveV5B11Ihuv1CaGMYF986AVxL8p8KLQm6Xxt_aYVuH11ArlU9YbGjlEePDnT-7QxWqgbRUUs9ZtadAOjK-fQvleKh0RFXOOrBazgNAP6oF/p.jpeg?is_prewarmed=true",
      description: "The stained glass window of a mausoleum at Oakland Cemetary in Atlanta, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fern Shadows",
      date: "2010-08-21",
      image_url: "https://ucf25a0f299a9a90f54bd75639aa.previews.dropboxusercontent.com/p/thumb/ACm7Mqi2OlnrH316qPGJmvUfFz-KG70ok9bQntChlL-I8zdvG1SwIc2xmItDKC-9ajb5qc1OoxHd3lbzfGaDmKdx8ltVOe8JPmeeSkybbw6CIrtQ2GFKejPhpKa5dxklwzkbgL93_UTIVPZ4nIsFwv5XZAkIGmM3JxB3bv0mQQkchdLv0xecevDo8FSexCuuH5ZKaw3tn349D-UHxHU_dJCVcYlNfZ8IHb06JRxtbcPTi-oeJaZV7oco62nWFjtZ9GhuZ0p1e7gbO8_Hs37boUyoBg2ZAfqLKuUZLxQWVLUE-OJ0lCK91Otq0AzYFUTxCVPdJbULV98jnD532TEm9gIkmejz51iDRVrKl-lOJr_fz9S-O6lKQtJmaFQiPil0m35PaCT_nauuZ_92HLJQWXy8/p.jpeg?is_prewarmed=true",
      description: "Ferns superimposed on brick. The overlay effect was created within the darkroom with layering techniques.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cherry Cross",
      date: "2010-10-25",
      image_url: "https://ucbf599bc8b5a4b2e8477586c37d.previews.dropboxusercontent.com/p/thumb/ACmnWaqGD8X5nrny8BPotywCURWd_q00xJJKPfy7VqaaPMnzPonP7NBB1F1JaCrNZu03PGjOMjVxUsnzqTmR8Ig76m--4gR4HBNidk6-GdVvPUZ9rURs8OOJHun7_QWjdfQ5ZeXNdfXu7N8NfprqnCNuz5iBLW32zA9nbdn2deb_uYsZ0x75u-S3lBEpYKE8jWN1hLMpvpK9NtehYSi7YGrw-fS9P8faJ0KbVuSFFAKBFYRAQWz-Ra5K-HVSzcjVTuZc23RhFyXzA1JZAC2auzMwU5juv4t4MRLFRQB_jCPBvJa3y_GRDweCO8BsmJJYa-FV0XkA66iSO3dxn-kGzPpWPJ6sUQ2q0SvLgC-K1XjMsEaKB2WvkHiXYo_-_EhqtxK8svulp5fXMYtcUmQFooQy/p.jpeg?is_prewarmed=true",
      description: "Cherry blossoms superimposed on wooden cross. The overlay effect was created within the darkroom with layering techniques.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "",
      date: "",
      image_url: "",
      description: "",
      tags: ["", ""],
    });
    
    await createArtPiece({
      authorId: laiyoung.id,
      title: "",
      date: "",
      image_url: "",
      description: "",
      tags: ["", ""],
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
