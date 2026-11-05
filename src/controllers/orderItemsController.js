/*
  src/controllers/orderItemsController.js - the handler logic for /api/order-items
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the order item resource.
  The router (routes/orderItems.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { orderItems, orders, garments } = require("../data/store");
const { validateOrderItem } = require("../validators/orderItemsValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickOrderItem(data) {
  return {
    orderId: data.orderId,
    garmentId: data.garmentId,
    quantity: data.quantity,
    size: data.size,
  };
}

// Does everything this order item points at exist? That needs the data, so it
// is checked here and not in the validator. Answers the same 400 error shape.
function checkReferences(data) {
  const errors = [];
  if (!orders.find(data.orderId)) {
    errors.push({ field: "orderId", message: "no order with that id" });
  }
  if (!garments.find(data.garmentId)) {
    errors.push({ field: "garmentId", message: "no garment with that id" });
  }
  return errors;
}

// GET /api/order-items - the whole list
function listOrderItems(req, res) {
  res.json(orderItems.all());
}

// GET /api/order-items/:id
function getOrderItem(req, res) {
  const orderitem = orderItems.find(Number(req.params.id));
  if (!orderitem) {
    return res.status(404).json({ error: "Order item not found" });
  }
  res.json(orderitem);
}

// POST /api/order-items - 201 Created, with the new row and a Location header
function createOrderItem(req, res) {
  const { valid, errors } = validateOrderItem(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  const created = orderItems.insert(pickOrderItem(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/order-items/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceOrderItem(req, res) {
  const id = Number(req.params.id);
  if (!orderItems.find(id)) {
    return res.status(404).json({ error: "Order item not found" });
  }

  const { valid, errors } = validateOrderItem(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  res.json(orderItems.replace(id, pickOrderItem(data)));
}

// DELETE /api/order-items/:id - 204 No Content, with no body
function deleteOrderItem(req, res) {
  if (!orderItems.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Order item not found" });
  }
  res.status(204).end();
}

module.exports = {
  listOrderItems, getOrderItem, createOrderItem, replaceOrderItem, deleteOrderItem,
};
