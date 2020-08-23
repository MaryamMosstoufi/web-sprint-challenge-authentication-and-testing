const bcryptjs = require("bcryptjs");
const jwt= require("jsonwebtoken")
const router = require('express').Router();
const Users = require("../users/usersModel.js");
const { isValid } = require("../users/usersService.js");
const constants = require('../config/constants.js');

router.post('/register', (req, res) => {
  // implement registration
    const credentials = req.body;

  if (isValid(credentials)) {
    const rounds = process.env.BCRYPT_ROUNDS || 8;

    // hash the password
    const hash = bcryptjs.hashSync(credentials.password, rounds);

    credentials.password = hash;

    // save the user to the database
    Users.add(credentials)
      .then(user => {
        res.status(201).json({ data: user });
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

router.post('/login', (req, res) => {
  // implement login
  const { username, password } = req.body;

  if (isValid(req.body)) {
    Users.findBy({ username: username })
      .then(([user]) => {
        // compare the password the hash stored in the database
        if (user && bcryptjs.compareSync(password, user.password)) {
          const token = signToken(user);
          res.status(200).json({ message: "Welcome to our API",  token});
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch(error => {
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({
      message: "please provide username and password and the password shoud be alphanumeric",
    });
  }
});

function signToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department
  }

  const secret = constants.jwtSecret;

  const options = {
    expiresIn: "1d"
  }
  return jwt.sign(payload, secret, options)
}
module.exports = router;
