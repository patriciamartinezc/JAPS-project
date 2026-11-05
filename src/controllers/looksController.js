/*
  src/controllers/looksController.js - the handler logic for /api/looks
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the look resource.
  The router (routes/looks.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { looks } = require("../data/store");
const { validateLook } = require("../validators/looksValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickLook(data) {
  return {
    title: data.title.trim(),
    season: data.season,
    description: data.description.trim(),
    published: data.published,
    image: data.image === undefined ? "" : data.image.trim(),
  };
}

// GET /api/looks - the whole list
function listLooks(req, res) {
  res.json(looks.all());
}

// GET /api/looks/:id
function getLook(req, res) {
  const look = looks.find(Number(req.params.id));
  if (!look) {
    return res.status(404).json({ error: "Look not found" });
  }
  res.json(look);
}

// POST /api/looks - 201 Created, with the new row and a Location header
function createLook(req, res) {
  const { valid, errors } = validateLook(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const created = looks.insert(pickLook(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/looks/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceLook(req, res) {
  const id = Number(req.params.id);
  if (!looks.find(id)) {
    return res.status(404).json({ error: "Look not found" });
  }

  const { valid, errors } = validateLook(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  res.json(looks.replace(id, pickLook(data)));
}

// DELETE /api/looks/:id - 204 No Content, with no body
function deleteLook(req, res) {
  if (!looks.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Look not found" });
  }
  res.status(204).end();
}

module.exports = {
  listLooks, getLook, createLook, replaceLook, deleteLook,
};
