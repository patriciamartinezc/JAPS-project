/*
  src/routes/looks.js - a thin router for /api/looks
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/looks", so "/" here means "/api/looks" from outside.
*/

const express = require("express");
const {
  listLooks,
  getLook,
  createLook,
  replaceLook,
  deleteLook,
} = require("../controllers/looksController");

const router = express.Router();

router.get("/", listLooks);
router.get("/:id", getLook);
router.post("/", createLook);
router.put("/:id", replaceLook);
router.delete("/:id", deleteLook);

module.exports = router;
