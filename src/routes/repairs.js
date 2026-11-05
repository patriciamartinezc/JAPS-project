/*
  src/routes/repairs.js - a thin router for /api/repairs
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/repairs", so "/" here means "/api/repairs" from outside.
*/

const express = require("express");
const {
  listRepairs,
  getRepair,
  createRepair,
  replaceRepair,
  deleteRepair,
} = require("../controllers/repairsController");

const router = express.Router();

router.get("/", listRepairs);
router.get("/:id", getRepair);
router.post("/", createRepair);
router.put("/:id", replaceRepair);
router.delete("/:id", deleteRepair);

module.exports = router;
