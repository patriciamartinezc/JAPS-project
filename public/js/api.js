/*
  public/js/api.js - the ONE place the pages talk to the server
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Every page script calls apiRequest() instead of fetch() directly, so the
  URL prefix, the JSON headers and the error handling are written once.

  The paths are relative ("/api/garments"), with no "http://localhost:3000":
  the page was loaded from the same server, so the browser sends the request
  back there. That is why the site only works when it is opened through
  Express (http://localhost:3000), not by double-clicking the HTML file.
*/

// apiRequest("GET", "/garments")                -> the parsed JSON body
// apiRequest("POST", "/customers", { ... })     -> the created customer
// apiRequest("DELETE", "/customers/3")          -> null (204 has no body)
// fetch() does NOT throw on a 404 or a 500, so we check res.ok ourselves and
// THROW an Error carrying .status and .errors. Callers use try/catch and
// show the server's own messages.
async function apiRequest(method, path, body) {
  const options = { method, headers: {} };
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const res = await fetch("/api" + path, options);

  if (res.status === 204) return null;

  // .catch: an empty or non-JSON body becomes {} instead of crashing here
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // The API uses two error shapes:
    //   404 and 500 -> { error: "Garment not found" }
    //   400         -> { errors: [{ field, message }, ...] }
    const error = new Error(data.error || `Request failed with ${res.status}`);
    error.status = res.status;
    error.errors = data.errors || [];
    throw error;
  }
  return data;
}

// Shows a message in an element marked role="status" (screen readers read it
// out). kind is "info", "ok" or "error"; styles.css colours each one.
function showStatus(element, message, kind = "info") {
  element.textContent = message;
  element.className = `status status-${kind}`;
}

// The text to show when a request failed: the server's own messages for a
// 400, or the error message for anything else.
function errorText(error) {
  if (error.errors && error.errors.length > 0) {
    return error.errors.map((e) => e.message).join(". ");
  }
  return error.message;
}
