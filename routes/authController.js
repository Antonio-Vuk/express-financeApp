const express = require("express");
const router = express.Router();
const { getUserByEmail, User, validateAuth } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { error } = validateAuth(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const user = await getUserByEmail(req.body.email);
  if (!user) {
    return res.status(400).send("Invalid email.");
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send("Invalid password.");
  }

  const token = user.generateAuthToken();
  user.password = undefined;
  res.header("x-auth-token", token).send(user);
});
module.exports = router;
