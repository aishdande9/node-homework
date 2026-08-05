const pool = require("../db/pg-pool");

const {
taskSchema,
patchTaskSchema,
} = require("../validation/taskSchema");

const create = async (req, res) => {
if (!req.body) {
req.body = {};
}

const { error, value } = taskSchema.validate(req.body, {
abortEarly: false,
});

if (error) {
return res.status(400).json({
message: error.message,
});
}

const result = await pool.query(
`INSERT INTO tasks (title, is_completed, user_id)
     VALUES ($1, $2, $3)
     RETURNING id, title, is_completed`,
[value.title, value.isCompleted, global.user_id],
);

return res.status(201).json(result.rows[0]);
};

const index = async (req, res) => {
const result = await pool.query(
`SELECT id, title, is_completed
     FROM tasks
     WHERE user_id = $1
     ORDER BY id`,
[global.user_id],
);

if (result.rows.length === 0) {
return res.status(404).json({
message: "No tasks found",
});
}

return res.status(200).json(result.rows);
};

const show = async (req, res) => {
const taskId = Number(req.params?.id);

if (!Number.isInteger(taskId) || taskId <= 0) {
return res.status(400).json({
message: "Invalid task ID",
});
}

const result = await pool.query(
`SELECT id, title, is_completed
     FROM tasks
     WHERE id = $1 AND user_id = $2`,
[taskId, global.user_id],
);

if (result.rows.length === 0) {
return res.status(404).json({
message: "Task not found",
});
}

return res.status(200).json(result.rows[0]);
};

const update = async (req, res) => {
if (!req.body) {
req.body = {};
}

const { error, value } = patchTaskSchema.validate(req.body, {
abortEarly: false,
});

if (error) {
return res.status(400).json({
message: error.message,
});
}

const taskId = Number(req.params?.id);

if (!Number.isInteger(taskId) || taskId <= 0) {
return res.status(400).json({
message: "Invalid task ID",
});
}

const keys = Object.keys(value);

const databaseKeys = keys.map((key) =>
key === "isCompleted" ? "is_completed" : key,
);

const setClauses = databaseKeys
.map((key, index) => `${key} = $${index + 1}`)
.join(", ");

const taskIdParameter = `$${keys.length + 1}`;
const userIdParameter = `$${keys.length + 2}`;

const result = await pool.query(
`UPDATE tasks
     SET ${setClauses}
     WHERE id = ${taskIdParameter}
       AND user_id = ${userIdParameter}
     RETURNING id, title, is_completed`,
[...Object.values(value), taskId, global.user_id],
);

if (result.rows.length === 0) {
return res.status(404).json({
message: "Task not found",
});
}

return res.status(200).json(result.rows[0]);
};

const deleteTask = async (req, res) => {
const taskId = Number(req.params?.id);

if (!Number.isInteger(taskId) || taskId <= 0) {
return res.status(400).json({
message: "Invalid task ID",
});
}

const result = await pool.query(
`DELETE FROM tasks
     WHERE id = $1 AND user_id = $2
     RETURNING id, title, is_completed`,
[taskId, global.user_id],
);

if (result.rows.length === 0) {
return res.status(404).json({
message: "Task not found",
});
}

return res.status(200).json(result.rows[0]);
};

module.exports = {
create,
index,
show,
update,
deleteTask,
};
