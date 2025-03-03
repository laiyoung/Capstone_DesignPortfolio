// Importing Express
const express = require('express');
// Importing the routes from ./api/index.js:
const usersRouter = express.Router();
// You have to add the "/users" bit in Postman

// JSON parser:
usersRouter.use(express.json());

// Middleware for printing information + errors:
usersRouter.use(require("morgan")("dev"));

// Importing bcrypt for comparing passwords:
const bcrypt = require("bcrypt");

const { 
  createUser,
  getAllUsers,
  getUserByUsername,
} = require('../db');

// Token middleware:
require("dotenv").config();
const jwt = require('jsonwebtoken');
const  JWT_SECRET = process.env.JWT || "shhh";

// So, you only have the '/' because usersRouter is defined as "/users" in the api/index.js. 
usersRouter.get('/', async (req, res, next) => {
  try {
    const users = await getAllUsers();
  
    res.send({
      users
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
// Same here! You have to add "/users" in Postman
usersRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;

  // request must have both
  if (!username || !password) {
    next({
      name: "MissingCredentialsError",
      message: "Please supply both a username and password"
    });
  }

  try {
    const user = await getUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password) == true)) {
      const token = jwt.sign({ 
        id: user.id, 
        username
      }, JWT_SECRET, {
        expiresIn: '1w'
      });

      res.send({ 
        message: "you're logged in!",
        token 
      });
    } else {
      next({ 
        name: 'IncorrectCredentialsError', 
        message: 'Username or password is incorrect'
      });
    }
  } catch(error) {
    console.log(error);
    next(error);
  }
});

usersRouter.post('/register', async (req, res, next) => {
  const { username, password, name, location } = req.body;

  try {
    const _user = await getUserByUsername(username);
  
    if (_user) {
      next({
        name: 'UserExistsError',
        message: 'A user by that username already exists'
      });
    }

    const user = await createUser({
      username,
      password,
      name,
      location,
    });

    const token = jwt.sign({ 
      id: user.id, 
      username
    }, JWT_SECRET, {
      expiresIn: '1w'
    });

    res.send({ 
      message: "thank you for signing up",
      token 
    });
  } catch ({ name, message }) {
    next({ name, message });
  } 
});

module.exports = usersRouter;