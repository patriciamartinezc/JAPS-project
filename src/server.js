/*
  src/server.js - starts the server
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior

  Kept apart from app.js so later labs can test the app without opening
  a port. Run with: npm start
*/
const app = require("./app");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Tasks API running at http://localhost:${PORT}`);
});
