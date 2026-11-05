/*
  src/routes/stores.js - a thin router for /api/stores
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/stores", so "/" here means "/api/stores" from outside.
*/

const express = require("express");
const {
  listStores,
  getStore,
  createStore,
  replaceStore,
  deleteStore,
} = require("../controllers/storesController");

const router = express.Router();

router.get("/", listStores);
router.get("/:id", getStore);
router.post("/", createStore);
router.put("/:id", replaceStore);
router.delete("/:id", deleteStore);

module.exports = router;
