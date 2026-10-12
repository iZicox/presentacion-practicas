import fs from "fs";

const DB_FILE = new URL("./db.json", import.meta.url); // ruta del archivo, sea cual sea el sitio desde el que arranques

// leer el archivo db.json y devolverlo como objeto
export const readUsers = () => {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // si el archivo no existe o está vacío, empezamos de cero
    return { users: [] };
  }
};

// guardar el objeto en db.json
export const writeUsers = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};
