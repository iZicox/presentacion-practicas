import express from "express";
import cookieParser from "cookie-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { readUsers, writeUsers } from "./db.js";

dotenv.config(); // leer el archivo .env

// el secreto y el puerto solo viven en .env, nunca en el código
const { JWT_SECRET, PORT = 3000, NODE_ENV = "development" } = process.env;

if (!JWT_SECRET) {
  console.error("Falta JWT_SECRET. Copia .env.example a .env y rellénalo.");
  process.exit(1);
}

const app = express();

app.use(express.json()); // para poder leer el body en JSON
app.use(cookieParser()); // para poder leer las cookies

// opciones de la cookie: el token viaja aquí y el navegador no lo deja leer al JS
const cookieOptions = () => ({
  httpOnly: true, // el JavaScript de la página no puede leerla → anti XSS
  secure: NODE_ENV === "production", // en producción solo por HTTPS
  sameSite: "strict", // no se envía en peticiones de otros sitios → anti CSRF
  path: "/",
  maxAge: 60 * 60 * 1000, // 1 hora, lo mismo que dura el token
});

// crear el token y guardarlo en la cookie
const setTokenCookie = (res, user) => {
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, cookieOptions());
};

// middleware: solo deja pasar si la cookie es un token válido
const auth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "no has iniciado sesión" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET); // si falla, saltamos al catch
    next();
  } catch {
    res.status(401).json({ error: "token inválido o caducado" });
  }
};

// registro: crea el usuario y ya lo deja logueado
app.post("/register", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: "faltan username o password" });
  }

  const db = readUsers();

  if (db.users.some((u) => u.username === username)) {
    return res.status(409).json({ error: "ese usuario ya existe" });
  }

  const user = {
    id: db.users.length + 1,
    username,
    password: await bcrypt.hash(password, 10), // en db.json solo se guarda el hash
  };

  db.users.push(user);
  writeUsers(db);

  setTokenCookie(res, user);

  res.status(201).json({ message: "usuario creado" });
});

// login: comprueba la contraseña y entrega el token en la cookie
app.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: "faltan username o password" });
  }

  const db = readUsers();
  const user = db.users.find((u) => u.username === username);

  // mismo mensaje si no existe el usuario o si la contraseña falla:
  // así no se descubre qué usuarios hay registrados
  const ok = user && (await bcrypt.compare(password, user.password));

  if (!ok) {
    return res.status(401).json({ error: "credenciales incorrectas" });
  }

  setTokenCookie(res, user);

  res.json({ message: "sesión iniciada" });
});

// quién soy: solo funciona con la cookie válida
app.get("/me", auth, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

app.listen(PORT, "127.0.0.1", () => {
  console.log(`API escuchando en http://127.0.0.1:${PORT}`);
});
