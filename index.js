const express = require("express");
const app = express();
const logAppData = require("./startup/logging");

require("./startup/routes")(app);
require("./startup/config")();

logAppData(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
