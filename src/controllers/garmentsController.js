/*
  src/controllers/garmentsController.js - the handler logic for /api/garments
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the garment resource.
  The router (routes/garments.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { garments } = require("../data/store");
const { validateGarment, CATEGORIES } = require("../validators/garmentsValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickGarment(data) {
  return {
    name: data.name.trim(),
    category: data.category,
    price: data.price,
    material: data.material.trim(),
    inStock: data.inStock,
    image: data.image === undefined ? "" : data.image.trim(),
  };
}

// GET /api/garments - the whole list, or a filtered one:
//   ?search=trench          case-insensitive match on the name
//   ?category=jackets       one of the categories in the validator
//   ?inStock=true           true or false
// The filters combine (all of them must match). A value outside the allowed
// ones answers 400 with the same { errors: [...] } shape as a bad body; an
// empty value (?category=) counts as "not given", because that is what an
// empty <select> option sends.
function listGarments(req, res) {
  const { search, category, inStock } = req.query;
  const errors = [];

  if (search !== undefined && typeof search !== "string") {
    errors.push({ field: "search", message: "search must be text" });
  }
  if (category !== undefined && category !== "" && !CATEGORIES.includes(category)) {
    errors.push({ field: "category", message: `category must be one of ${CATEGORIES.join(", ")}` });
  }
  if (inStock !== undefined && inStock !== "" && inStock !== "true" && inStock !== "false") {
    errors.push({ field: "inStock", message: "inStock must be true or false" });
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  let result = garments.all();
  if (search) {
    const term = search.trim().toLowerCase();
    result = result.filter((garment) => garment.name.toLowerCase().includes(term));
  }
  if (category) {
    result = result.filter((garment) => garment.category === category);
  }
  if (inStock) {
    result = result.filter((garment) => garment.inStock === (inStock === "true"));
  }
  res.json(result);
}

// GET /api/garments/stats - a summary computed on EVERY request from the
// current data, never stored, so it is always up to date after a POST, PUT
// or DELETE. The route is declared before /:id in routes/garments.js,
// otherwise Express would read "stats" as an id.
function garmentStats(req, res) {
  const rows = garments.all();
  const total = rows.length;
  const inStock = rows.filter((garment) => garment.inStock).length;

  let sum = 0;
  for (const garment of rows) {
    sum += garment.price;
  }
  const averagePrice = total === 0 ? 0 : Math.round((sum / total) * 100) / 100;

  // every category appears, even with 0 garments
  const byCategory = {};
  for (const category of CATEGORIES) {
    byCategory[category] = 0;
  }
  for (const garment of rows) {
    byCategory[garment.category] += 1;
  }

  res.json({ total, inStock, averagePrice, byCategory });
}

// GET /api/garments/:id
function getGarment(req, res) {
  const garment = garments.find(Number(req.params.id));
  if (!garment) {
    return res.status(404).json({ error: "Garment not found" });
  }
  res.json(garment);
}

// POST /api/garments - 201 Created, with the new row and a Location header
function createGarment(req, res) {
  const { valid, errors } = validateGarment(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const created = garments.insert(pickGarment(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/garments/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceGarment(req, res) {
  const id = Number(req.params.id);
  if (!garments.find(id)) {
    return res.status(404).json({ error: "Garment not found" });
  }

  const { valid, errors } = validateGarment(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  res.json(garments.replace(id, pickGarment(data)));
}

// DELETE /api/garments/:id - 204 No Content, with no body
function deleteGarment(req, res) {
  if (!garments.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Garment not found" });
  }
  res.status(204).end();
}

module.exports = {
  listGarments, garmentStats, getGarment, createGarment, replaceGarment, deleteGarment,
};
