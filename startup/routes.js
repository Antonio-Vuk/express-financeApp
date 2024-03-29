const users = require("../routes/users");
const auth = require("../routes/auth");
const wallet = require("../routes/wallet");
const category = require("../routes/category");
const customField = require("../routes/customField");
const transaction = require("../routes/transaction");
const data = require("../routes/data");
const customFieldListValue = require("../routes/customFieldListValue");

module.exports = function (app) {
    app.use(function (req, res, next) {
        if (req.headers.origin) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header(
                "Access-Control-Allow-Headers",
                "content-type, x-auth-token"
            );
            res.header(
                "Access-Control-Allow-Methods",
                "DELETE, PUT, POST, GET"
            );
        }
        next();
    });

    app.get("/error", (req, res) => {
        return res.send("Wrong route!");
    });

    app.use("/api/auth", auth);
    app.use("/api/users", users);
    app.use("/api/wallet", wallet);
    app.use("/api/category", category);
    app.use("/api/customField", customField);
    app.use("/api/transaction", transaction);
    app.use("/api/data", data);
    app.use("/api/customFieldListValue", customFieldListValue);
    app.get("*", function (req, res) {
        res.redirect("/error");
    });
};
