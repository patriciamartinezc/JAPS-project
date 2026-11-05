/*
  public/js/cards.js - how one garment is drawn as a card
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Shared by index.html (the "New in" card) and collections.html (the whole
  list), so a garment looks the same on both. The card keeps the markup the
  old static pages had: an <article> with an <h3>, a photo, a paragraph with
  the price in a span.price and a buy-row with the "Add to cart" button.
  The data- attributes are what japs-cart.js reads when the button is pressed.
*/

function garmentCard(garment) {
  const card = document.createElement("article");

  const title = document.createElement("h3");
  title.textContent = garment.name;
  card.append(title);

  if (garment.image) {
    const photo = document.createElement("img");
    photo.className = "product-photo portrait";
    photo.src = garment.image;
    photo.alt = `${garment.name}, ${garment.category}`;
    photo.width = 300;
    photo.height = 400;
    photo.loading = "lazy";
    card.append(photo);
  }

  const price = document.createElement("span");
  price.className = "price";
  price.textContent = `${garment.price} €`;
  const text = document.createElement("p");
  text.append(`${garment.material}. `, price, `. Category: ${garment.category}.`);
  card.append(text);

  const buyRow = document.createElement("p");
  buyRow.className = "buy-row";
  if (garment.inStock) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-to-cart";
    button.textContent = "Add to cart";
    button.dataset.name = garment.name;
    button.dataset.price = garment.price;
    button.dataset.image = garment.image;
    buyRow.append(button);
  } else {
    const soldOut = document.createElement("span");
    soldOut.className = "sold-out";
    soldOut.textContent = "Sold out";
    buyRow.append(soldOut);
  }
  card.append(buyRow);

  return card;
}
