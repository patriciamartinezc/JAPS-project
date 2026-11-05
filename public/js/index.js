/*
  public/js/index.js - the home page reads the API
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

    - the "New in" card comes from GET /api/garments?search=trench
    - "JAPS in numbers" comes from GET /api/garments/stats

  Both blocks have a loading, an error and an empty state.
*/

const newInCard = document.querySelector("#new-in-card");
const newInStatus = document.querySelector("#new-in-status");
const statsList = document.querySelector("#stats-list");
const statsCategories = document.querySelector("#stats-categories");
const statsStatus = document.querySelector("#stats-status");

async function loadNewIn() {
  showStatus(newInStatus, "Loading the new arrival...");
  try {
    const garments = await apiRequest("GET", "/garments?search=trench");
    if (garments.length === 0) {
      newInCard.replaceChildren();
      showStatus(newInStatus, "Nothing new this week.");
      return;
    }
    newInCard.replaceChildren(garmentCard(garments[0]));
    newInStatus.textContent = "";
    newInStatus.className = "";
  } catch (error) {
    showStatus(newInStatus, `Could not load the new arrival: ${errorText(error)}. Is the server running (npm start)?`, "error");
  }
}

// One <div><dt>label</dt><dd>value</dd></div> per number
function statItem(label, value) {
  const item = document.createElement("div");
  const term = document.createElement("dt");
  term.textContent = label;
  const detail = document.createElement("dd");
  detail.textContent = value;
  item.append(term, detail);
  return item;
}

async function loadStats() {
  showStatus(statsStatus, "Loading the numbers...");
  try {
    const stats = await apiRequest("GET", "/garments/stats");

    if (stats.total === 0) {
      statsList.hidden = true;
      statsCategories.replaceChildren();
      showStatus(statsStatus, "There are no garments yet, so there is nothing to count.");
      return;
    }

    statsList.replaceChildren(
      statItem("Garments", stats.total),
      statItem("In stock", stats.inStock),
      statItem("Average price", `${stats.averagePrice} €`),
    );
    statsList.hidden = false;

    const rows = Object.entries(stats.byCategory).map(([category, count]) => {
      const row = document.createElement("li");
      row.textContent = `${category}: ${count}`;
      return row;
    });
    statsCategories.replaceChildren(...rows);

    statsStatus.textContent = "";
    statsStatus.className = "";
  } catch (error) {
    statsList.hidden = true;
    showStatus(statsStatus, `Could not load the numbers: ${errorText(error)}. Is the server running (npm start)?`, "error");
  }
}

loadNewIn();
loadStats();
