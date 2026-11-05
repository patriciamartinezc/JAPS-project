/*
  public/js/login.js - creating an account is POST /api/customers
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The sign-in form above stays front-end only (no login or authentication
  in Practice 1). The "Create an account" form and the customers table are
  the customers resource: list, create, edit, delete.
*/

setupCrud({
  root: document.querySelector("#customers-crud"),
  endpoint: "/customers",
  singular: "customer",
  plural: "customers",
  columns: [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "newsletter", label: "Restock emails" },
  ],
  fields: [
    { name: "fullName", label: "Full name", type: "text", required: true, maxLength: 60 },
    { name: "email", label: "Email address", type: "email", required: true, maxLength: 80 },
    { name: "city", label: "City", type: "text", required: true, maxLength: 40 },
    { name: "newsletter", label: "Email me when a piece I want is back in stock", type: "checkbox" },
  ],
});
