/*
  src/controllers/workshopsController.js - the handler logic for /api/workshops
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the workshop resource.
  The router (routes/workshops.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { workshops } = require("../data/store");
const { validateWorkshop } = require("../validators/workshopsValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickWorkshop(data) {
  return {
    name: data.name.trim(),
    city: data.city.trim(),
    employees: data.employees,
    familyRun: data.familyRun,
  };
}

// GET /api/workshops - the whole list
function listWorkshops(req, res) {
  res.json(workshops.all());
}

// GET /api/workshops/:id
function getWorkshop(req, res) {
  const workshop = workshops.find(Number(req.params.id));
  if (!workshop) {
    return res.status(404).json({ error: "Workshop not found" });
  }
  res.json(workshop);
}

// POST /api/workshops - 201 Created, with the new row and a Location header
function createWorkshop(req, res) {
  const { valid, errors } = validateWorkshop(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const created = workshops.insert(pickWorkshop(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/workshops/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceWorkshop(req, res) {
  const id = Number(req.params.id);
  if (!workshops.find(id)) {
    return res.status(404).json({ error: "Workshop not found" });
  }

  const { valid, errors } = validateWorkshop(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  res.json(workshops.replace(id, pickWorkshop(data)));
}

// DELETE /api/workshops/:id - 204 No Content, with no body
function deleteWorkshop(req, res) {
  if (!workshops.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Workshop not found" });
  }
  res.status(204).end();
}

module.exports = {
  listWorkshops, getWorkshop, createWorkshop, replaceWorkshop, deleteWorkshop,
};
