/*
  src/routes/garments.js - a thin router for /api/garments
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/garments", so "/" here means "/api/garments" from outside.
*/

const express = require("express");
const {
  listGarments, garmentStats,
  getGarment,
  createGarment,
  replaceGarment,
  deleteGarment,
} = require("../controllers/garmentsController");

const router = express.Router();

router.get("/", listGarments);
// "/stats" must come BEFORE "/:id", or Express would take "stats" for an id
router.get("/stats", garmentStats);
router.get("/:id", getGarment);
router.post("/", createGarment);
router.put("/:id", replaceGarment);
router.delete("/:id", deleteGarment);

module.exports = router;
