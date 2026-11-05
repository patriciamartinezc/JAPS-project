/*
  src/validators/reviewsValidator.js - checks the shape of a review
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateReview(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.

  What it does NOT check: whether the ids it points at really exist. That
  needs the data, so it stays in the controller (same split as the tickets
  validator of the Riverside example).
*/


function validateReview(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // garmentId - required, the id of a garment (a positive whole number)
  if (data.garmentId === undefined) {
    errors.push({ field: "garmentId", message: "garmentId is required" });
  } else if (!Number.isInteger(data.garmentId) || data.garmentId < 1) {
    errors.push({ field: "garmentId", message: "garmentId must be a positive whole number" });
  }

  // author - required, non-empty text, at most 40 characters
  if (data.author === undefined) {
    errors.push({ field: "author", message: "author is required" });
  } else if (typeof data.author !== "string" || data.author.trim() === "") {
    errors.push({ field: "author", message: "author must be a non-empty text" });
  } else if (data.author.trim().length > 40) {
    errors.push({ field: "author", message: "author must be at most 40 characters" });
  }

  // rating - required, a whole number from 1 to 5
  if (data.rating === undefined) {
    errors.push({ field: "rating", message: "rating is required" });
  } else if (!Number.isInteger(data.rating)) {
    errors.push({ field: "rating", message: "rating must be a whole number" });
  } else if (data.rating < 1 || data.rating > 5) {
    errors.push({ field: "rating", message: "rating must be between 1 and 5" });
  }

  // comment - required, non-empty text, at most 300 characters
  if (data.comment === undefined) {
    errors.push({ field: "comment", message: "comment is required" });
  } else if (typeof data.comment !== "string" || data.comment.trim() === "") {
    errors.push({ field: "comment", message: "comment must be a non-empty text" });
  } else if (data.comment.trim().length > 300) {
    errors.push({ field: "comment", message: "comment must be at most 300 characters" });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateReview };
