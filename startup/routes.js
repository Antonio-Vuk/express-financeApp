const express = require("express");
const logger = require("../middleware/logger");
const financeController = require("../routes/financeController");
const usersController = require("../routes/usersController");
const homeController = require("../routes/homeController");
const authController = require("../routes/authController");
const error = require("../middleware/error");
const helmet = require("helmet"); //Helps secure your apps by setting various HTTP headers

module.exports = function (app) {
  app.use(express.json()); //req.body
  app.use(express.urlencoded({ extended: true })); // key=value&key=value
  app.use(express.static("public"));
  app.use(helmet()); //Application headers
  app.use(logger);
  app.use("/api/finances", financeController);
  app.use("/api/users", usersController);
  app.use("/", homeController);
  app.use("/api/auth", authController);
  app.use(error);
};
