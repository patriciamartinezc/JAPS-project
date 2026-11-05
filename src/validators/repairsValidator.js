/*
  src/validators/repairsValidator.js - checks the shape of a repair
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateRepair(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.

  What it does NOT check: whether the ids it points at really exist. That
  needs the data, so it stays in the controller (same split as the tickets
  validator of the Riverside example).
*/

const STATUSES = ["received", "in-progress", "done"];

function validateRepair(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // customerId - required, the id of a customer (a positive whole number)
  if (data.customerId === undefined) {
    errors.push({ field: "customerId", message: "customerId is required" });
  } else if (!Number.isInteger(data.customerId) || data.customerId < 1) {
    errors.push({ field: "customerId", message: "customerId must be a positive whole number" });
  }

  // storeId - required, the id of a store (a positive whole number)
  if (data.storeId === undefined) {
    errors.push({ field: "storeId", message: "storeId is required" });
  } else if (!Number.isInteger(data.storeId) || data.storeId < 1) {
    errors.push({ field: "storeId", message: "storeId must be a positive whole number" });
  }

  // description - required, non-empty text, at most 200 characters
  if (data.description === undefined) {
    errors.push({ field: "description", message: "description is required" });
  } else if (typeof data.description !== "string" || data.description.trim() === "") {
    errors.push({ field: "description", message: "description must be a non-empty text" });
  } else if (data.description.trim().length > 200) {
    errors.push({ field: "description", message: "description must be at most 200 characters" });
  }

  // status - required, one value from the fixed list
  if (data.status === undefined) {
    errors.push({ field: "status", message: "status is required" });
  } else if (!STATUSES.includes(data.status)) {
    errors.push({ field: "status", message: `status must be one of ${STATUSES.join(", ")}` });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateRepair, STATUSES };
