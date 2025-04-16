/** File for Seeding Table Data */

// Imports from ./db/index.js:
const {
  client,
  createAdmin,
  createArtPiece,
  createProject,
  createProjectPhoto,
  getAllAdmins,
  getAdminById,
  getAllPieces,
  getAllTags,
  getAllMarkers,
  getAllProjects,
  getProjectPhotos,
  getPiecesByTagName,
  getProjectsByMarkerName,
  getAdminByUsername,
  getPieceById,
} = require("./db");

// Dropping tables function:
async function dropTables() {
  try {
    console.log("Starting to drop tables...");

    // have to make sure to drop in correct order (children first, then parents)
    await client.query(`
      DROP TABLE IF EXISTS project_photos;
      DROP TABLE IF EXISTS piece_tags;
      DROP TABLE IF EXISTS project_markers;
      DROP TABLE IF EXISTS pieces;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS projects;
      DROP TABLE IF EXISTS markers;
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

      CREATE TABLE markers (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) UNIQUE,
        type VARCHAR(255) CHECK (type IN ('Languages & Tools', 'Competencies', 'Additional Critical Proficiencies'))
      );

      CREATE TABLE projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        thumbnail VARCHAR(2000) NOT NULL,
        blurb TEXT NOT NULL,
        markers TEXT
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
        image_url VARCHAR(2000) NOT NULL,
        description TEXT NOT NULL,
        tags TEXT
      );

      CREATE TABLE project_markers (
        "projectId" INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        "markerId" INTEGER REFERENCES markers(id) ON DELETE CASCADE,
        type VARCHAR(255) CHECK (type IN ('Languages & Tools', 'Competencies', 'Additional Critical Proficiencies')),
        PRIMARY KEY ("projectId", "markerId") 
      );

      CREATE TABLE piece_tags (
        "pieceId" INTEGER REFERENCES pieces(id) ON DELETE CASCADE,
        "tagId" INTEGER REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY ("pieceId", "tagId")
      );

      CREATE TABLE project_photos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        "projectId" INTEGER REFERENCES projects(id),
        image_url VARCHAR(2000) NOT NULL
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

// Creating initial projects:
async function createInitialProjects() {
  try {
    console.log("Starting to create projects...");

    await createProject({
      title:
        "The Blues Tradition: Building Dialogical Relation within Utopian Imaginaries",
      location: "Liège, Belgium",
      role: "Researcher",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579703/AnnotationsOnADiagram_cqioag.jpg",
      blurb:
        "Working group on imagination within cooperatives and social enterprises in the era of the captitalocene.",
        markers: [
          { title: "Collaboration", type: "Additional Critical Proficiencies" },
          { title: "Active Listening", type: "Additional Critical Proficiencies" },
          { title: "Effective Communication", type: "Additional Critical Proficiencies" },
          { title: "Microsoft Office", type: "Languages & Tools" },
          { title: "Social Research", type: "Competencies" },
        ],
    });
    await createProject({
      title:
        "Process Design Innovation with the Vancouver Island Health Authority",
      location: "Victoria, British Columbia, Canada",
      role: "Researcher & Senior Analyst",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579770/1DSC_0192_k8e2an.jpg",
      blurb:
        "Working with Vancouver Island Health Authority (Island Health) representatives to design more efficient processes for Island Health’s departments and centers.",
        markers: [
          { title: 'Adobe Creative Suite', type: 'Languages & Tools' },
          { title: 'Participant Observation', type: 'Competencies' },
          { title: 'Interviewing', type: 'Competencies' },
          { title: 'Ethnographic & Network Research', type: 'Competencies' },
          { title: 'Bioethics', type: 'Competencies' },
          { title: 'Collaborative Deliberation', type: 'Competencies' },
          { title: 'Adaptive Problem-Solving', type: 'Additional Critical Proficiencies' },
          { title: 'Data-Informed Decision Making', type: 'Additional Critical Proficiencies' },
          { title: 'Relentless Curiosity', type: 'Additional Critical Proficiencies' },
          { title: 'Teamwork', type: 'Additional Critical Proficiencies' },
          { title: 'Active Listening', type: 'Additional Critical Proficiencies' },
          { title: 'Effective Communication', type: 'Additional Critical Proficiencies' },
          { title: 'Microsoft Office', type: 'Languages & Tools' },
        ],
    });
    await createProject({
      title:
        "Building Community Spaces with The Greater Victoria Placemaking Society & The BC Libraries Cooperative",
      location: "Victoria, British Columbia, Canada",
      role: "Consultant & Researcher",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579886/DSC_0053_xdul0f.jpg",
      blurb:
        "Laying the foundations for greenspace networks and learning hubs in Victoria, British Columbia.",
        markers: [
          { title: 'ArcGIS (Spatial Data Analysis)', type: 'Languages & Tools' },
          { title: 'Interviewing', type: 'Competencies' },
          { title: 'Collaborative Deliberation', type: 'Competencies' },
          { title: 'Data-Informed Decision Making', type: 'Additional Critical Proficiencies' },
          { title: 'Relentless Curiosity', type: 'Additional Critical Proficiencies' },
          { title: 'Active Listening', type: 'Additional Critical Proficiencies' },
          { title: 'Effective Communication', type: 'Additional Critical Proficiencies' },
          { title: 'Microsoft Office', type: 'Languages & Tools' },
          { title: 'Social Research', type: 'Competencies' },
        ],
    });
    await createProject({
      title:
        "Barbee Farms Assessment for Value-Added Products",
      location: "Concord, North Carolina, USA",
      role: "Designer & Senior Analyst",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579939/Picture2_cfwbc8.jpg",
      blurb:
        "Cost-benefit analysis for a local family farm considering constructing an industrial kitchen intended to enable the creation of value-added products. ",
        markers: [
          { title: 'Adobe Creative Suite', type: 'Languages & Tools' },
          { title: 'Interviewing', type: 'Competencies' },
          { title: 'Photography', type: 'Competencies' },
          { title: 'Adaptive Problem-Solving', type: 'Additional Critical Proficiencies' },
          { title: 'Data-Informed Decision Making', type: 'Additional Critical Proficiencies' },
          { title: 'Collaboration', type: 'Additional Critical Proficiencies' },
          { title: 'Teamwork', type: 'Additional Critical Proficiencies' },
          { title: 'Active Listening', type: 'Additional Critical Proficiencies' },
          { title: 'Effective Communication', type: 'Additional Critical Proficiencies' },
          { title: 'Microsoft Office', type: 'Languages & Tools' },
        ],
    });
    await createProject({
      title:
        "Sow Much Good Curriculum Development",
      location: "Charlotte, North Carolina, USA",
      role: "Designer & Researcher",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579982/359_zgcomf.jpg",
      blurb:
        "Designing educational curriculum and brochures for the Charlotte non-profit Sow Much Good. ",
        markers: [
          { title: 'Adobe Creative Suite', type: 'Languages & Tools' },
          { title: 'Interviewing', type: 'Competencies' },
          { title: 'Photography', type: 'Competencies' },
          { title: 'Ethnographic & Network Research', type: 'Competencies' },
          { title: 'Collaboration', type: 'Additional Critical Proficiencies' },
          { title: 'Teamwork', type: 'Additional Critical Proficiencies' },
          { title: 'Active Listening', type: 'Additional Critical Proficiencies' },
          { title: 'Effective Communication', type: 'Additional Critical Proficiencies' },
          { title: 'Microsoft Office', type: 'Languages & Tools' },
        ],
    });
    await createProject({
      title:
        "The Library App",
      location: "New York, NY, USA",
      role: "Front End Developer & UX Designer",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580027/1Homepage_yaieqq.jpg",
      blurb:
        "Front end development example for a public library application.",
        markers: [
          { title: 'JavaScript', type: 'Languages & Tools' },
          { title: 'HTML', type: 'Languages & Tools' },
          { title: 'CSS', type: 'Languages & Tools' },
          { title: 'Node', type: 'Languages & Tools' },
          { title: 'GitHub/Git', type: 'Languages & Tools' },
          { title: 'Figma', type: 'Languages & Tools' },
          { title: 'Express', type: 'Languages & Tools' },
          { title: 'React', type: 'Languages & Tools' },
          { title: 'REST APIs', type: 'Languages & Tools' },
          { title: 'Front End Development', type: 'Competencies' },
        ],
    });
    await createProject({
      title:
        "Design Portfolio ",
      location: "New York, NY, USA",
      role: "Full Stack Developer & UX Designer",
      thumbnail: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744587721/Screenshot_2025-04-13_at_7.38.11_PM_xcn5nq.png",
      blurb:
        "Full stack application for a design engineering portfolio.",
        markers: [
          { title: 'JavaScript', type: 'Languages & Tools' },
          { title: 'HTML', type: 'Languages & Tools' },
          { title: 'CSS', type: 'Languages & Tools' },
          { title: 'Node', type: 'Languages & Tools' },
          { title: 'GitHub/Git', type: 'Languages & Tools' },
          { title: 'SQL', type: 'Languages & Tools' },
          { title: 'Figma', type: 'Languages & Tools' },
          { title: 'PostgreSQL', type: 'Languages & Tools' },
          { title: 'Express', type: 'Languages & Tools' },
          { title: 'React', type: 'Languages & Tools' },
          { title: 'Postman API Development', type: 'Languages & Tools' },
          { title: 'REST APIs', type: 'Languages & Tools' },
          { title: 'Full Stack Development', type: 'Competencies' },
          { title: 'Front End Development', type: 'Competencies' },
          { title: 'Back End Development', type: 'Competencies' },
        ],
    });

    console.log("Finished creating projects!");
  } catch (error) {
    console.log("Error creating projects!");
    throw error;
  }
}

//Creating initial project photos:
async function createInitialProjectPhotos() {
  try {
    console.log("Starting to create project photos...");

    console.log("Project 1 Photos");
    await createProjectPhoto({
     title: "Book Notes",
     projectId: 1,
     image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579703/AnnotationsOnADiagram_cqioag.jpg" ,
    });

    console.log("Project 2 Photos");
    await createProjectPhoto({
      title: "Royal Jubilee Hospital",
      projectId: 2,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579770/1DSC_0192_k8e2an.jpg" ,
    });
    await createProjectPhoto({
      title: "Facilities",
      projectId: 2,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579771/2DSC_0216_kwoniv.jpg" ,
    });
    await createProjectPhoto({
      title: "Diabetes Center Flow Diagram",
      projectId: 2,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579769/InitialApptProtocol_ikzddc.jpg" ,
    });
    await createProjectPhoto({
      title: "Alert System UI: Daily appointments are visible to authorized staff and clinicians",
      projectId: 2,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579768/DailyAppts_b0tevf.jpg" ,
    });
    await createProjectPhoto({
      title: "Alert System UI: Only missed appointments are red ",
      projectId: 2,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579767/MissesAppt_zvfkcl.jpg" ,
    });

    console.log("Project 3 Photos");
    await createProjectPhoto({
      title: "Victoria Inner Harbor from Wharf Street",
      projectId: 3,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579886/DSC_0053_xdul0f.jpg" ,
    });
    await createProjectPhoto({
      title: "Victoria Inner Harbor from Victoria West",
      projectId: 3,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579887/DSC_0138_i0v4qo.jpg" ,
    });
    await createProjectPhoto({
      title: "Cowichan Bay",
      projectId: 3,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579888/DSC_0178_sya2iz.jpg" ,
    });
    await createProjectPhoto({
      title: "Victoria’s Chinatown National Historical Site",
      projectId: 3,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579889/DSC_0237_zwwynu.jpg" ,
    });
    await createProjectPhoto({
      title: "Historic Alley Route",
      projectId: 3,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579890/DSC_0240_ginmwq.jpg" ,
    });

    console.log("Project 4 Photos");
    await createProjectPhoto({
      title: "Peaches",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579940/010_mxzicj.jpg" ,
    });
    await createProjectPhoto({
      title: "Pint of Peppers",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579934/013_o8dv0w.jpg" ,
    });
    await createProjectPhoto({
      title: "Trail Through The Fields",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579936/2011Jul17_Oddessey_264_hvfjpu.jpg" ,
    });
    await createProjectPhoto({
      title: "Dogwood Flowers",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579937/2012Mar24_Davidson_College_002_cdbpin.jpg" ,
    });
    await createProjectPhoto({
      title: "Dogwood Buds",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579938/2012Mar24_Davidson_College_003_skhciq.jpg" ,
    });
    await createProjectPhoto({
      title: "Rapeseed Fields",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579939/Picture2_cfwbc8.jpg" ,
    });
    await createProjectPhoto({
      title: "Potential Revenue Table",
      projectId: 4,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579941/Potential_Revenue_zxfsdb.jpg" ,
    });

    console.log("Project 5 Photos");
    await createProjectPhoto({
      title: "Robin Emmons",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579984/291_mlpmze.jpg" ,
    });
    await createProjectPhoto({
      title: "Davidson College Volunteers at the New Farm",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579983/304_jrdz4d.jpg" ,
    });
    await createProjectPhoto({
      title: "Sow Much Good Produce Truck",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579978/324_eik50y.jpg" ,
    });
    await createProjectPhoto({
      title: "Potatoes",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579982/359_zgcomf.jpg" ,
    });
    await createProjectPhoto({
      title: "Davidson College Volunteers Clearing Trees at the New Farm",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579985/313_i6btw4.jpg" ,
    });
    await createProjectPhoto({
      title: "Ecosystems Brochure Page 1",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579979/Ecosytems_Brochure_pg1_jp8tkh.jpg" ,
    });
    await createProjectPhoto({
      title: "Ecosystems Brochure Page 2",
      projectId: 5,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579980/Ecosytems_Brochure_pg2_witsj0.jpg" ,
    });

    console.log("Project 6 Photos");
    await createProjectPhoto({
      title: "Catalog",
      projectId: 6,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580027/1Homepage_yaieqq.jpg" ,
    });
    await createProjectPhoto({
      title: "Book Status and Description Button",
      projectId: 6,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580028/2Status_Description_ft8tkj.jpg" ,
    });
    await createProjectPhoto({
      title: "Search Results ",
      projectId: 6,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580029/3SearchResults_uzmvvq.jpg" ,
    });
    await createProjectPhoto({
      title: "Account View ",
      projectId: 6,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580031/4AccountView_vrdxxq.jpg" ,
    });
    await createProjectPhoto({
      title: "Returns",
      projectId: 6,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580032/5Returns_tmcnul.jpg" ,
    });
    await createProjectPhoto({
      title: "Reservations",
      projectId: 6,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744580033/6Reservations_nkfymh.jpg" ,
    });

    console.log("Project 7 Photos");
    await createProjectPhoto({
      title: "Design Portfolio Navigation",
      projectId: 7,
      image_url: "https://res.cloudinary.com/duk7xkc40/image/upload/v1744587721/Screenshot_2025-04-13_at_7.38.11_PM_xcn5nq.png" ,
    });


    console.log("Finished creating project photos!");
  } catch (error) {
    console.log("Error creating project photos!");
    throw error;
  }
}
// Creating initial pieces (requires date format of: yyyy-mm-dd):
async function createInitialPieces() {
  try {
    const [laiyoung, instructor1] = await getAllAdmins();

    console.log("Starting to create pieces...");
    await createArtPiece({
      authorId: laiyoung.id,
      title: "Pinhole Portrait 1",
      date: "2010-08-21",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579605/2010Aug21_Art_Portfolio_010_pk5ael.jpg",
      description:
        "Portrait film photo, created using a handmade pinhole lightbox.",
      tags: ["film", "pin-hole", "portrait"],
    });

    await createArtPiece({
      authorId: instructor1.id,
      title: "Pinhole Portrait 2",
      date: "2010-08-22",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579616/2010Aug22_Art_Portfolio_021_hbnfqe.jpg",
      description:
        "Portrait film photo, created using a handmade pinhole lightbox.",
      tags: ["film", "pin-hole", "portrait"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Calla Lily",
      date: "2018-06-08",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579631/2018Jun08_P6080005_bofa6p.jpg",
      description: "Digital macro of a calla lily.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Spring",
      date: "2007-03-08",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579623/2007Mar08_Hannah_s_White_Dress_009-1_bjmwwy.jpg",
      description: "Digital grayscale portrait.",
      tags: ["portrait", "digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Mirrored Rose",
      date: "2008-07-05",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579605/2008Jul05_Art_Portfolio_001_quczwg.jpg",
      description: "Digital art macro piece, enhanced using Adobe Photoshop.",
      tags: ["graphics", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "NYC Summer",
      date: "2009-05-31",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579607/2009May31_Art_Portfolio_002_jauz0q.jpg",
      description: "The Statue of Liberty in grayscale.",
      tags: ["digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Classic Chrome",
      date: "2010-08-21",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579607/2010Aug21_Art_Portfolio_008_pnmtye.jpg",
      description: "Film photo of a 1920s Ford, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cherub",
      date: "2010-08-23",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579608/2010Aug21_Art_Portfolio_009_cxpbq4.jpg",
      description:
        "A cherub statue at Oakland Cemetery in Atlanta, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Stained Dove",
      date: "2010-08-25",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579610/2010Aug21_Art_Portfolio_014_kakilx.jpg",
      description:
        "The stained-glass window of a mausoleum at Oakland Cemetery in Atlanta, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fern Shadows",
      date: "2010-08-21",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579615/2010Aug21_Art_Portfolio_015_pc168l.jpg",
      description:
        "Ferns superimposed on brick. The overlay effect was created within the darkroom with layering techniques.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cherry Cross",
      date: "2010-10-25",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579611/2010Aug21_Art_Portfolio_016_tkfaul.jpg",
      description:
        "Cherry blossoms superimposed on wooden cross. The overlay effect was created within the darkroom with layering techniques.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Tracks",
      date: "2010-09-21",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579609/2010Aug21_Art_Portfolio_011_gpy58j.jpg",
      description: "A railroad route change outside of Macon, Georgia.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Damask",
      date: "2010-06-15",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579613/2010Aug22_Art_Portfolio_018_folqyn.jpg",
      description: "Rosa damascena, captured on 35mm film.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Family Portrait",
      date: "2010-06-13",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579614/2010Aug22_Art_Portfolio_019_ucinza.jpg",
      description: "Ceramic monkey sculpture, captured on 35mm film.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Tail Engines",
      date: "2010-06-14",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579618/2010Aug22_Art_Portfolio_025_phcgsq.jpg",
      description:
        "A jet in the Museum of Aviation near Warner Robins Air Force base, captured on 35mm film.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Twilight Fields 1",
      date: "2010-10-15",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579625/2010Sep19_Art_Portfolio_Originals_190_ezusui.jpg",
      description: "Portrait pictures from Bluestem fields in autumn.",
      tags: ["digital", "portrait"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Twilight Fields 2",
      date: "2010-10-15",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579624/2010Sep19_Art_Portfolio_Originals_186_tdodau.jpg",
      description: "Portrait pictures from Bluestem fields in autumn.",
      tags: ["digital", "portrait"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Twilight Fields 3",
      date: "2010-10-15",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579623/2011Jun20_Art_Portfolio_031_emmboi.jpg",
      description:
        "Portrait pictures from Bluestem fields in autumn, enhanced using Adobe Photoshop.",
      tags: ["digital", "portrait", "graphics"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Color Lines",
      date: "2016-04-23",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579632/2016_AshleyPortrait_z8hsos.jpg",
      description: "City portrait, enhanced using Adobe Photoshop.",
      tags: ["portrait", "graphics"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Driftwood",
      date: "2018-06-18",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579626/2018_P1010278_bfkarb.jpg",
      description: "Driftwood piece captured with a macro lens.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Spring Showers 1",
      date: "2018-04-05",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579630/2018_P1010051_xjo5fs.jpg",
      description:
        "A leafing rose after an early morning spring shower, captured with a macro lens.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fire Drawing 2",
      date: "2017-05-03",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579640/AP2017_-_Fire_Drawing_2_bwozii.jpg",
      description:
        "Impressionist-style campfire illustration: Night photography techniques were used to capture the original scene. The piece was then reimagined with pencil tools in Adobe Illustrator.",
      tags: ["graphics"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Spring Showers 2",
      date: "2018-04-05",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579629/2018_P1010036_uwanml.jpg",
      description:
        "Hydrangea buds after an early morning spring shower, captured with a macro lens.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fall Color",
      date: "2018-10-15",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579638/2018_P1016332_dtxrtg.jpg",
      description: "Ginkgo biloba in fall.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cooperative Economies",
      date: "2020-09-17",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579638/2020_Sculpture_Art_yjie4d.jpg",
      description:
        "This experimental art piece was used as a means of interpreting and analyzing the organizational networks of solidarity economies.",
      tags: ["sculpture", "mixed-media"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Enchanted Forest",
      date: "2020-11-11",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579627/2020Nov11_P1010026_nwat5l.jpg",
      description:
        "Trails at the Cascade Springs Nature Preserve in Atlanta, captured using in-camera manipulation of the focal point.",
      tags: ["digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Summer Shadows 1",
      date: "2023-06-13",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579628/2023_P1010032_ggtxqc.jpg",
      description: "Macro capture of afternoon shadows.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Summer Shadows 2",
      date: "2023-06-13",
      image_url:
        "https://res.cloudinary.com/duk7xkc40/image/upload/v1744579627/2023_P1010029C_sk1ygu.jpg",
      description: "Macro capture of afternoon shadows.",
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
    await createInitialProjects();
    await createInitialProjectPhotos();
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

    console.log("Calling getAllProjects");
    const projects = await getAllProjects();
    console.log("Result:", projects);

    console.log("Calling getProjectPhotos with project 3");
    const project3Photos = await getProjectPhotos(3);
    console.log("Result:", project3Photos);

    console.log("Calling getAllMarkers");
    const allMarkers = await getAllMarkers();
    console.log("Result:", allMarkers);

    console.log("Calling getProjectsByMarkerName with Teamwork");
    const projectsWithTeamwork = await getProjectsByMarkerName("Teamwork");
    console.log("Result:", projectsWithTeamwork);

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
