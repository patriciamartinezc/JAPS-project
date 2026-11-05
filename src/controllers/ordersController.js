/*
  src/controllers/ordersController.js - the handler logic for /api/orders
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the order resource.
  The router (routes/orders.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { orders, customers } = require("../data/store");
const { validateOrder } = require("../validators/ordersValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickOrder(data) {
  return {
    customerId: data.customerId,
    status: data.status,
    country: data.country,
    total: data.total,
  };
}

// Does everything this order points at exist? That needs the data, so it
// is checked here and not in the validator. Answers the same 400 error shape.
function checkReferences(data) {
  const errors = [];
  if (!customers.find(data.customerId)) {
    errors.push({ field: "customerId", message: "no customer with that id" });
  }
  return errors;
}

// GET /api/orders - the whole list
function listOrders(req, res) {
  res.json(orders.all());
}

// GET /api/orders/:id
function getOrder(req, res) {
  const order = orders.find(Number(req.params.id));
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.json(order);
}

// POST /api/orders - 201 Created, with the new row and a Location header
function createOrder(req, res) {
  const { valid, errors } = validateOrder(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  const created = orders.insert(pickOrder(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/orders/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceOrder(req, res) {
  const id = Number(req.params.id);
  if (!orders.find(id)) {
    return res.status(404).json({ error: "Order not found" });
  }

  const { valid, errors } = validateOrder(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  res.json(orders.replace(id, pickOrder(data)));
}

// DELETE /api/orders/:id - 204 No Content, with no body
function deleteOrder(req, res) {
  if (!orders.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Order not found" });
  }
  res.status(204).end();
}

module.exports = {
  listOrders, getOrder, createOrder, replaceOrder, deleteOrder,
};
