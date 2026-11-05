/*
  public/js/collections.js - the collections page reads and writes the API
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

    - garments: the list comes from GET /api/garments, filtered ON THE SERVER by
      the search box and the two selects (they build the query string);
      the form creates (POST), edits (PUT) and deletes (DELETE) garments
    - reviews: the same, on /api/reviews

  The list, form and error code is in crud.js; this file only says what a
  garment and a review look like.
*/

const filtersForm = document.querySelector("#garment-filters");

// ?search=trench&category=jackets&inStock=true - only the filters that have a value
function garmentQuery() {
  const params = new URLSearchParams();
  for (const [name, value] of new FormData(filtersForm)) {
    if (value.trim() !== "") {
      params.set(name, value.trim());
    }
  }
  const text = params.toString();
  return text === "" ? "" : "?" + text;
}

const garmentsCrud = setupCrud({
  root: document.querySelector("#garments-crud"),
  endpoint: "/garments",
  singular: "garment",
  plural: "garments",
  cards: true,
  renderCard: garmentCard,
  filters: filtersForm,
  query: garmentQuery,
  emptyMessage: "No garment matches those filters.",
  fields: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 60 },
    { name: "category", label: "Category", type: "select", options: CATEGORIES, required: true },
    { name: "price", label: "Price (€)", type: "number", required: true, min: 1, max: 2000 },
    { name: "material", label: "Material", type: "text", required: true, maxLength: 80 },
    { name: "inStock", label: "In stock", type: "checkbox" },
    { name: "image", label: "Image path (optional)", type: "text", maxLength: 120 },
  ],
  // The reviews form lists the garments, so it has to know about the change
  onChange: async () => {
    await reviewsCrud.reloadOptions();
    await reviewsCrud.reload();
  },
});

const reviewsCrud = setupCrud({
  root: document.querySelector("#reviews-crud"),
  endpoint: "/reviews",
  singular: "review",
  plural: "reviews",
  columns: [
    { key: "garmentId", label: "Garment", lookup: "garmentId" },
    { key: "author", label: "Author" },
    { key: "rating", label: "Rating (1-5)" },
    { key: "comment", label: "Comment" },
  ],
  fields: [
    { name: "garmentId", label: "Garment", type: "select", required: true, optionsFrom: { endpoint: "/garments", label: (garment) => garment.name } },
    { name: "author", label: "Your name", type: "text", required: true, maxLength: 40 },
    { name: "rating", label: "Rating (1 to 5)", type: "number", required: true, integer: true, min: 1, max: 5 },
    { name: "comment", label: "Comment", type: "text", required: true, maxLength: 300 },
  ],
});
