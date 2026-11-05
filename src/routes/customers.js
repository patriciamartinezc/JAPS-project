/*
  src/routes/customers.js - a thin router for /api/customers
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Only wiring: verb + path -> controller function. app.js mounts this router
  at "/api/customers", so "/" here means "/api/customers" from outside.
*/

const express = require("express");
const {
  listCustomers,
  getCustomer,
  createCustomer,
  replaceCustomer,
  deleteCustomer,
} = require("../controllers/customersController");

const router = express.Router();

router.get("/", listCustomers);
router.get("/:id", getCustomer);
router.post("/", createCustomer);
router.put("/:id", replaceCustomer);
router.delete("/:id", deleteCustomer);

module.exports = router;
