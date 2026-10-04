import express from "express";

const app = express(); // iniciar 

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


app.listen(3000); // puerto 
