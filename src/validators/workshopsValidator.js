/*
  src/validators/workshopsValidator.js - checks the shape of a workshop
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateWorkshop(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.
*/


function validateWorkshop(body) {
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

  // city - required, non-empty text, at most 40 characters
  if (data.city === undefined) {
    errors.push({ field: "city", message: "city is required" });
  } else if (typeof data.city !== "string" || data.city.trim() === "") {
    errors.push({ field: "city", message: "city must be a non-empty text" });
  } else if (data.city.trim().length > 40) {
    errors.push({ field: "city", message: "city must be at most 40 characters" });
  }

  // employees - required, a whole number from 1 to 500
  if (data.employees === undefined) {
    errors.push({ field: "employees", message: "employees is required" });
  } else if (!Number.isInteger(data.employees)) {
    errors.push({ field: "employees", message: "employees must be a whole number" });
  } else if (data.employees < 1 || data.employees > 500) {
    errors.push({ field: "employees", message: "employees must be between 1 and 500" });
  }

  // familyRun - required, true or false only
  if (data.familyRun === undefined) {
    errors.push({ field: "familyRun", message: "familyRun is required" });
  } else if (typeof data.familyRun !== "boolean") {
    errors.push({ field: "familyRun", message: "familyRun must be true or false" });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateWorkshop };
