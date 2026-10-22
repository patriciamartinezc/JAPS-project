/*
  src/middleware/logger.js - one log line per request
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
*/

// Application-level middleware: prints "METHOD URL" (e.g. "GET /tasks")
// for every request, then hands the request on down the pipeline.
// Forgetting next() would leave the request hanging with no response.
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

module.exports = logger;
