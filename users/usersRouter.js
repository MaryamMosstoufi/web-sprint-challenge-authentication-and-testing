const router = require("express").Router();

const Users = require("./usersModel.js");
const restricted = require("../auth/authenticate-middleware");


router.get("/", restricted, (req, res) => {
  Users.find()
    .then(users => {
      //res.status(200).json(users);
      res.status(200).json({data:users, jwt:req.decodedToken});
    })
    .catch(err => res.send(err));
});

module.exports = router;