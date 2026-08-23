const express = require("express");

const {
  getUserAnalytics,
  getUsersWithStats,
  searchTasks,
} = require("../controllers/analyticsController");

const router = express.Router();

// Keep specific routes before /users/:id
router.get("/tasks/search", searchTasks);
router.get("/users", getUsersWithStats);
router.get("/users/:id", getUserAnalytics);

module.exports = router;