/*
  public/js/lookbook.js - the lookbook page reads and writes the API
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  The looks come from GET /api/looks, drawn as cards (the same markup the
  static page had: an <article> with an <h3>, a photo and a paragraph).
*/

function lookCard(look) {
  const card = document.createElement("article");

  const title = document.createElement("h3");
  title.textContent = look.title;
  card.append(title);

  if (look.image) {
    const photo = document.createElement("img");
    photo.className = "product-photo";
    photo.src = look.image;
    photo.alt = look.title;
    photo.width = 600;
    photo.height = 600;
    photo.loading = "lazy";
    card.append(photo);
  }

  const text = document.createElement("p");
  text.textContent = look.description;
  card.append(text);

  const season = document.createElement("p");
  season.className = "meta";
  season.textContent = look.published ? `Season: ${look.season}` : `Season: ${look.season} (not published yet)`;
  card.append(season);

  return card;
}

setupCrud({
  root: document.querySelector("#looks-crud"),
  endpoint: "/looks",
  singular: "look",
  plural: "looks",
  cards: true,
  renderCard: lookCard,
  fields: [
    { name: "title", label: "Title", type: "text", required: true, maxLength: 80 },
    { name: "season", label: "Season", type: "select", options: SEASONS, required: true },
    { name: "description", label: "Description", type: "text", required: true, maxLength: 300 },
    { name: "published", label: "Published", type: "checkbox" },
    { name: "image", label: "Image path (optional)", type: "text", maxLength: 120 },
  ],
});
