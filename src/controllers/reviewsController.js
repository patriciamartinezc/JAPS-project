/*
  src/controllers/reviewsController.js - the handler logic for /api/reviews
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The five CRUD handlers of the Session 18 lab, on the review resource.
  The router (routes/reviews.js) only maps verbs and paths to these functions;
  the data is read and changed through the tables of data/store.js (all, find,
  insert, replace, remove), never directly from the route. Every handler follows
  the same order: find the row (404), check the body with the validator (400),
  then change the store.
*/

const { reviews, garments } = require("../data/store");
const { validateReview } = require("../validators/reviewsValidator");

// Copies ONLY the fields the API knows, so anything else the client sent is
// stripped and never stored - including an "id", which the server generates.
// It runs after the validator, so every required field is already there.
function pickReview(data) {
  return {
    garmentId: data.garmentId,
    author: data.author.trim(),
    rating: data.rating,
    comment: data.comment.trim(),
  };
}

// Does everything this review points at exist? That needs the data, so it
// is checked here and not in the validator. Answers the same 400 error shape.
function checkReferences(data) {
  const errors = [];
  if (!garments.find(data.garmentId)) {
    errors.push({ field: "garmentId", message: "no garment with that id" });
  }
  return errors;
}

// GET /api/reviews - the whole list
function listReviews(req, res) {
  res.json(reviews.all());
}

// GET /api/reviews/:id
function getReview(req, res) {
  const review = reviews.find(Number(req.params.id));
  if (!review) {
    return res.status(404).json({ error: "Review not found" });
  }
  res.json(review);
}

// POST /api/reviews - 201 Created, with the new row and a Location header
function createReview(req, res) {
  const { valid, errors } = validateReview(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  const created = reviews.insert(pickReview(data));
  res.status(201).location(`${req.baseUrl}/${created.id}`).json(created);
}

// PUT /api/reviews/:id - replaces the whole row (so every required field
// has to be sent again). The id in the URL is kept; an "id" in the body is ignored.
function replaceReview(req, res) {
  const id = Number(req.params.id);
  if (!reviews.find(id)) {
    return res.status(404).json({ error: "Review not found" });
  }

  const { valid, errors } = validateReview(req.body);
  if (!valid) {
    return res.status(400).json({ errors });
  }

  const data = req.body;

  const referenceErrors = checkReferences(data);
  if (referenceErrors.length > 0) {
    return res.status(400).json({ errors: referenceErrors });
  }

  res.json(reviews.replace(id, pickReview(data)));
}

// DELETE /api/reviews/:id - 204 No Content, with no body
function deleteReview(req, res) {
  if (!reviews.remove(Number(req.params.id))) {
    return res.status(404).json({ error: "Review not found" });
  }
  res.status(204).end();
}

module.exports = {
  listReviews, getReview, createReview, replaceReview, deleteReview,
};
