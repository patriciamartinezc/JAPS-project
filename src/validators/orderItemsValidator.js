/*
  src/validators/orderItemsValidator.js - checks the shape of a order item
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  validateOrderItem(body) returns { valid, errors: [{ field, message }] } and
  lists EVERY problem, not just the first one, so the page can show all the
  messages at once. It is a pure function: it never sees req, res or the store.

  What it does NOT check: whether the ids it points at really exist. That
  needs the data, so it stays in the controller (same split as the tickets
  validator of the Riverside example).
*/

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

function validateOrderItem(body) {
  // express.json() leaves req.body undefined when nothing was sent
  const data = body || {};
  const errors = [];

  // orderId - required, the id of a order (a positive whole number)
  if (data.orderId === undefined) {
    errors.push({ field: "orderId", message: "orderId is required" });
  } else if (!Number.isInteger(data.orderId) || data.orderId < 1) {
    errors.push({ field: "orderId", message: "orderId must be a positive whole number" });
  }

  // garmentId - required, the id of a garment (a positive whole number)
  if (data.garmentId === undefined) {
    errors.push({ field: "garmentId", message: "garmentId is required" });
  } else if (!Number.isInteger(data.garmentId) || data.garmentId < 1) {
    errors.push({ field: "garmentId", message: "garmentId must be a positive whole number" });
  }

  // quantity - required, a whole number from 1 to 20
  if (data.quantity === undefined) {
    errors.push({ field: "quantity", message: "quantity is required" });
  } else if (!Number.isInteger(data.quantity)) {
    errors.push({ field: "quantity", message: "quantity must be a whole number" });
  } else if (data.quantity < 1 || data.quantity > 20) {
    errors.push({ field: "quantity", message: "quantity must be between 1 and 20" });
  }

  // size - required, one value from the fixed list
  if (data.size === undefined) {
    errors.push({ field: "size", message: "size is required" });
  } else if (!SIZES.includes(data.size)) {
    errors.push({ field: "size", message: `size must be one of ${SIZES.join(", ")}` });
  }

  return { valid: errors.length === 0, errors };
}

module.exports = { validateOrderItem, SIZES };
