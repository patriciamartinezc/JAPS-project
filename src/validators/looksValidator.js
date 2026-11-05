/*
  src/validators/looksValidator.js - checks the shape of a look
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateLook(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.
*/

const SEASONS = ["autumn-2026", "spring-2026"];

function validateLook(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // title - required, non-empty text, at most 80 characters
  if (data.title === undefined) {
    errors.push({ field: "title", message: "title is required" });
  } else if (typeof data.title !== "string" || data.title.trim() === "") {
    errors.push({ field: "title", message: "title must be a non-empty text" });
  } else if (data.title.trim().length > 80) {
    errors.push({ field: "title", message: "title must be at most 80 characters" });
  }

  // season - required, one value from the fixed list
  if (data.season === undefined) {
    errors.push({ field: "season", message: "season is required" });
  } else if (!SEASONS.includes(data.season)) {
    errors.push({ field: "season", message: `season must be one of ${SEASONS.join(", ")}` });
  }

  // description - required, non-empty text, at most 300 characters
  if (data.description === undefined) {
    errors.push({ field: "description", message: "description is required" });
  } else if (typeof data.description !== "string" || data.description.trim() === "") {
    errors.push({ field: "description", message: "description must be a non-empty text" });
  } else if (data.description.trim().length > 300) {
    errors.push({ field: "description", message: "description must be at most 300 characters" });
  }

  // published - required, true or false only
  if (data.published === undefined) {
    errors.push({ field: "published", message: "published is required" });
  } else if (typeof data.published !== "boolean") {
    errors.push({ field: "published", message: "published must be true or false" });
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

module.exports = { validateLook, SEASONS };
