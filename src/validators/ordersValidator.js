/*
  src/validators/ordersValidator.js - checks the shape of a order
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateOrder(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.

  What it does NOT check: whether the ids it points at really exist. That
  needs the data, so it stays in the controller (same split as the tickets
  validator of the Riverside example).
*/

const STATUSES = ["pending", "paid", "shipped", "delivered"];
const COUNTRIES = ["Spain", "Portugal", "Other"];

function validateOrder(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // customerId - required, the id of a customer (a positive whole number)
  if (data.customerId === undefined) {
    errors.push({ field: "customerId", message: "customerId is required" });
  } else if (!Number.isInteger(data.customerId) || data.customerId < 1) {
    errors.push({ field: "customerId", message: "customerId must be a positive whole number" });
  }

  // status - required, one value from the fixed list
  if (data.status === undefined) {
    errors.push({ field: "status", message: "status is required" });
  } else if (!STATUSES.includes(data.status)) {
    errors.push({ field: "status", message: `status must be one of ${STATUSES.join(", ")}` });
  }

  // country - required, one value from the fixed list
  if (data.country === undefined) {
    errors.push({ field: "country", message: "country is required" });
  } else if (!COUNTRIES.includes(data.country)) {
    errors.push({ field: "country", message: `country must be one of ${COUNTRIES.join(", ")}` });
  }

  // total - required, a number from 0 to 10000
  if (data.total === undefined) {
    errors.push({ field: "total", message: "total is required" });
  } else if (typeof data.total !== "number" || !Number.isFinite(data.total)) {
    errors.push({ field: "total", message: "total must be a number" });
  } else if (data.total < 0 || data.total > 10000) {
    errors.push({ field: "total", message: "total must be between 0 and 10000" });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateOrder, STATUSES, COUNTRIES };
