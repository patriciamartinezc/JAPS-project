/*
  src/routes/workshops.js - a thin router for /api/workshops
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/workshops", so "/" here means "/api/workshops" from outside.
*/

const express = require("express");
const {
  listWorkshops,
  getWorkshop,
  createWorkshop,
  replaceWorkshop,
  deleteWorkshop,
} = require("../controllers/workshopsController");

const router = express.Router();

router.get("/", listWorkshops);
router.get("/:id", getWorkshop);
router.post("/", createWorkshop);
router.put("/:id", replaceWorkshop);
router.delete("/:id", deleteWorkshop);

module.exports = router;
