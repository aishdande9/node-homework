const express = require("express");

const timeRoutes = require("./routes/timeRoutes");
const userRoutes = require("./routes/userRoutes");
const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");

const app = express();

global.user_id = null;
global.users = [];
global.tasks = [];

app.use(express.json());

app.use("/api", timeRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const port = 3000;

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

module.exports = {
  app,
  server,
};