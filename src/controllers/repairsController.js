/*
  src/controllers/repairsController.js - the handler logic for /api/repairs
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the repair resource.
  The router (routes/repairs.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { repairs, customers, stores } = require("../data/store");
const { validateRepair } = require("../validators/repairsValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickRepair(data) {
  return {
    customerId: data.customerId,
    storeId: data.storeId,
    description: data.description.trim(),
    status: data.status,
  };
}

// Does everything this repair points at exist? That needs the data, so it
// is checked here and not in the validator. Answers the same 400 error shape.
function checkReferences(data) {
  const errors = [];
  if (!customers.find(data.customerId)) {
    errors.push({ field: "customerId", message: "no customer with that id" });
  }
  if (!stores.find(data.storeId)) {
    errors.push({ field: "storeId", message: "no store with that id" });
  }
  return errors;
}

// GET /api/repairs - the whole list
function listRepairs(req, res) {
  res.json(repairs.all());
}

// GET /api/repairs/:id
function getRepair(req, res) {
  const repair = repairs.find(Number(req.params.id));
  if (!repair) {
    return res.status(404).json({ error: "Repair not found" });
  }
  res.json(repair);
}

// POST /api/repairs - 201 Created, with the new row and a Location header
function createRepair(req, res) {
  const { valid, errors } = validateRepair(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  const created = repairs.insert(pickRepair(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/repairs/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceRepair(req, res) {
  const id = Number(req.params.id);
  if (!repairs.find(id)) {
    return res.status(404).json({ error: "Repair not found" });
  }

  const { valid, errors } = validateRepair(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  res.json(repairs.replace(id, pickRepair(data)));
}

// DELETE /api/repairs/:id - 204 No Content, with no body
function deleteRepair(req, res) {
  if (!repairs.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Repair not found" });
  }
  res.status(204).end();
}

module.exports = {
  listRepairs, getRepair, createRepair, replaceRepair, deleteRepair,
};
