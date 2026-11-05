/*
  src/routes/reviews.js - a thin router for /api/reviews
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/reviews", so "/" here means "/api/reviews" from outside.
*/

const express = require("express");
const {
  listReviews,
  getReview,
  createReview,
  replaceReview,
  deleteReview,
} = require("../controllers/reviewsController");

const router = express.Router();

router.get("/", listReviews);
router.get("/:id", getReview);
router.post("/", createReview);
router.put("/:id", replaceReview);
router.delete("/:id", deleteReview);

module.exports = router;
