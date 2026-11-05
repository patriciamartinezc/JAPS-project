/*
  public/js/workshop.js - fabrics and workshops, through the API
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  How we make our clothes: the fabrics (GET / POST / PUT / DELETE /api/fabrics)
  and the workshops that sew them (/api/workshops).
*/

setupCrud({
  root: document.querySelector("#fabrics-crud"),
  endpoint: "/fabrics",
  singular: "fabric",
  plural: "fabrics",
  columns: [
    { key: "name", label: "Fabric" },
    { key: "origin", label: "Mill in" },
    { key: "gsm", label: "Weight (gsm)" },
    { key: "organic", label: "Organic" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 60 },
    { name: "origin", label: "Mill in", type: "select", options: ORIGINS, required: true },
    { name: "gsm", label: "Weight (gsm)", type: "number", required: true, integer: true, min: 20, max: 800 },
    { name: "organic", label: "Organic", type: "checkbox" },
  ],
});

setupCrud({
  root: document.querySelector("#workshops-crud"),
  endpoint: "/workshops",
  singular: "workshop",
  plural: "workshops",
  columns: [
    { key: "name", label: "Workshop" },
    { key: "city", label: "City" },
    { key: "employees", label: "People" },
    { key: "familyRun", label: "Family-run" },
  ],
  fields: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 60 },
    { name: "city", label: "City", type: "text", required: true, maxLength: 40 },
    { name: "employees", label: "People who work there", type: "number", required: true, integer: true, min: 1, max: 500 },
    { name: "familyRun", label: "Family-run", type: "checkbox" },
  ],
});
