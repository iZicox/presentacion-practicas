import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((req, res) => {
    const filePath = path.join(__dirname, "presentacion-practicas.html");

    fs.readFile(filePath, (err, content) => {
        if(err) {
            res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
            res.end("Error interno del servidor");
        } else {
            res.writeHead(200, {"Content-Type": "text/html"});
            res.end(content, "utf-8");
        }
    });
});

server.listen(3000, () => {
    console.log("servidor corriendo el localhost en el puerto 3000");
})
