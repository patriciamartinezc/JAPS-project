/*
  src/controllers/tasksController.js - the handler logic for /tasks
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  The routes call these functions and never touch the data themselves.
  Session 18 turns this array into full CRUD and Session 22 swaps it for
  a SQL database; only this file has to change when that happens.
*/

// Placeholder data: hard-coded, no database yet
const tasks = [
  { id: 1, title: "Write the API skeleton", done: false, userId: 1 },
  { id: 2, title: "Photograph the autumn collection", done: true, userId: 1 },
  { id: 3, title: "Update the store opening hours", done: false, userId: 2 }
];

// GET /tasks - the whole array as JSON
function listTasks(req, res) {
  res.json(tasks);
}

// POST /tasks - echo the parsed body back with 201 Created. The body is
// only an object here because express.json() ran first in app.js.
function createTask(req, res) {
  res.status(201).json(req.body);
}

module.exports = { listTasks, createTask };
