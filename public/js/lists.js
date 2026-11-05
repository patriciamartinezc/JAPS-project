/*
  public/js/lists.js - the fixed lists the forms offer
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  These are the values that have no resource of their own (the categories of
  a garment, the sizes, the order statuses...). The pages write them as fixed
  <select> options. Each list MUST be exactly the one the validator in
  src/validators/ accepts, so the page and the server agree on what is allowed:

    CATEGORIES -> garmentsValidator.js    CITIES   -> storesValidator.js
    SEASONS    -> looksValidator.js       ORDER_STATUSES  -> ordersValidator.js
    COUNTRIES  -> ordersValidator.js      SIZES    -> orderItemsValidator.js
    REPAIR_STATUSES -> repairsValidator.js  ORIGINS -> fabricsValidator.js

  In Practice 2 these lists will come from the API as well.
*/

const CATEGORIES = ["shirts", "dresses", "skirts", "jackets", "trousers", "shoes", "bags"];
const CITIES = ["Madrid", "Barcelona", "Porto"];
const SEASONS = ["autumn-2026", "spring-2026"];
const ORDER_STATUSES = ["pending", "paid", "shipped", "delivered"];
const COUNTRIES = ["Spain", "Portugal", "Other"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const REPAIR_STATUSES = ["received", "in-progress", "done"];
const ORIGINS = ["Spain", "Portugal", "Italy"];
