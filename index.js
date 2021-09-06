const express = require("express");
const app = express();
app.use(express.json());

require("./startup/routes")(app);

const port = 3000;
app.listen(port, () => console.log("Backend se vrti na portu: " + port));
