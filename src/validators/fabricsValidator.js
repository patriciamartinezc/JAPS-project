/*
  src/validators/fabricsValidator.js - checks the shape of a fabric
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateFabric(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.
*/

const ORIGINS = ["Spain", "Portugal", "Italy"];

function validateFabric(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // name - required, non-empty text, at most 60 characters
  if (data.name === undefined) {
    errors.push({ field: "name", message: "name is required" });
  } else if (typeof data.name !== "string" || data.name.trim() === "") {
    errors.push({ field: "name", message: "name must be a non-empty text" });
  } else if (data.name.trim().length > 60) {
    errors.push({ field: "name", message: "name must be at most 60 characters" });
  }

  // origin - required, one value from the fixed list
  if (data.origin === undefined) {
    errors.push({ field: "origin", message: "origin is required" });
  } else if (!ORIGINS.includes(data.origin)) {
    errors.push({ field: "origin", message: `origin must be one of ${ORIGINS.join(", ")}` });
  }

  // gsm - required, a whole number from 20 to 800
  if (data.gsm === undefined) {
    errors.push({ field: "gsm", message: "gsm is required" });
  } else if (!Number.isInteger(data.gsm)) {
    errors.push({ field: "gsm", message: "gsm must be a whole number" });
  } else if (data.gsm < 20 || data.gsm > 800) {
    errors.push({ field: "gsm", message: "gsm must be between 20 and 800" });
  }

  // organic - required, true or false only
  if (data.organic === undefined) {
    errors.push({ field: "organic", message: "organic is required" });
  } else if (typeof data.organic !== "boolean") {
    errors.push({ field: "organic", message: "organic must be true or false" });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateFabric, ORIGINS };
