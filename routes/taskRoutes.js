const express = require("express");

const {
  create,
  index,
  show,
  update,
  deleteTask,
  bulkCreate,
} = require("../controllers/taskController");

const router = express.Router();

router.get("/", index);
router.post("/", create);

// Keep /bulk before /:id
router.post("/bulk", bulkCreate);

router.get("/:id", show);
router.patch("/:id", update);
router.delete("/:id", deleteTask);

module.exports = router;