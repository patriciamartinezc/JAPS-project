/*
  src/data/store.js - the data layer: a real SQLite database
  Web Application Programming (G247) · CUNEF Escuela Politécnica Superior
  Group: Jimena Gil - Ariadna Calzado - Sofía Rodríguez - Patricia Martínez

  Before, this file was one array per resource and the controllers pushed and
  spliced those arrays. Now every resource is a TABLE in a SQLite file
  (japs.db, created the first time the server starts). The controllers do not
  know that: they only call the five methods every table has,

      table.all()             -> every row, as an array
      table.find(id)          -> one row, or undefined
      table.insert(data)      -> inserts, the database picks the id, returns the new row
      table.replace(id, data) -> overwrites the row, returns it, or undefined if there is none
      table.remove(id)        -> true if a row was deleted, false if there was none

  so routes, controllers and validators did not change when the array was
  replaced by a database. That is the point of this file: it is the ONLY place
  that knows how the data is stored.

  The database is SQLite through "node:sqlite", the module that comes INSIDE
  Node 22 (no package to install). If it is not there (an older Node) or the
  file cannot be opened, the server does NOT crash: it falls back to
  in-memory arrays behind the same five methods, and says so in the terminal.
*/

const path = require("path");
const seed = require("./seed");

// The columns of every table (id is always there, so it is not listed).
// "text" -> TEXT, "number" -> REAL, "integer" -> INTEGER, "boolean" -> 0 or 1.
// Same fields as the validators, in the same order.
const SCHEMAS = {
  garments: { name: "text", category: "text", price: "number", material: "text", inStock: "boolean", image: "text" },
  stores: { name: "text", city: "text", address: "text", hours: "text", opensSunday: "boolean", image: "text" },
  looks: { title: "text", season: "text", description: "text", published: "boolean", image: "text" },
  customers: { fullName: "text", email: "text", city: "text", newsletter: "boolean" },
  orders: { customerId: "integer", status: "text", country: "text", total: "number" },
  orderItems: { orderId: "integer", garmentId: "integer", quantity: "integer", size: "text" },
  repairs: { customerId: "integer", storeId: "integer", description: "text", status: "text" },
  reviews: { garmentId: "integer", author: "text", rating: "integer", comment: "text" },
  fabrics: { name: "text", origin: "text", gsm: "integer", organic: "boolean" },
  workshops: { name: "text", city: "text", employees: "integer", familyRun: "boolean" },
};

// Where the database file lives. DB_FILE=:memory: gives a database that starts
// from the seed rows and is thrown away when the server stops (handy for tests).
const DB_FILE = process.env.DB_FILE || path.join(__dirname, "..", "..", "japs.db");

const SQL_TYPES = { text: "TEXT", number: "REAL", integer: "INTEGER", boolean: "INTEGER" };

// ---------------------------------------------------------------------------
// 1. SQLite version
// ---------------------------------------------------------------------------

function sqliteTable(db, name, columns) {
  const names = Object.keys(columns);
  const quoted = names.map((c) => `"${c}"`).join(", ");

  // IF NOT EXISTS: the table is only created the first time. AUTOINCREMENT
  // means the database gives each new row an id and never reuses an old one.
  const defs = names.map((c) => `"${c}" ${SQL_TYPES[columns[c]]}`);
  db.exec(`CREATE TABLE IF NOT EXISTS "${name}" (id INTEGER PRIMARY KEY AUTOINCREMENT, ${defs.join(", ")})`);

  // The "?" are placeholders: the values travel apart from the SQL text, so
  // whatever a client sends can never be read as SQL (no SQL injection).
  const marks = names.map(() => "?").join(", ");
  const selectAll = db.prepare(`SELECT * FROM "${name}" ORDER BY id`);
  const selectOne = db.prepare(`SELECT * FROM "${name}" WHERE id = ?`);
  const insertOne = db.prepare(`INSERT INTO "${name}" (${quoted}) VALUES (${marks})`);
  const updateOne = db.prepare(`UPDATE "${name}" SET ${names.map((c) => `"${c}" = ?`).join(", ")} WHERE id = ?`);
  const deleteOne = db.prepare(`DELETE FROM "${name}" WHERE id = ?`);

  // SQLite has no true/false, so a boolean is stored as 1 or 0 and turned
  // back into true/false when a row is read.
  const toValues = (data) => names.map((c) => (columns[c] === "boolean" ? (data[c] ? 1 : 0) : data[c]));
  const toRow = (record) => {
    const row = { id: record.id };
    for (const c of names) {
      row[c] = columns[c] === "boolean" ? record[c] === 1 : record[c];
    }
    return row;
  };

  // The first time (empty table) copy the starting rows from seed.js
  const count = db.prepare(`SELECT COUNT(*) AS n FROM "${name}"`).get().n;
  if (count === 0) {
    const insertSeed = db.prepare(`INSERT INTO "${name}" (id, ${quoted}) VALUES (?, ${marks})`);
    db.exec("BEGIN");
    for (const row of seed[name]) {
      insertSeed.run(row.id, ...toValues(row));
    }
    db.exec("COMMIT");
  }

  // an id that is not a whole number can never match a row
  const valid = (id) => Number.isInteger(id);

  return {
    all: () => selectAll.all().map(toRow),
    find(id) {
      if (!valid(id)) return undefined;
      const record = selectOne.get(id);
      return record ? toRow(record) : undefined;
    },
    insert(data) {
      const result = insertOne.run(...toValues(data));
      return this.find(Number(result.lastInsertRowid));
    },
    replace(id, data) {
      if (!valid(id)) return undefined;
      const result = updateOne.run(...toValues(data), id);
      return result.changes === 0 ? undefined : this.find(id);
    },
    remove(id) {
      if (!valid(id)) return false;
      return deleteOne.run(id).changes > 0;
    },
  };
}

// ---------------------------------------------------------------------------
// 2. In-memory version (only used when SQLite is not available)
// ---------------------------------------------------------------------------

function memoryTable(name) {
  // a copy of the seed rows, so editing them never touches seed.js
  const rows = seed[name].map((row) => ({ ...row }));
  // Next id = one past the current maximum (1 when the table is empty)
  const nextId = () => (rows.length ? Math.max(...rows.map((r) => r.id)) + 1 : 1);

  return {
    all: () => rows.map((row) => ({ ...row })),
    find(id) {
      const row = rows.find((r) => r.id === id);
      return row ? { ...row } : undefined;
    },
    insert(data) {
      const row = { id: nextId(), ...data };
      rows.push(row);
      return { ...row };
    },
    replace(id, data) {
      const index = rows.findIndex((r) => r.id === id);
      if (index === -1) return undefined;
      rows[index] = { id, ...data };
      return { ...rows[index] };
    },
    remove(id) {
      const index = rows.findIndex((r) => r.id === id);
      if (index === -1) return false;
      rows.splice(index, 1);
      return true;
    },
  };
}

// ---------------------------------------------------------------------------
// 3. Choose one of the two and build every table
// ---------------------------------------------------------------------------

const tables = {};
let storeKind = "in-memory arrays";

try {
  const { DatabaseSync } = require("node:sqlite");
  const db = new DatabaseSync(DB_FILE);
  for (const [name, columns] of Object.entries(SCHEMAS)) {
    tables[name] = sqliteTable(db, name, columns);
  }
  storeKind = DB_FILE === ":memory:" ? "SQLite (in memory)" : `SQLite (${path.basename(DB_FILE)})`;
} catch (error) {
  console.warn(`SQLite is not available (${error.message.split("\n")[0]}). Using in-memory arrays: the data is lost when the server stops.`);
  for (const name of Object.keys(SCHEMAS)) {
    tables[name] = memoryTable(name);
  }
}

module.exports = { ...tables, storeKind };
