/*
  src/app.js - builds the Express app (it does not start listening)
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Every request goes through the pipeline below, top to bottom, until a
  handler sends a response. Order matters, so it is:
    1. middleware (JSON body parser, logger)
    2. express.static - the pages of public/ (the front end)
    3. the /api routers - one per resource
    4. a JSON 404 for anything nobody answered
    5. the error handler, LAST
  It EXPORTS the app and does not call listen: server.js does that.
*/

const path = require("path");
const express = require("express");
const logger = require("./middleware/logger");

const garmentsRouter = require("./routes/garments");
const storesRouter = require("./routes/stores");
const looksRouter = require("./routes/looks");
const customersRouter = require("./routes/customers");
const ordersRouter = require("./routes/orders");
const orderItemsRouter = require("./routes/orderItems");
const repairsRouter = require("./routes/repairs");
const reviewsRouter = require("./routes/reviews");
const fabricsRouter = require("./routes/fabrics");
const workshopsRouter = require("./routes/workshops");

const app = express();

// 1. Middleware, before any route
app.use(express.json()); // parses a JSON body into req.body
app.use(logger);

// 2. The front end: GET /collections.html sends public/collections.html and
// GET /js/api.js sends public/js/api.js. It sits BEFORE the API routers: a
// request for a page or a script is answered here and never reaches them,
// and the API paths all start with /api, so the two never collide.
app.use(express.static(path.join(__dirname, "..", "public")));

// 3. The API: pages are /collections.html, data is /api/garments
app.use("/api/garments", garmentsRouter);
app.use("/api/stores", storesRouter);
app.use("/api/looks", looksRouter);
app.use("/api/customers", customersRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/order-items", orderItemsRouter);
app.use("/api/repairs", repairsRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/fabrics", fabricsRouter);
app.use("/api/workshops", workshopsRouter);

// 4. Unknown routes: nothing above answered, so say so in JSON (not HTML)
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// 5. Centralised error handler. Express recognises it as an error handler
// because it takes four arguments, so all four must be listed even though
// next is not used. Registered last so it catches errors from everything above.
app.use((err, req, res, next) => {
  // express.json() could not parse the body: the caller's fault, so 400
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Request body is not valid JSON" });
  }

  // The details go to the terminal only. The client gets a short message and
  // never a stack trace, because a stack shows how the server is built.
  console.error(`Error: ${err.message}`);
  const status = err.status && err.status < 500 ? err.status : 500;
  res.status(status).json({ error: status === 500 ? "Server error" : err.message });
});

module.exports = app;
