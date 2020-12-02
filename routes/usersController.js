const express = require("express");
const router = express.Router();
const { validateUser, addUser, User, getUserById } = require("../models/user");
const auth = require("../middleware/auth"); //Authorization

router.get("/me", auth, async (req, res) => {
  const user = await getUserById(req.user._id);
  user.password = undefined;
  return res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validateUser(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  const item = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  const user = await addUser(item);
  if (user === undefined) {
    return res.status(404).send("User already exists");
  }

  const token = user.generateAuthToken();
  return res.header("x-auth-token", token).send(user);
});

module.exports = router;
