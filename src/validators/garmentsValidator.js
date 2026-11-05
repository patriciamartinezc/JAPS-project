/*
  src/validators/garmentsValidator.js - checks the shape of a garment
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateGarment(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.
*/

const CATEGORIES = ["shirts", "dresses", "skirts", "jackets", "trousers", "shoes", "bags"];

function validateGarment(body) {
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

  // category - required, one value from the fixed list
  if (data.category === undefined) {
    errors.push({ field: "category", message: "category is required" });
  } else if (!CATEGORIES.includes(data.category)) {
    errors.push({ field: "category", message: `category must be one of ${CATEGORIES.join(", ")}` });
  }

  // price - required, a number from 1 to 2000
  if (data.price === undefined) {
    errors.push({ field: "price", message: "price is required" });
  } else if (typeof data.price !== "number" || !Number.isFinite(data.price)) {
    errors.push({ field: "price", message: "price must be a number" });
  } else if (data.price < 1 || data.price > 2000) {
    errors.push({ field: "price", message: "price must be between 1 and 2000" });
  }

  // material - required, non-empty text, at most 80 characters
  if (data.material === undefined) {
    errors.push({ field: "material", message: "material is required" });
  } else if (typeof data.material !== "string" || data.material.trim() === "") {
    errors.push({ field: "material", message: "material must be a non-empty text" });
  } else if (data.material.trim().length > 80) {
    errors.push({ field: "material", message: "material must be at most 80 characters" });
  }

  // inStock - required, true or false only
  if (data.inStock === undefined) {
    errors.push({ field: "inStock", message: "inStock is required" });
  } else if (typeof data.inStock !== "boolean") {
    errors.push({ field: "inStock", message: "inStock must be true or false" });
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

module.exports = { validateGarment, CATEGORIES };
