import express from "express";
import fs from 'fs';
import mysql from 'mysql2';

const app = express(); // iniciar express

// crear la conexion
const conn = mysql.createConnection({
  host: 'localhost',
  port: 3307,
  user: 'root',
  password: '',
  database: 'ejercicio_node'
});

const readData = () => {
  try{
    const data = fs.readFileSync('./db.json');
    return JSON.parse(data);
  }catch(error){
    console.log(error);
  }
};

const writeData = (data) => {
  try{
    fs.writeFileSync('./db.json', JSON.stringify(data));    
  }catch(error){
    console.log(data);
  }
}

app.get('/', async (req, res) => {
  try {
    const respuesta = await fetch('https://dummyjson.com/products');

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({ 
        error: `Error en la petición: ${respuesta.status}` 
      });
    }

    const datos = await respuesta.json();

    // Enviamos los datos directamente a la respuesta
    res.json(datos);

  } catch (error) {
    console.error("Ocurrió un error:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// consultar en la base de datos
app.get('/productos', (req, res) => {
  const query = 'select * from productos';
  conn.query(query, (err, result) => {
    if(err){
      return res.status(500).json({
        error: 'error al conectarse a la base de datos'
      })
    }
   res.json(result);
  })
});

app.get('/alimentos', (req, res) => {
  res.json(readData());
});

app.post('/alimentos', (req, res) => {
  const baseDeDatos = readData();

  const body = req.body;

  const nuevoItem = {
    id: baseDeDatos.items.length + 1,
    ...body
  };

  baseDeDatos.items.push(nuevoItem);

  writeData(baseDeDatos);

  res.json(nuevoItem);
});


app.listen(3000); // puerto 
