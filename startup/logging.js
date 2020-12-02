const config = require("config");
const morgan = require("morgan");
const winston = require("winston");
require("express-async-errors");

const startupDebugger = require("debug")("app:startup");
//const dbDebugger = require("debug")("app:db");

function logAppData(app) {
  winston.exceptions.handle(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    //winston.error(ex.message, ex);
    //process.exit(1);
    throw ex;
  });

  process.on("uncaughtException", (ex) => {
    // winston.error(ex.message, ex);
    // process.exit(1);
    throw ex;
  });

  winston.add(new winston.transports.File({ filename: "logfile.log" }));

  console.log("NODE_ENV: " + process.env.NODE_ENV); //undefined
  console.log("app: " + app.get("env"));
  //export NODE_ENV=production - setting environment in production mode

  console.log("Application Name: " + config.get("name"));
  console.log("Mail Server: " + config.get("mail.host"));
  // //console.log("Mail Password: " + config.get("mail.password")); - //export password = 1234

  if (app.get("env") === "development") {
    app.use(morgan("tiny"));
    console.log("Morgan enabled...");
    startupDebugger("Morgan enabled..."); //export DEBUG=app:startup
  }
  //dbDebugger("Connected to the database..."); //export DEBUG=app:db
}

module.exports = logAppData;
