/*
  src/middleware/logger.js - one log line per request
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez
*/

// Application-level middleware: prints one line per request, like
// "GET /api/garments -> 200 (2ms)". The line is printed when the response
// has been sent ("finish"), because only then do we know the status code.
// Forgetting next() would leave the request hanging with no response.
function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
}

module.exports = logger;
