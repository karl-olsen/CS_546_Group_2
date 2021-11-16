const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");

const configRoutes = require("./routes");

app.use("/public", static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const logger = (req, res, next) => {
  const log = `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl}`;
  console.log(log);
  next();
};

app.use(logger);

configRoutes(app);

app.listen(3001, () => {
  console.log("Ez-el backend server running on http://localhost:3001");
});
