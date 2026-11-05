/*
  src/controllers/fabricsController.js - the handler logic for /api/fabrics
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the fabric resource.
  The router (routes/fabrics.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { fabrics } = require("../data/store");
const { validateFabric } = require("../validators/fabricsValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickFabric(data) {
  return {
    name: data.name.trim(),
    origin: data.origin,
    gsm: data.gsm,
    organic: data.organic,
  };
}

// GET /api/fabrics - the whole list
function listFabrics(req, res) {
  res.json(fabrics.all());
}

// GET /api/fabrics/:id
function getFabric(req, res) {
  const fabric = fabrics.find(Number(req.params.id));
  if (!fabric) {
    return res.status(404).json({ error: "Fabric not found" });
  }
  res.json(fabric);
}

// POST /api/fabrics - 201 Created, with the new row and a Location header
function createFabric(req, res) {
  const { valid, errors } = validateFabric(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const created = fabrics.insert(pickFabric(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/fabrics/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceFabric(req, res) {
  const id = Number(req.params.id);
  if (!fabrics.find(id)) {
    return res.status(404).json({ error: "Fabric not found" });
  }

  const { valid, errors } = validateFabric(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  res.json(fabrics.replace(id, pickFabric(data)));
}

// DELETE /api/fabrics/:id - 204 No Content, with no body
function deleteFabric(req, res) {
  if (!fabrics.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Fabric not found" });
  }
  res.status(204).end();
}

module.exports = {
  listFabrics, getFabric, createFabric, replaceFabric, deleteFabric,
};
