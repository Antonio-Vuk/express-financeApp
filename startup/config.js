const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    //throw new Error("FATAL ERROR: jwtPrivateKey is not defined.");
    //console.log("FATAL ERROR: jwtPrivateKey is not defines.");
    //process.exit(1);
    //export jwtPrivateKey=mySecureKey
  }
};
