/*
  src/app.js - builds the Express app (it does not start listening)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Every request goes through the pipeline below, top to bottom, until a
  handler sends a response. Order matters, so it is:
    1. middleware (body parser, logger)
    2. routes
    3. the error handler, last
*/
const express = require("express");
const logger = require("./middleware/logger");
const tasksRouter = require("./routes/tasks");

const app = express();

// 1. Middleware, before any route
app.use(express.json()); // parses a JSON body into req.body
app.use(logger);         // one "METHOD URL" line per request

// 2. Routes
// Liveness check: if this answers, the server is up
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Reflects the URL segment: /echo/hello -> { "echo": "hello" }
app.get("/echo/:msg", (req, res) => {
  res.json({ echo: req.params.msg });
});

// Everything under /tasks is handled by the tasks router
app.use("/tasks", tasksRouter);

// Throws on purpose, to prove the error handler below catches it
app.get("/boom", (req, res) => {
  throw new Error("Boom! This route fails on purpose.");
});

// 3. Centralised error handler. Express recognises it as an error
// handler because it takes four arguments, so all four must be listed
// even though next is not used. Registered last so it catches errors
// from every route above.
app.use((err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;
