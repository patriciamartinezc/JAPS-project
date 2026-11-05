/*
  public/js/stores.js - the stores page reads and writes the API
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

    - stores: GET /api/stores drawn as cards, plus the form (POST / PUT / DELETE)
    - repairs: the free repairs left in a store, on /api/repairs. A repair
      points at a customer and at a store, so those two selects are filled
      from GET /api/customers and GET /api/stores.
*/

function storeCard(store) {
  const card = document.createElement("article");

  const title = document.createElement("h3");
  title.textContent = `${store.city} - ${store.address}`;
  card.append(title);

  if (store.image) {
    const photo = document.createElement("img");
    photo.className = "store-photo";
    photo.src = store.image;
    photo.alt = `Shop front of the ${store.name} store`;
    photo.width = 600;
    photo.height = 400;
    photo.loading = "lazy";
    card.append(photo);
  }

  const name = document.createElement("p");
  name.textContent = `${store.name}. ${store.opensSunday ? "Open on Sundays." : "Closed on Sundays."}`;
  card.append(name);

  const heading = document.createElement("h4");
  heading.textContent = "Opening hours";
  const hours = document.createElement("p");
  hours.textContent = store.hours;
  card.append(heading, hours);

  return card;
}

const storesCrud = setupCrud({
  root: document.querySelector("#stores-crud"),
  endpoint: "/stores",
  singular: "store",
  plural: "stores",
  cards: true,
  renderCard: storeCard,
  fields: [
    { name: "name", label: "Name", type: "text", required: true, maxLength: 60 },
    { name: "city", label: "City", type: "select", options: CITIES, required: true },
    { name: "address", label: "Address", type: "text", required: true, maxLength: 80 },
    { name: "hours", label: "Opening hours", type: "text", required: true, maxLength: 160 },
    { name: "opensSunday", label: "Open on Sundays", type: "checkbox" },
    { name: "image", label: "Image path (optional)", type: "text", maxLength: 120 },
  ],
  // The repairs form lists the stores, so it has to know about the change
  onChange: async () => {
    await repairsCrud.reloadOptions();
    await repairsCrud.reload();
  },
});

const repairsCrud = setupCrud({
  root: document.querySelector("#repairs-crud"),
  endpoint: "/repairs",
  singular: "repair",
  plural: "repairs",
  columns: [
    { key: "customerId", label: "Customer", lookup: "customerId" },
    { key: "storeId", label: "Store", lookup: "storeId" },
    { key: "description", label: "What needs mending" },
    { key: "status", label: "Status" },
  ],
  fields: [
    { name: "customerId", label: "Customer", type: "select", required: true, optionsFrom: { endpoint: "/customers", label: (customer) => customer.fullName } },
    { name: "storeId", label: "Store", type: "select", required: true, optionsFrom: { endpoint: "/stores", label: (store) => store.name } },
    { name: "description", label: "What needs mending", type: "text", required: true, maxLength: 200 },
    { name: "status", label: "Status", type: "select", options: REPAIR_STATUSES, required: true },
  ],
});
