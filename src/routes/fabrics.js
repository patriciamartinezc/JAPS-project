/*
  src/routes/fabrics.js - a thin router for /api/fabrics
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/fabrics", so "/" here means "/api/fabrics" from outside.
*/

const express = require("express");
const {
  listFabrics,
  getFabric,
  createFabric,
  replaceFabric,
  deleteFabric,
} = require("../controllers/fabricsController");

const router = express.Router();

router.get("/", listFabrics);
router.get("/:id", getFabric);
router.post("/", createFabric);
router.put("/:id", replaceFabric);
router.delete("/:id", deleteFabric);

module.exports = router;
