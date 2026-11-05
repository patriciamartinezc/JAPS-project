/*
  src/validators/customersValidator.js - checks the shape of a customer
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateCustomer(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.
*/

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // a@b.co - a shape check, not proof the inbox exists

function validateCustomer(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // fullName - required, non-empty text, at most 60 characters
  if (data.fullName === undefined) {
    errors.push({ field: "fullName", message: "fullName is required" });
  } else if (typeof data.fullName !== "string" || data.fullName.trim() === "") {
    errors.push({ field: "fullName", message: "fullName must be a non-empty text" });
  } else if (data.fullName.trim().length > 60) {
    errors.push({ field: "fullName", message: "fullName must be at most 60 characters" });
  }

  // email - required, an email address, at most 80 characters
  if (data.email === undefined) {
    errors.push({ field: "email", message: "email is required" });
  } else if (typeof data.email !== "string" || !EMAIL.test(data.email.trim())) {
    errors.push({ field: "email", message: "email must be an email address" });
  } else if (data.email.trim().length > 80) {
    errors.push({ field: "email", message: "email must be at most 80 characters" });
  }

  // city - required, non-empty text, at most 40 characters
  if (data.city === undefined) {
    errors.push({ field: "city", message: "city is required" });
  } else if (typeof data.city !== "string" || data.city.trim() === "") {
    errors.push({ field: "city", message: "city must be a non-empty text" });
  } else if (data.city.trim().length > 40) {
    errors.push({ field: "city", message: "city must be at most 40 characters" });
  }

  // newsletter - required, true or false only
  if (data.newsletter === undefined) {
    errors.push({ field: "newsletter", message: "newsletter is required" });
  } else if (typeof data.newsletter !== "boolean") {
    errors.push({ field: "newsletter", message: "newsletter must be true or false" });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateCustomer };
