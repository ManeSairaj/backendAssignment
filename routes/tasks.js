const express = require("express");
const router = express.Router();

const tasks = [];

router.get("/", (req, res) => {
  console.log(req);
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedTasks = tasks.slice(startIndex, endIndex);

  res.status(200).json(paginatedTasks);
});

router.get("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

router.post("/", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required" });
  }

  const taskId = tasks.length + 1;
  const newTask = { id: taskId, title, description, completed: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

router.put("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;
  const taskToUpdate = tasks.find((task) => task.id === taskId);

  if (!taskToUpdate) {
    return res.status(404).json({ error: "Task not found" });
  }

  if (title) taskToUpdate.title = title;
  if (description) taskToUpdate.description = description;
  if (completed !== undefined) taskToUpdate.completed = completed;

  res.status(200).json(taskToUpdate);
});

router.delete("/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1);
  res.status(200).json({ message: "task deleted", ...deletedTask[0] });
});

module.exports = router;
