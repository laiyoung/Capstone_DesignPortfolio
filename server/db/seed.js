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
        image_url VARCHAR(2000) NOT NULL,
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
        "https://uca9656cbb64417d5cc2b37f27ea.previews.dropboxusercontent.com/p/thumb/ACnYc7vY2n_TB9KmZ1ne9GGvNvkIUCKIzptuNDY0YbDCW98j3lOxlZYiTIAWVFpEVbIrO1pgQNd4ckJ3tyhXuZTl4zJ9ajncxfohboGFMeP6lq4F8hKEJQv4UJgxUFRUipoXDgUXbXXNV-G1Scr9htoqSzUATcAtmHkuQ-FiCTfyF1-pXbrSTO4lhlvbWEg8JRo3vSmRoiWQGOTM775VwNEdLAVcjyL78jsfOxjoZJu_cXGzkVhO7wngQMfHR8ajMN1qfDhgg6QOravnl6D1UWkoD3BkFmOtJkSS-pqc4-dkyZxGgL3wDQ2OSABaKqK4I46tzDtVCcfgCFyMcNY0DT90lQzTjxP8lGZaFM6dfw9k8eFh0Y36GIAAHfCfQ67D4zh0cNp_4xQV6TYcars3ivb1/p.jpeg?is_prewarmed=true",
      description: "Digital grayscale portrait.",
      tags: ["portrait", "digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Mirrored Rose",
      date: "2008-07-05",
      image_url:
        "https://ucce18c2495531084b7eb81bd6d3.previews.dropboxusercontent.com/p/thumb/ACnV5F660Q9hf96rbzvoJvO5kOKdP7gJHqZx2g1OmAuxE-VwQKyvcQNEYqmiAC0ki45-xieXYM206NhKbfJ62jt5A45gxaNpb0DA6stEZ_NE7e1bYE3QtKtUm8vCoGsgM3DnkuHyGjSDO3A1Flo18GpWaYFIqhwDvNwt6FKjrs-GQfAFgJuj-jcJIv2rZpyHUoe5lWLbpBomZMlzpcHLTttwZ_bCc-VwsADnkyBKlZxIjgrqBh7SDJtVplw7SPfd7Ez6g6cnFP4OdNrnFFPWeBQ1H2JBUhFCLNrr3Eb3BVoFoI2GY7ppKypb0MSj3sABhHqWx5Sk4jq5BZHLWazUuRYVyfhDxOHuocDa-5lxwzfw0LouzlHrY1_C8NwH5vnovQ3NTsOdbXEwMkGBXKBP7Bzd/p.jpeg?is_prewarmed=true",
      description: "Digital art macro piece, enhanced using Adobe Photoshop.",
      tags: ["graphics", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "NYC Summer",
      date: "2009-05-31",
      image_url:
        "https://uc2e7ecf2ca701bc1dee68490ef3.previews.dropboxusercontent.com/p/thumb/ACn7NzU2n12hbfPKtTXBFCMFuWkoqR6KEUTp_dSB3OG3dx_fRwze8WzdxZI_S7Yl5ULL_BxEa6uotCiYFBQoHizQJogduQ39WTH_WVzejLUriTeBqEbx4Ee9VQY5foVpd6GCt2lpLjNhBhZG8swKVteR4zC0WULSxF33OEuOlUDjPMGIifGbXr4itErW6nTbuEFhq0g8TF7H2T8T2lhRsAgdIhV5i7PBz1eVIwDrmyPBIk4WyPDQCm0S-SN2KIiXYD5GzuMSDhiIF76osaugcuFar_2hp9SX7Xw-_Uynbyw6x2CWFlw37IjU1d3HB-ndoqwFfW-RvfoeH7W5LEQAPL0ZGNzfmSzfJsr6X3mcd49Wwy5dFxx_IQOdWVTIRi7Hd6H4-9zJ4qwCJipPQfcOLl8F/p.jpeg?is_prewarmed=true",
      description: "The Statue of Liberty in grayscale.",
      tags: ["digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Classic Chrome",
      date: "2010-08-21",
      image_url:
        "https://ucd472621bc51545df488719fa16.previews.dropboxusercontent.com/p/thumb/ACnSLMwHwH11nZG1AyBMTEvxpF-wQ6t5pzn5sN28Cf97Ztc3RJ2DXPAGwteDtRWgL1gwLLGTNO-eyYFHZis0XaUJTxqip0a-ZFAPtTw6ODz0yHlfFM74nHrINP_jvzmHSvdYvBwHXe1Pbnw_iMgzXa3JBtT2llkE-3TAFifC9oVcoxQSstpOiuDFlLCrSHbJ1OWoUbpfD8Zmur8sI0LkWtHgC5voAVpdfC3gr5MJuUjXHRzQ9ccuw-uUgr94FVJrsqZ8BGuFw__1x6cb6fLSbL7zUFbZdZRHtQyn4GlI5VOayxEOpJuQwZXkU8duFalLP62ZJUJprqHGGvLigYyeVfgJw3y0Cx_IcObCjbaPOtVJZrrhfq2iF_6kbmNajLAblB_7tLXADECSt0pd902daNb0/p.jpeg?is_prewarmed=true",
      description: "Film photo of a 1920s Ford, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cherub",
      date: "2010-08-23",
      image_url:
        "https://uccaac90cbe8440f3293f39d1af6.previews.dropboxusercontent.com/p/thumb/ACnHWMaRDsyhXPVYDNG2u-_UZLYXge5wxS4wUMLcS6bIdT1f61tyj5_XpmhiSmJinum3PsoPbOby_oMH-HMQUsVyx5pAdr56jgL5HDJlGGA72e_HC2FkrEHdH6vwC5UpFri5x-CKpY41wBkwOIIFlbX2u2VJ7VlgYRfwimHyAH-OqKybv0D12rv9YvUVbs_7xaeFTGkKKxcpWfNdj9edRxtMZ6Z8dnikaVwXPLZee6W1I2oKtbfuv5ObPndDna-jViLci89cUW3PpGnlmCf3vjkiJqtOr-eTYqQkeLcm8oMbN973E1Gw92ua8ZEExNmVsIulNLAhiQabH79G9fy6XQpMtyO-FMH0yN_pyrrMXJe33caBOV1T1fOVq3YjYaj3oqwlIKANU8fs4XfI2Q5Di9jZ/p.jpeg?is_prewarmed=true",
      description: "A cherub statue at Oakland Cemetary in Atlanta, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Stained Dove",
      date: "2010-08-25",
      image_url: "https://ucb3cfc8faaeaeda313eb6208766.previews.dropboxusercontent.com/p/thumb/ACnie8ecV_DCXC9cR7BdFKAH9kIHzquQFEeei8GeLF4UTFiRyx7q8CDxN30c--fLcMCaeGCGFzmJFxHZw8twfiILzzWCDaHQUbz6J5sHJj1zDAezew4uk99_0VsGcncFbGqoyhFVrRqGf9Rgin7oaPqjZ7TQiwBLknbKbihL3oGBSXCWmiZV4OhoxK9z8pgsYxpz-0RaDME8NC2AjJvaAJaRR-MQE-lvM_cAhOAsClJimGfkVi00I8ME8Vw-gYa2_ZKO3mbIc50IwnaNkc34pXGmm-CtRT5nt0OifUV_04aeAaTDVQBB_XGVyLZQYqLl3v6oZLhvFnuzRgOiZsD2wJ3GIC3rRpovsIsbtbQYd3SZtqnrXAWtKSDetPptZxCjHekthkoclDgBTc83EN_X3vw7/p.jpeg?is_prewarmed=true",
      description: "The stained glass window of a mausoleum at Oakland Cemetary in Atlanta, captured on 35mm.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fern Shadows",
      date: "2010-08-21",
      image_url: "https://ucf25a0f299a9a90f54bd75639aa.previews.dropboxusercontent.com/p/thumb/ACkVLqVSrYKl5cZsU5UmOz3yvUbq8bTrAq6SIgFOY4_uRa2MZbxi9cQryVcEiakuEG1Qo5rPESeFCSQN0Z8-xy-A_yWsPtCfYkekqefyFnDPCQCJpd_40KcV3mOfgHhl2mHkFEMQn0241w-6utiOFayZJ5mdpECVbrjiQUGGZYOlEiOyLOSXPwD60TZ9D0WHdkCN8lo1YVgnTgjotvbrQMKvPYnS5lubQrwnlgLk-47vbI2NVnDh5540Tkamwm_kBu_E0ZBjjjJ0QCLOYNmkwY1Ny-867W0akmw-fcMVFgeQYxkizjDheKdQ5xmnOCMFsI81dlXtCcP1BY6faJrHMM4qtixJqNlOKs2V5IqiTLVtxPGhBW_nReN94ympTgFk_QCkcNO-XuPIJMBxiYdqrEd7/p.jpeg?is_prewarmed=true",
      description: "Ferns superimposed on brick. The overlay effect was created within the darkroom with layering techniques.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cherry Cross",
      date: "2010-10-25",
      image_url: "https://ucbf599bc8b5a4b2e8477586c37d.previews.dropboxusercontent.com/p/thumb/ACmyS9n4BaOVUszeCVOgqjj7bgKnnG_zGRi6yoL2jVBAWgw9VANw7OAkNNIk31oSe862C-GW6KaLwZlg299-xaYoNjzMXgHpOtekLlHB8VhvjnATOIfJCTlki9b34t1OMuIhHwEJ7WBvAamvSsUCg-WBi0LrSiY0EGjayDBxonEC_5FCc4JViqlJTLEYGcVk_gnzNypLsSuTs8cOrQ8hIFidfz4EHcu8f05JinBUVtH7EmzkI6hhwnkoy9eUsSe4VQ1lZjeMHPaAR0GK8vcHvi2f3U4CLgT97NZJyXRovO29Dce4Us_L0eljgNm23CH8CnzxzzJ14_eNpBxuId4JWNGh35lAMCH5dJYjygz6C9hzNeyn_iBmCT7JqAXYyWqHwxZaGT6WPLiOYattzTpe2kiD/p.jpeg?is_prewarmed=true",
      description: "Cherry blossoms superimposed on wooden cross. The overlay effect was created within the darkroom with layering techniques.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Tracks",
      date: "2010-09-21",
      image_url: "https://uc81c74b9834ff275f1f04401b3a.previews.dropboxusercontent.com/p/thumb/ACnZwAdTTTko9iB-7YcQo-acUaUpwu24iGjSt4tj8yT2fcfUq7SX2BxmthwJRBLglhGt2pOKlQ2E5SwWC2u-SaV56B337stSjPcU0ssNNqVCiWpcoqGtSihEE9TJNt3a1MzPWne1WAJ-PgYvr3m6Q_52aA1JH9EN7c9J5Kv1L_v5wsMsHDZ6NNv1SPHZOsxyENWhxYeb80eN2JCpMO4AlKX0RAAX-_K0suJG6bVC-7YUt1WmrHuDv3p_UthxELdhkPS79BEiqBMXgMrW-0EKvJQEHNIDnA53reBlJUpIg7ITnPWkUg9XDI8aCzs6t5QdhfXkwjlkfq5syWZ82w6Ok34HPL5bgGzwMDWEdYSsqtcvKRqY4nc0pIEdWHWuGV_zYmJPR0aCyyRpq8mVb1f-jyCr/p.jpeg?is_prewarmed=true",
      description: "A railroad route change outside of Macon, Georgia.",
      tags: ["film"],
    });
    
    await createArtPiece({
      authorId: laiyoung.id,
      title: "Damask",
      date: "2010-06-15",
      image_url: "https://uc951e343cf7432fa8b862b07c7a.previews.dropboxusercontent.com/p/thumb/AClm1iKfBbOA7u0TOITxhTmhdROtfZC0Ddjw7Q9jJzI-C7MA_BDb0LSqi0ISn-395W6U0XjdkqvFKwNuTi8Bi1ZDFlWtjBNgOPROnqNEc9G8jw7YPeZOFRYP5IXyK2G2ntC04YDoABQpJfNasYVBkrRxS0e-KBzK5S7WiSJ1WRU7S6CJ4Jy8hDYNKQjVH86F3_0Tn7xSTauoAPhcxkMv--icTssRBbtHb5wcnh8OIMqseuzdV2BMBLAl4seMR5wAZskamOxEb8RXCAeGx60ebOUAPa5mFITccr0K-93JtBnhLqNzF0y0Pcx2UWKmKJU69lEwe3s7a0ycLjRXhmgvDwOoqiiRnc8OEtK2pr8gjj5C8SSklU0TAYR7jfOQWhDB_D341jJ8r96robeYtCwD9Dh9/p.jpeg?is_prewarmed=true",
      description: "Rosa damascena, captured on 35mm film.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Family Portrait",
      date: "2010-06-13",
      image_url: "https://ucb14d852de85a5a973bf1291110.previews.dropboxusercontent.com/p/thumb/ACnsUOoK6-9gx1ivNOfC5M8XLLbS77CaBzPEQcL9-Zaxkpcj_p8aG6BGMELSd3ryUQ7Usm4mgxN6Y9Regi_PA__ejqzHhUFC64Nd2pQl4zKtou1phx1w6HTVmYmaDsA_65Fdy0R_YgNZfVAqNK0erEKaey3DZwhBC9uICNXL1zTME75qypIs3FK4dmRrHvOFdYgpnIRbvM_NiWpwawU4_Iks3_xwcw0ieh7kX6jjs86y3mGiOQthUJdoMjhuksKO0QSPDL7iUnl_9EvjZsiKHEJ2fX_wd6o9owCFKEmNnI6zJyq19KxfwfJXsnJ1VIRClSInMAoGxlnHIB3v0eNY6_m-Oec7gSFhJ6Pfk1bfzUWnNbmxilOts3IVkCHP0-L0VdcWRBIVIG7IVKs0O5l9E72o/p.jpeg?is_prewarmed=true",
      description: "Ceramic monkey sculpture, captured on 35mm film.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Tail Engines",
      date: "2010-06-14",
      image_url: "https://uc6d2adcb698128c1882dc0310a2.previews.dropboxusercontent.com/p/thumb/ACnhc8Ok7_dWNjB5azznvrogWPgh6F2-1qwZOk1WnKJh_hnejKQfUKuFGShDl5ngae6MUc7nddLZg-hFtb2GGW3vT91fUd7iXkYaosZeNuNTRZWqbkzpFR5I7k84Hb55Od0Srb9yNZ1r7enilUAKRhGI9-3Zzn2c9jY03ZSAY1VRgYry8DkL3gOXJ0gNfLcmllAYSP2zF8_KXGO8GrkA3f1n6mnsQc2wmHyl9JKVJRGTdmD9f_y2O1kXu8_Oqndj_2AgsCboeUhKGJjFi4GDU2cF6ADWfWVVk4PNECB64cLDcPwjvkIAPu8rRyN2L73gR5WuvbIimnTc5XnfDFUKhpBjGCbINZxC3pNU-7_BSxBlWZRnEgpnqGzochNef2t3hs9PQwfZkCHA-_Nf7MT8B1AO/p.jpeg?is_prewarmed=true",
      description: "A jet in the Museum of Aviation near Warner Robins Air Force base, captured on 35mm film.",
      tags: ["film"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Twilight Fields 1",
      date: "2010-10-15",
      image_url: "https://ucf5686f18d867f3271dea6745f3.previews.dropboxusercontent.com/p/thumb/ACn-Y6q5pbSnu4rLlNcJnNZ6mAybt4muj7ijF0MTR1m90TYndTV3CO6UlyKwsgtKLAWLl5YR9l7nJoTyaSi5o_p9EkEVQJHJnJlawL0Ke81EFvCy6Ex-x46IJt78AnwAcyjwvFx-SPyJhdyszcNUGysBTmWuXO8srTYt8CF20Fyxl3ozCtrfFEyP-GnKyRD0gbgAYOHHskziL_ikI3ujOOWPwdz9UfPBYbz8S6nPJhLex_c_tRrf-87Jbpd1138N0Z3NRasTC6bIy0QPXqyvgvdVKGvyMUNUUvqfEbH3PEigwvW7RGwPP8WmlDFiylQ05umb2p076J-Ci59hKNT2qnL2cFMMCD8o-ipWnoQp6PDam5eHORr45-ECblXI4f9oBnbewMC2Qqd0QLT-5lilr1cg/p.jpeg?is_prewarmed=true",
      description: "Portrait pictures from Bluestem fields in autumn.",
      tags: ["digital", "portrait"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Twilight Fields 2",
      date: "2010-10-15",
      image_url: "https://uc10b2457530e9c8c3032f7fa63a.previews.dropboxusercontent.com/p/thumb/ACnnbXZZ3Q2GjwmEVLAIRabD2EZgMnIp8VyX5KDemHM0YsIuZbo5YYXw4fNb_OhNiriBv0cg_sbYKXHSq3I3eD_ZzN_7zhp3UYzv0t1rCkubljzn_I0joZVrOaBLq9t6xEyx7rbl5y2oYBzClK70uFZmTs2a791V6zdwNGzv1H2wEFcJjQCdsasSU53PxqQ4JIqqC24xvSy2w4mSvAHt7Yl7L-OULEKvW5ihQHkopNltGCO8RQ_5J3YZg28ad2_zB9ntp5Q01kkJvYUEMALFRxue265jOQStDGEHxdOmbEw13cWDcqkMvpnplPnCNBugwPoCfjjewPYvmyQMr0px_1C5AUYnmzrycBaJrtoSWYctQRjBPIztLzXhQnECMs7kNg4jDyKjN2c-OWS1Edc4nscw/p.jpeg?is_prewarmed=true",
      description: "Portrait pictures from Bluestem fields in autumn.",
      tags: ["digital", "portrait"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Twilight Fields 3",
      date: "2010-10-15",
      image_url: "https://uca73504ca2c03ebfb5f234a9863.previews.dropboxusercontent.com/p/thumb/ACm4_5dIe4OUg94hWOoPoGguenwFKyWqFfhQT0hoSgQqfqq5Cmuq-TAYwj_cdV_y1R8ZzMXeVbKX9tOIeutg0iv-vjK8Lt6KAG_xgpGqsp3R1ZoCbkTskJVleYePIYBsVUKP9T3-H90uObsD1bVUtixTydgb5e3hDrDPoHV6NULlI9_LZGdG6fplVIdQWBYD-g7qOaN1PNdYFqfKk_6wuVGb4F4Em2NiA7OMTPUTXUYftemQ3ef5tpWn_IGX5rI0_3jnq_IbEtvqY4fgJeH_vnQ_M5ZmHCHrmIV3QsS1QSrrk6lbm2EV6BnLeDd5FEXlrAnuF17dMq5KjVHgnYpyvuiczFcQpmnv6UKr-ChUcl4_sQf914_hBowWkF1Lj079euAYr0DL4eJ1rUHB1xC9nffD/p.jpeg?is_prewarmed=true",
      description: "Portrait pictures from Bluestem fields in autumn, enhanced using Adobe Photoshop.",
      tags: ["digital", "portrait", "graphics"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Color Lines",
      date: "2016-04-23",
      image_url: "https://uce2ad3d2c9d8185552db364fdfb.previews.dropboxusercontent.com/p/thumb/ACmDXaUFsglJ_feMHL2MMu35bdZzxEftHSST1-HmERERS0Zg-30OpdJwFaACxzm7qAUiSzenO_V9r5gfgmdOVD5FGU0UmL-nS-_gXRUffuaCekDvffiS1w5n5OuE4j8_hrnxKdbCXbIFZw33X5xp79vwghg9Ad8qdHNUuGPbFey3LxTlzoGGNuKegNVvUeKjdsRzuWfKwFdzn0eo0ImD7fcT1UtA-fG5w-MsBVWM6I6fp3Z-1VE_rwFVuTIxf3q-r5BkgnW35Pe1OvZFgijeuPg1lapF-OiUpwRgcVlmSOpYyIKAAP_psghzJp-hGuXjfvuEaUTRdPVgDnq0JYkKXNLHKoyjIPojlUrKoiQ6tB9H_uV8TCLorVSEbrDz-PuNaUx_8h1ZWibFSlTQcnOcD6gT/p.jpeg?is_prewarmed=true",
      description: "City portrait, enhanced using Adobe Photoshop.",
      tags: ["portrait", "graphics"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Driftwood",
      date: "2018-06-18",
      image_url: "https://uc743ee52d42388dedf9e11e198f.previews.dropboxusercontent.com/p/thumb/ACkVWGoAorZ7tlkYETQ-4VjX3QqeDEk52RYvVuGfb82mGI-9SUbyXD5KkxckD7YFj6VvFIAfwzUjpK2M6fb4WaMHz3TlGtOdIGZBPCvx8pdQDq66pdKvIBqI0Kgs38iVMSbWd0ov619IsiPs0rKFi4_eT29K7R__eMvspwpFbAr67k3O_CRwfYOEeEzZu9x-rT_yvTJvXeTi4LV96zPaHF77QXcbovMrBjvU1F_shtK1c1zmzptCLuHTIuT2iYWLEdQuIO6kJEerevg7oSQLQHAS9rd_G4L_ZBnM61e-TtSu_LzuZ2bicbwRZnVtOaZLf-J5ySR_-T4AhpJ_4LyPERFCoedLxv3BqlWL10IVqxYGKz6sN22JgNJ5zThICeLAMsbFjT8i-P2BvOdRJJDgvWkvB2Fy8cIuBYA3HYYBDETTgYuxIJcqV64mCpbEczdAdMmMfzyHyNOVz6YaiiPMTzm7/p.jpeg?is_prewarmed=true",
      description: "Driftwood piece captured with a macro lens.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Spring Showers 1",
      date: "2018-04-05",
      image_url: "https://uc7a683e5b92e46f677933d59d96.previews.dropboxusercontent.com/p/thumb/ACm0DcHUJsqcrCgSFUUsthdE92HCLajlKrm2uEfOHzqRJh8_4qlqHXSckhp_Ev37RPYpptJUmvd4CW-L6mRmzX5kwpuoABBf7vxrRxGuBg2_Ri3TPaKHfELqLdLBpBLlh-rAiSgrXqmvAGHMpIqUCAPBxQQoK4ScZRCGQJXEQfbrSnLx-KqZ-vaUPEhxnT07Y60HaRftDsVwS7ONMTQoCbQaGkX9bFMFyiM58vd3cMtLavRgPssFwlfgnr_pqzyJzew5rwoF55hFtILo-oqrRekugK8yDMvVCajm5A2GxXZUg-tO3IYZqQ7vl7L6NieyaczAuFRzxmJvcMlUHukNH-SIlwW6b7bJixsmZyPvK7fZEmzprwiYcTZ-dbcZiuuxQuBI5WkVkOYtwZu5K8AM9MuZ/p.jpeg?is_prewarmed=true",
      description: "A leafing rose after an early morning spring shower, captured with a macro lens.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fire Drawing 2",
      date: "2017-05-03",
      image_url: "https://uc28971a45ea3409dc7ad9d243bf.previews.dropboxusercontent.com/p/thumb/ACnXtrekr8Tedn3yAEMym0bUCCJIBesEaHu04eadO2h9dm6SIa59366hXe5MuJg2nIfxsPjtYaq6Lgn6IXqu23tGM7Tpl2D_SG-r9udhP2MElZ-zksnlFCJDtKtkHC7vyRAk2KEopoVydAd7XeB4dCh1iUwg_XXL63zFbL8-tu9Gjg6-X3b2sVjgzfhW5jqcQNL9ZUwpbT99BQTNvPXgqtNV5GDjpb6puBq-O0S3vpNhrMrunjdpd2cRqGe56U2juznuITkF3GJ_a5uMn2f3JCyC8IV8Asqid_AucRFRlc2A4K6k-qI3QH6z6gO7uskVwoGlMZ8H5dyMa5IK0lER2oatQDStu-rEdz6Lps-qKINfHok4TR863A6RH6YiykaK-ebgcLrNv6sK4CwrtePjAAWu2nGSvmYHewVM-wbP8ZA82AmCpuNRPqILUgYPJA0SUVoUrLtQpr4aqFvfU1qe71hPnIu5sQ0AxKY5DlW71-JJwhsJu71jeugBGKFjloSvANlVVhJ1N9nPz0GMZtKyeSTQ/p.jpeg?is_prewarmed=true",
      description: "Impressionist-style campfire illustration: Night photography techniques were used to capture the original scene. The piece was then reimagined with pencil tools in Adobe Illustrator.",
      tags: ["graphics"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Spring Showers 2",
      date: "2018-04-05",
      image_url: "https://uc04f17cf712b7c1b68ca4891074.previews.dropboxusercontent.com/p/thumb/ACnvW6EaDthXr4_X1Qnw5M47wk5eZ_l0yA6DJsoZnd9A2VxxKGXGKlKEr7-0HOT4e2ei1nEmZchSzKsLqd0okpiOIEUHNq21c-kgTH6SOFmNGgt_A7fR5PKODqJm13DXA0fK0iQ21WDGar6bJQGvbgn5tEIUwZsk4PBzRO-jX10rWT5mlJ_c_JbaG1-svEWRjICN97OANNvepUKkImz1URPdA6tJ6p_gxRZmJf9-58yv8SDHH3ez8_m0aCvgDiGotxp5J3SZSqUevu-stpgoUzbxDt7_CfIGMz-0QDBzvKv1yklWdBsYcAGXQTIHToV_xVTDtVwLDZSsYm3T_WkifZypKlY3GdMNN3La_Y3zKE7USUbGyQGqglr0p8ebHZg6eUSbVJsI1Ss_Vxj8Sdn5FrqYgKOuw6TucI8Htgrnk1rYNnPNdmmEn_xYY1B2Oco7B7PdOekGl3qlpwCS2sOpDv_x/p.jpeg?is_prewarmed=true",
      description: "Hydrangea buds after an early morning spring shower, captured with a macro lens.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Fall Color",
      date: "2018-10-15",
      image_url: "https://uc458d515dd06a7d08ec7a15b08b.previews.dropboxusercontent.com/p/thumb/ACkx61vMKZAvPtmENxBlFZjrxi1TpbkkQ7ej5wQ34k5PEbNU34ZHhN4f9WukafP8_6Xj1QDCPBrXCI-Vqr3mTbpMnUWaWvnXunu9k8TCCy6WA0MbXQnWdDqkEmiv8oyzQ5IbJQIGDXYppTx_VmMpRABG1UlwgqZFY8loqd71wIsT71LRE6BBhfVzZKNOqy2JjCYFC2OLMM4gPyZ4D89yKPVUHEjSgtL1tXPtH6n8slLWEiBp4lYACvydv-C3Tl4cgwle1Vcxyo8lN-Dok-XV3A-zFrqNDj_GDOx2Bw-n0HY7UCxGujkAP8Bf1DiRqRckehaQCAQ5UgPsPzKkGfSG9V2gUstkzguHpWazQL6TkXhOg77mt8qcf9uM9FjljhL2zUt0nspBg3PJ_ZvQLEAjWnfo/p.jpeg?is_prewarmed=true",
      description: "Ginkgo biloba in fall.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Cooperative Economies",
      date: "2020-09-17",
      image_url: "https://ucf4bf45189ef745b1bddce20e15.previews.dropboxusercontent.com/p/thumb/ACnRKvY2bNX3VpQkPWnadNkNlKL-g39H-LaIL6JpZ0mBIPPxMInXQJn7dwawx2434teU0n7YGxl--IYdku7JSX7oAvtW43fnZK03GHX1jS6AlVHcIGbKztDRFUxTgOF4dwYVKrcEtk-9_T1wz8MQyBN7JC9ov-vpAGzTJvVNd4aHQGjUwJCd7Zrgr2OcyyvmU4dH2quWuo9tssPXhZHTiBxwNRzBzH2O3dO18_y1u_Cz-9Utr48oFR5sHKYR1XNLIqE4HfZUBxPeuhl-syUDwJKmkVoOzypYB-gZFeYOHqjuKU_WCOk-VuJEZBzUIUpxmTOxLKihZ-uel-NY8NjCFx-IRd6MK2oJj7eM4ULYZW5lN-Jc1SEAqwOvHsNNbcV_zEGD57rAO2gTqWNyjoA7SKtj/p.jpeg?is_prewarmed=true",
      description: "This experimental art piece was used as a means of interpreting and analyzing the organizational networks of solidarity economies.",
      tags: ["sculpture", "mixed-media"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Enchanted Forest",
      date: "2020-11-11",
      image_url: "https://uc7137d21a5d44a7569a63ae48fa.previews.dropboxusercontent.com/p/thumb/AClwS_FiygxMzi68gZuW88GBbmhR9OVA9l0Yk9dnenvpuuUUNWp4_6cmO-zL-7SEXOzjlbZnLgZ9bIMEgT-FFYq_5ZleYPVY36_M2-SRRf68A0o04IZndCz28er37-99wvWdXzASxvFa4KpmE3b68npXl944m0yBDoU5tPCvGnI4oXBUlfxyTWnvhGrQsDouMd5aQ1wRnhGWz6iQ8d_r1zav5bSBRFT7ANJ6e5HCTXXeZuqv6OaMbbKdC-JUgP1_pf4Z83Dgpf96eaLqiOqKv1LzotgifNfqSB-ONuRO4gEHMTgMZcRLhFA3B63SDaQ1vtUB5eWDqdt0IVnEoEtP6MKJnSKmyk3fENPSx6yb7qkbLW04vW-iJXL1chglD39uGEydrh1Jg4Fd3FF2UW3e8ipukxEDHsvyzvf-rcPe6S2uBQ24I1pOGKgCWOxZt8mPOkPB62VPz_qjXOmdd3kxTe-0/p.jpeg?is_prewarmed=true",
      description: "Trails at the Cascade Springs Nature Preserve in Atlanta, captured using in-camera manipulation of the focal point.",
      tags: ["digital"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Summer Shadows 1",
      date: "2023-06-13",
      image_url: "https://uc85503f5856d527d0008ce920ed.previews.dropboxusercontent.com/p/thumb/ACnARihOThWEjEkQMEGiMzUCu7sUnyrBs9P_EbhVGlO2oHwAd92vfFH_H8vdfIijTqnOr1GmE6Hhs_SfboJoMQlCkKW_p5NNoVMFaKY20wlZ9GQVkLh_vECLB7qZquYwWxEeplIJWkMqVSn8pOnADWQM1XMMz483MOywwKwDyojoI4ARW1vWkhE9FCPlwxkOAceg9kWOe7Bms2hmqBDaManzpml5JWwthqMLK4RX7G7KtwQZSN0MCjdVwXLf7Xl9iMPzgKzvIx6MJ-y-yC3ICkwWXg09NHfgihsapxupY-dkyhMcFyFG6GXOG4Lr5QdqFgj2s2gpsIX3pP2juNeJbibG1CTDwsbPE5uMtWfmuFnJK66sNi846euecW9ntFH71h3Kq6hltNTm9J7erpgGCW09/p.jpeg?is_prewarmed=true",
      description: "Macro capture of afternoon shadows.",
      tags: ["digital", "macro"],
    });

    await createArtPiece({
      authorId: laiyoung.id,
      title: "Summer Shadows 2",
      date: "2023-06-13",
      image_url: "https://uc16984248dd2df194a3acfd9bf8.previews.dropboxusercontent.com/p/thumb/ACk4kWEIjhSQsrk0mUF8uc86NHMT8NMbdn9IYrocF9e4Zy8ENEdBa_kF0PJPzHwGfupIZvsHTpZj1MXm3j9OhZMQyHfblQrUPj5BqaA4I4_ymi1XyDPHZDP4_TeQKmxAN4T0d-63w9I7q8GHV2oJngi2JZ41Pu6rp81-ccX5VrH2fsyrd2Kd8txG0MVdNumD0QgHdGlmD9zUvit_hmBMBEz-iZwq6qWjmwIWZB7H8hYMxuPEUyfEXC5VFL9QrjYmQQiKl2_yE-tIaK4HQHprDrqzUWJxfVH9E5ypN3V24hLttum_62KJZifU7ZgJcrmFxWYJqTokrE5-h6FU4RnFPQnIyGhq9fWGrZL6GOZcm07r_vZPHO8QccwIdFRy-dpWeYXcT7KXjbcuSVWorooapOTC/p.jpeg?is_prewarmed=true",
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
