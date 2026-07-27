const {
    taskSchema,
    patchTaskSchema,
  } = require("../validation/taskSchema");
  
  if (!global.tasks) {
    global.tasks = [];
  }
  
  let currentTaskId = 0;
  
  function taskCounter() {
    currentTaskId += 1;
    return currentTaskId;
  }
  
  function sanitizeTask(task) {
    const { userId, ...sanitizedTask } = task;
    return sanitizedTask;
  }
  
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
  
    const newTask = {
      id: taskCounter(),
      userId: global.user_id.email,
      ...value,
    };
  
    global.tasks.push(newTask);
  
    return res.status(201).json(sanitizeTask(newTask));
  };
  
  const index = async (req, res) => {
    const userTasks = global.tasks.filter(
      (task) => task.userId === global.user_id.email,
    );
  
    if (userTasks.length === 0) {
      return res.status(404).json({
        message: "No tasks found",
      });
    }
  
    const sanitizedTasks = userTasks.map((task) =>
      sanitizeTask(task),
    );
  
    return res.status(200).json(sanitizedTasks);
  };
  
  const show = async (req, res) => {
    const taskId = Number(req.params?.id);
  
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
  
    const task = global.tasks.find(
      (storedTask) =>
        storedTask.id === taskId &&
        storedTask.userId === global.user_id.email,
    );
  
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
  
    return res.status(200).json(sanitizeTask(task));
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
  
    const task = global.tasks.find(
      (storedTask) =>
        storedTask.id === taskId &&
        storedTask.userId === global.user_id.email,
    );
  
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
  
    Object.assign(task, value);
  
    return res.status(200).json(sanitizeTask(task));
  };
  
  const deleteTask = async (req, res) => {
    const taskId = Number(req.params?.id);
  
    if (!Number.isInteger(taskId) || taskId <= 0) {
      return res.status(400).json({
        message: "Invalid task ID",
      });
    }
  
    const taskIndex = global.tasks.findIndex(
      (task) =>
        task.id === taskId &&
        task.userId === global.user_id.email,
    );
  
    if (taskIndex === -1) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
  
    const deletedTask = global.tasks[taskIndex];
    const sanitizedTask = sanitizeTask(deletedTask);
  
    global.tasks.splice(taskIndex, 1);
  
    return res.status(200).json(sanitizedTask);
  };
  
  module.exports = {
    create,
    index,
    show,
    update,
    deleteTask,
  };