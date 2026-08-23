require("dotenv").config();

const express = require("express");

const prisma = require("./db/prisma");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const auth = require("./middleware/auth");

const notFound = require("./middleware/not-found");
const errorHandler = require("./middleware/error-handler");


const app = express();


// Middleware
app.use(express.json());


// Routes
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", auth, taskRoutes);
app.use("/api/analytics", auth, analyticsRoutes);


// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return res.status(200).json({
      status: "ok",
      db: "connected",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      db: "not connected",
      error: err.message,
    });
  }
});


// Not found middleware
app.use(notFound);


// Error handler
app.use(errorHandler);


// Server
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


// Graceful shutdown
const shutdown = async () => {
  console.log("Shutting down server...");

  try {
    await prisma.$disconnect();
    console.log("Prisma disconnected");

    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);


module.exports = app;