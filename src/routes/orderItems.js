/*
  src/routes/orderItems.js - a thin router for /api/order-items
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/order-items", so "/" here means "/api/order-items" from outside.
*/

const express = require("express");
const {
  listOrderItems,
  getOrderItem,
  createOrderItem,
  replaceOrderItem,
  deleteOrderItem,
} = require("../controllers/orderItemsController");

const router = express.Router();

router.get("/", listOrderItems);
router.get("/:id", getOrderItem);
router.post("/", createOrderItem);
router.put("/:id", replaceOrderItem);
router.delete("/:id", deleteOrderItem);

module.exports = router;
