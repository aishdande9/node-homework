const express = require("express");
const { randomUUID } = require("crypto");
const path = require("path");

const dogsRouter = require("./routes/dogs");

const app = express();

// 1. Request ID middleware
app.use((req, res, next) => {
  req.requestId = randomUUID();
  res.setHeader("X-Request-Id", req.requestId);
  next();
});

// 2. Logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(
    `[${timestamp}]: ${req.method} ${req.path} (${req.requestId})`,
  );

  next();
});

// 3. JSON parsing middleware
app.use(express.json());

// 4. Static file middleware
app.use(express.static(path.join(__dirname, "public")));

// 5. Dog routes
app.use("/", dogsRouter); // Do not remove this line

// 6. 404 middleware
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.requestId,
  });
});

// 7. Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    error: "Internal Server Error",
    requestId: req.requestId,
  });
});

if (require.main === module) {
  app.listen(3000, () => {
    console.log("Dog rescue app is listening on port 3000...");
  });
}

module.exports = app;