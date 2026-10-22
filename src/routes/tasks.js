/*
  src/routes/tasks.js - a thin router for /tasks
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Only wiring: path + method -> controller function. app.js mounts this
  router at "/tasks", so "/" here means "/tasks" from outside.
*/
const express = require("express");
const { listTasks, createTask } = require("../controllers/tasksController");

const router = express.Router();

router.get("/", listTasks);    // GET  /tasks
router.post("/", createTask);  // POST /tasks

module.exports = router;
