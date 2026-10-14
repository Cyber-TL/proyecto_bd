const express = require("express");
const cors = require("cors");
const conexion = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;
  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  conexion.query(sql, [nombre, precio, stock], (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }
    res.status(201).json({ mensaje: "Producto creado correctamente", id: resultado.insertId });
  });
});

app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;
  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  conexion.query(sql, [nombre, precio, stock, id], (error) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

app.delete("/productos/:id", (req, res) => {
  const sql = "DELETE FROM productos WHERE id = ?";
  conexion.query(sql, [req.params.id], (error) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

app.get("/contacto", (req, res) => {
  const sql = "SELECT * FROM contacto ORDER BY fecha DESC";
  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar mensajes:", error);
      return res.status(500).json({ mensaje: "Error al consultar los mensajes" });
    }
    res.json(resultados);
  });
});

app.post("/contacto", (req, res) => {
  const { nombre, correo, asunto, mensaje } = req.body;

  if (!nombre || !correo || !asunto || !mensaje) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO contacto (nombre, correo, asunto, mensaje) VALUES (?, ?, ?, ?)";
  conexion.query(sql, [nombre, correo, asunto, mensaje], (error, resultado) => {
    if (error) {
      console.error("Error al guardar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al guardar el mensaje" });
    }
    res.status(201).json({ mensaje: "Mensaje enviado correctamente", id: resultado.insertId });
  });
});

app.delete("/contacto/:id", (req, res) => {
  const sql = "DELETE FROM contacto WHERE id = ?";
  conexion.query(sql, [req.params.id], (error) => {
    if (error) {
      console.error("Error al eliminar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});