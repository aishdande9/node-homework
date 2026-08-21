const express = require("express");
const { randomUUID } = require("crypto");
const path = require("path");

const dogsRouter = require("./routes/dogs");
const userRouter = require("./routes/userRoutes");
const taskRouter = require("./routes/taskRoutes");
const authMiddleware = require("./middleware/auth");

const app = express();

// Temporary in-memory storage
global.users = global.users || [];
global.tasks = global.tasks || [];
global.user_id = global.user_id || null;

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

// 6. Public user routes
app.use("/api/users", userRouter);

// 7. Protected task routes
app.use("/api/tasks", authMiddleware, taskRouter);

// 8. 404 middleware
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    requestId: req.requestId,
  });
});

// 9. Error-handling middleware
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