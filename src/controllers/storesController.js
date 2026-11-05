/*
  src/controllers/storesController.js - the handler logic for /api/stores
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the store resource.
  The router (routes/stores.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { stores } = require("../data/store");
const { validateStore } = require("../validators/storesValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickStore(data) {
  return {
    name: data.name.trim(),
    city: data.city,
    address: data.address.trim(),
    hours: data.hours.trim(),
    opensSunday: data.opensSunday,
    image: data.image === undefined ? "" : data.image.trim(),
  };
}

// GET /api/stores - the whole list
function listStores(req, res) {
  res.json(stores.all());
}

// GET /api/stores/:id
function getStore(req, res) {
  const store = stores.find(Number(req.params.id));
  if (!store) {
    return res.status(404).json({ error: "Store not found" });
  }
  res.json(store);
}

// POST /api/stores - 201 Created, with the new row and a Location header
function createStore(req, res) {
  const { valid, errors } = validateStore(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const created = stores.insert(pickStore(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/stores/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceStore(req, res) {
  const id = Number(req.params.id);
  if (!stores.find(id)) {
    return res.status(404).json({ error: "Store not found" });
  }

  const { valid, errors } = validateStore(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  res.json(stores.replace(id, pickStore(data)));
}

// DELETE /api/stores/:id - 204 No Content, with no body
function deleteStore(req, res) {
  if (!stores.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Store not found" });
  }
  res.status(204).end();
}

module.exports = {
  listStores, getStore, createStore, replaceStore, deleteStore,
};
