/*
  src/server.js - starts the server
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Kept apart from app.js so tests can import the app without opening a
  port. Run with: npm start
*/
const app = require("./app");
const { storeKind } = require("./data/store");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`JAPS running at http://localhost:${PORT}`);
  console.log(`Data stored in: ${storeKind}`);
});
