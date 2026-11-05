/*
  public/js/crud.js - list + create + edit + delete for ONE resource
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Every resource page does the same five things the Riverside tickets page
  does by hand:
    1. GET the list and draw one element per item (createElement + textContent,
       then replaceChildren),
    2. show a loading, an error and an empty state,
    3. a form that POSTs (create) or PUTs (edit) the values,
    4. a check in the browser first, then the server's own 400 messages shown
       next to the right field,
    5. a Delete button that sends DELETE.
  Instead of copying that code into ten page scripts, setupCrud() holds it
  once and each page script only describes ITS resource (fields and columns).

  Needs api.js loaded first (apiRequest, showStatus, errorText) and
  exercises.js (validateEmail, the Lab 3 / Session 8 validator).
*/

// config = {
//   root:      the empty <div> of the page that gets filled,
//   endpoint:  "/customers",
//   singular, plural:  "customer", "customers" (for the messages),
//   fields:    [{ name, label, type, ... }]  what the form asks for,
//   columns:   [{ key, label, ... }]         what the table shows,
//   cards:     true to draw cards instead of a table,
//   renderCard(item): the card for one item (when cards is true),
//   filters, query: a <form> of filters and a function that returns the
//                   query string for them (used by the garments page),
//   onChange:  called after a create, edit or delete succeeded,
// }
//
// A field is { name, label, type, required, maxLength, min, max, integer }:
//   type "text" | "email" | "number" | "checkbox" | "select"
//   a select takes either options: ["a", "b"]  (a fixed list)
//   or optionsFrom: { endpoint, label(item) }  (ids of another resource, from the API)
function setupCrud(config) {
  const root = config.root;
  let editingId = null;     // null = the form creates, a number = it edits that id
  const labels = {};        // labels[fieldName] = Map(id -> text), for optionsFrom fields

  // ---------- 1. Build the pieces ----------

  const listStatus = document.createElement("p");
  listStatus.setAttribute("role", "status");

  const list = document.createElement("div");
  let tbody = null;
  if (config.cards) {
    list.className = "card-grid";
  } else {
    list.className = "table-wrap";
    const table = document.createElement("table");
    table.className = "data-table";
    const caption = document.createElement("caption");
    caption.textContent = `All ${config.plural}, with what each one holds.`;
    const headRow = document.createElement("tr");
    for (const column of [...config.columns, { label: "Actions" }]) {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = column.label;
      headRow.append(th);
    }
    const thead = document.createElement("thead");
    thead.append(headRow);
    tbody = document.createElement("tbody");
    table.append(caption, thead, tbody);
    list.append(table);
  }

  const form = document.createElement("form");
  form.className = "crud-form";
  form.noValidate = true; // the checks are ours, so they look the same everywhere
  const formTitle = document.createElement("h3");
  form.append(formTitle);
  for (const field of config.fields) {
    form.append(buildField(field));
  }
  const formStatus = document.createElement("p");
  formStatus.setAttribute("role", "status");
  const submitButton = document.createElement("button");
  submitButton.type = "submit";
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.className = "button-secondary";
  cancelButton.textContent = "Cancel";
  const buttons = document.createElement("p");
  buttons.className = "row-actions";
  buttons.append(submitButton, cancelButton);
  form.append(formStatus, buttons);

  root.replaceChildren(listStatus, list, form);
  resetForm();

  // ---------- 2. The form ----------

  function buildField(field) {
    const id = `${config.endpoint.slice(1)}-${field.name}`;
    const wrapper = document.createElement("p");

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = field.label;

    let control;
    if (field.type === "select") {
      control = document.createElement("select");
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Choose...";
      control.append(placeholder);
      for (const value of field.options || []) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        control.append(option);
      }
    } else {
      control = document.createElement("input");
      control.type = field.type;
      if (field.maxLength) control.maxLength = field.maxLength;
      if (field.type === "number") {
        if (field.min !== undefined) control.min = field.min;
        if (field.max !== undefined) control.max = field.max;
        if (!field.integer) control.step = "any";
      }
    }
    control.id = id;
    control.name = field.name;

    const error = document.createElement("span");
    error.className = "field-error";
    error.dataset.errorFor = field.name;

    // The checkbox row is "label, box" on one line (styles.css); every other
    // field is "label above, control, error below".
    wrapper.append(label, control, error);
    return wrapper;
  }

  function clearFieldErrors() {
    for (const slot of form.querySelectorAll("[data-error-for]")) {
      slot.textContent = "";
    }
    for (const control of form.querySelectorAll("[aria-invalid]")) {
      control.removeAttribute("aria-invalid");
    }
  }

  // errors is the API's own shape: [{ field: "email", message: "..." }]
  function showFieldErrors(errors) {
    for (const { field, message } of errors) {
      const slot = form.querySelector(`[data-error-for="${field}"]`);
      if (slot) slot.textContent = message;
      const control = form.elements[field];
      if (control) control.setAttribute("aria-invalid", "true");
    }
  }

  function resetForm() {
    editingId = null;
    form.reset();
    clearFieldErrors();
    formTitle.textContent = `Add a ${config.singular}`;
    submitButton.textContent = `Add ${config.singular}`;
    cancelButton.hidden = true;
  }

  // Reads the form into the body the API expects: numbers as numbers,
  // checkboxes as true/false, an empty optional field as "not sent".
  function readForm() {
    const body = {};
    for (const field of config.fields) {
      const control = form.elements[field.name];
      if (field.type === "checkbox") {
        body[field.name] = control.checked;
      } else if (field.type === "number" || (field.type === "select" && field.optionsFrom)) {
        // form values are always strings, but the API wants numbers
        body[field.name] = control.value === "" ? undefined : Number(control.value);
      } else {
        const text = control.value.trim();
        body[field.name] = text === "" && !field.required ? undefined : text;
      }
    }
    return body;
  }

  // The check in the browser: instant feedback, no round trip. The server
  // still validates everything, because anyone can skip the page and call the
  // API with Postman or curl.
  function checkFields(body) {
    const errors = [];
    for (const field of config.fields) {
      if (field.type === "checkbox") continue;
      const value = body[field.name];

      if (value === undefined || value === "") {
        if (field.required) errors.push({ field: field.name, message: `${field.label} is required.` });
        continue;
      }
      if (field.type === "email" && !validateEmail(value)) {
        errors.push({ field: field.name, message: "Enter a valid email address." });
      }
      if (field.maxLength && String(value).length > field.maxLength) {
        errors.push({ field: field.name, message: `${field.label} must be at most ${field.maxLength} characters.` });
      }
      if (field.type === "number") {
        if (!Number.isFinite(value)) {
          errors.push({ field: field.name, message: `${field.label} must be a number.` });
        } else if (field.integer && !Number.isInteger(value)) {
          errors.push({ field: field.name, message: `${field.label} must be a whole number.` });
        } else if (value < field.min || value > field.max) {
          errors.push({ field: field.name, message: `${field.label} must be between ${field.min} and ${field.max}.` });
        }
      }
    }
    return errors;
  }

  // ---------- 3. Read: the options and the list ----------

  // Fills the selects that hold ids of ANOTHER resource (the customer of an
  // order, the garment of a review) from GET /api/<that resource>.
  async function loadOptions() {
    for (const field of config.fields) {
      if (!field.optionsFrom) continue;
      try {
        const items = await apiRequest("GET", field.optionsFrom.endpoint);
        const map = new Map();
        const control = form.elements[field.name];
        const options = items.map((item) => {
          const text = field.optionsFrom.label(item);
          map.set(item.id, text);
          const option = document.createElement("option");
          option.value = item.id;
          option.textContent = text;
          return option;
        });
        labels[field.name] = map;
        const current = control.value;
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = "Choose...";
        control.replaceChildren(placeholder, ...options);
        control.value = current;
      } catch (error) {
        showStatus(formStatus, `Could not load the list for ${field.label}: ${errorText(error)}`, "error");
      }
    }
  }

  // The text of one table cell
  function cellContent(column, item) {
    const value = item[column.key];
    if (column.image) {
      if (!value) return "-";
      const img = document.createElement("img");
      img.className = "thumb";
      img.src = value;
      img.alt = item[column.image];
      img.width = 64;
      img.height = 64;
      return img;
    }
    if (column.lookup) {
      const map = labels[column.lookup];
      return map && map.has(value) ? map.get(value) : `#${value}`;
    }
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (column.money) return `${value} €`;
    return String(value);
  }

  function actionButtons(item) {
    const edit = document.createElement("button");
    edit.type = "button";
    edit.className = "button-secondary";
    edit.textContent = "Edit";
    edit.setAttribute("aria-label", `Edit ${config.singular} ${item.id}`);
    edit.addEventListener("click", () => startEdit(item));

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button-secondary";
    remove.textContent = "Delete";
    remove.setAttribute("aria-label", `Delete ${config.singular} ${item.id}`);
    remove.addEventListener("click", () => removeItem(item));

    const wrapper = document.createElement("div");
    wrapper.className = "row-actions";
    wrapper.append(edit, remove);
    return wrapper;
  }

  function tableRow(item) {
    const row = document.createElement("tr");
    for (const column of config.columns) {
      const cell = document.createElement("td");
      cell.append(cellContent(column, item));
      row.append(cell);
    }
    const actions = document.createElement("td");
    actions.append(actionButtons(item));
    row.append(actions);
    return row;
  }

  function card(item) {
    const element = config.renderCard(item);
    element.append(actionButtons(item));
    return element;
  }

  async function loadList() {
    showStatus(listStatus, `Loading ${config.plural}...`);
    try {
      const query = config.query ? config.query() : "";
      const items = await apiRequest("GET", config.endpoint + query);

      if (config.cards) {
        list.replaceChildren(...items.map(card));
      } else {
        tbody.replaceChildren(...items.map(tableRow));
      }

      if (items.length === 0) {
        list.hidden = true;
        showStatus(listStatus, config.emptyMessage || `No ${config.plural} yet.`);
      } else {
        list.hidden = false;
        showStatus(listStatus, `${items.length} ${items.length === 1 ? config.singular : config.plural}.`);
      }
    } catch (error) {
      list.hidden = true;
      showStatus(listStatus, `Could not load the ${config.plural}: ${errorText(error)}. Is the server running (npm start)?`, "error");
    }
  }

  // ---------- 4. Create and edit: the form ----------

  form.addEventListener("submit", async (event) => {
    // Without this the browser would reload the page (the Lab 1 form behaviour)
    event.preventDefault();
    clearFieldErrors();

    const body = readForm();
    const problems = checkFields(body);
    if (problems.length > 0) {
      showFieldErrors(problems);
      showStatus(formStatus, "Please fix the highlighted fields.", "error");
      return;
    }

    try {
      let message;
      if (editingId === null) {
        const created = await apiRequest("POST", config.endpoint, body);
        message = `The ${config.singular} was added (#${created.id}).`;
      } else {
        await apiRequest("PUT", `${config.endpoint}/${editingId}`, body);
        message = `The ${config.singular} #${editingId} was saved.`;
      }
      resetForm();
      showStatus(formStatus, message, "ok");
      await loadList();
      if (config.onChange) config.onChange();
    } catch (error) {
      // A 400 from the server: show its messages next to the right fields
      showFieldErrors(error.errors || []);
      showStatus(formStatus, error.errors && error.errors.length ? "The server rejected the data." : error.message, "error");
    }
  });

  cancelButton.addEventListener("click", () => {
    resetForm();
    formStatus.textContent = "";
    formStatus.className = "";
  });

  // Edit: put the item in the form; the next submit sends PUT
  function startEdit(item) {
    resetForm();
    editingId = item.id;
    for (const field of config.fields) {
      const control = form.elements[field.name];
      if (field.type === "checkbox") {
        control.checked = item[field.name];
      } else {
        control.value = item[field.name] === undefined ? "" : item[field.name];
      }
    }
    formTitle.textContent = `Edit ${config.singular} #${item.id}`;
    submitButton.textContent = "Save changes";
    cancelButton.hidden = false;
    formStatus.textContent = "";
    formStatus.className = "";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.elements[config.fields[0].name].focus();
  }

  // ---------- 5. Delete ----------

  async function removeItem(item) {
    if (!window.confirm(`Delete ${config.singular} #${item.id}?`)) return;
    try {
      await apiRequest("DELETE", `${config.endpoint}/${item.id}`);
      if (editingId === item.id) resetForm();
      showStatus(formStatus, `The ${config.singular} #${item.id} was deleted.`, "ok");
      if (config.onChange) config.onChange();
    } catch (error) {
      showStatus(formStatus, `Could not delete ${config.singular} #${item.id}: ${error.message}`, "error");
    }
    await loadList();
  }

  // ---------- 6. Start: the id options first, because the table shows their names ----------

  if (config.filters) {
    // The search box refreshes as you type (after a short pause); the selects
    // refresh when they change. The filtering itself happens on the SERVER.
    let timer = null;
    config.filters.addEventListener("input", () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(loadList, 250);
    });
    config.filters.addEventListener("submit", (event) => {
      event.preventDefault();
      loadList();
    });
  }

  async function start() {
    await loadOptions();
    await loadList();
  }
  start();

  return { reload: loadList, reloadOptions: loadOptions };
}
