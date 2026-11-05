/*
  src/validators/storesValidator.js - checks the shape of a store
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateStore(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.
*/

const CITIES = ["Madrid", "Barcelona", "Porto"];

function validateStore(body) {
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

  // city - required, one value from the fixed list
  if (data.city === undefined) {
    errors.push({ field: "city", message: "city is required" });
  } else if (!CITIES.includes(data.city)) {
    errors.push({ field: "city", message: `city must be one of ${CITIES.join(", ")}` });
  }

  // address - required, non-empty text, at most 80 characters
  if (data.address === undefined) {
    errors.push({ field: "address", message: "address is required" });
  } else if (typeof data.address !== "string" || data.address.trim() === "") {
    errors.push({ field: "address", message: "address must be a non-empty text" });
  } else if (data.address.trim().length > 80) {
    errors.push({ field: "address", message: "address must be at most 80 characters" });
  }

  // hours - required, non-empty text, at most 160 characters
  if (data.hours === undefined) {
    errors.push({ field: "hours", message: "hours is required" });
  } else if (typeof data.hours !== "string" || data.hours.trim() === "") {
    errors.push({ field: "hours", message: "hours must be a non-empty text" });
  } else if (data.hours.trim().length > 160) {
    errors.push({ field: "hours", message: "hours must be at most 160 characters" });
  }

  // opensSunday - required, true or false only
  if (data.opensSunday === undefined) {
    errors.push({ field: "opensSunday", message: "opensSunday is required" });
  } else if (typeof data.opensSunday !== "boolean") {
    errors.push({ field: "opensSunday", message: "opensSunday must be true or false" });
  }

  // image - optional text, at most 120 characters
  if (data.image !== undefined) {
    if (typeof data.image !== "string") {
      errors.push({ field: "image", message: "image must be text" });
    } else if (data.image.trim().length > 120) {
      errors.push({ field: "image", message: "image must be at most 120 characters" });
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateStore, CITIES };
