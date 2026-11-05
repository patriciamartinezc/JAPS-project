/*
  src/routes/orders.js - a thin router for /api/orders
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/orders", so "/" here means "/api/orders" from outside.
*/

const express = require("express");
const {
  listOrders,
  getOrder,
  createOrder,
  replaceOrder,
  deleteOrder,
} = require("../controllers/ordersController");

const router = express.Router();

router.get("/", listOrders);
router.get("/:id", getOrder);
router.post("/", createOrder);
router.put("/:id", replaceOrder);
router.delete("/:id", deleteOrder);

module.exports = router;
