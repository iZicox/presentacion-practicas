import express from "express";
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

// verificar que la conexion funciona
conn.connect((err) => {
  if (err) {
    console.error('error al conectarse a al base de datos: ', err.message);
    return;
  }
  console.log('conexion exitosa a la base de datos');
})

// middlewares
// este es para entender cuando le envias un json por post
app.use(express.json());
// puedes crear uno para registrar cada peticion que llegue
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} a la ruta ${req.url}`);
  next();
});
// y otro para validar campos obligatorios
const validarCamposProducto = (req, res, next) => {
  const { nombre, precio } = req.body;

  if (!nombre || precio === undefined) {
    return res.status(400).json({
      error: 'Middleware de Validación: El "nombre" y el "precio" son obligatorios.'
    });
  }

  next();
};

// consultar en la base de datos
// select all
app.get('/productos', (req, res) => {
  const query = 'select * from productos';
  conn.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: 'error al conectarse a la base de datos'
      })
    }
    res.json(result);
  })
});

// consulta producto por el id
app.get('/productos/:id', (req, res) => {
  const productoId = req.params.id;
  const query = 'select * from productos where id = ?';
  conn.query(query, [productoId], (err, result) => {
    if (err) {
      return res.status(500).json({
        error: 'error con el servidor'
      })
    }

    if (result.length === 0) {
      return res.status(404).json({
        error: 'producto no encontrado con id ' + productoId
      });
    }

    res.json(result[0]);

  });
});

// post para crear el producto
app.post('/productos', validarCamposProducto, (req, res) => {

  const { codigo_barras, nombre, descripcion, precio, stock, categoria, activo } = req.body;

  const query = `
        INSERT INTO productos (codigo_barras, nombre, descripcion, precio, stock, categoria, activo) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    codigo_barras || null,
    nombre,
    descripcion || null,
    precio,
    stock !== undefined ? stock : 0,
    activo !== undefined ? activo : true
  ];

  conn.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al guardar en la base de datos' });
    }

    res.status(201).json({
      mensaje: 'Producto creado exitosamente',
      id_generado: result.insertId
    });
  })

})

app.listen(3000); // puerto 
