const express = require("express");
const cors = require("cors");
require("dotenv").config();

const pool = require("./db");
const nodemailer = require("nodemailer");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error conectando a la DB" });
  }
});

app.post("/credits", async (req, res) => {
  try {
    const {
      client_name,
      client_id,
      credit_value,
      interest_rate,
      months,
      commercial,
    } = req.body;

    // Validación básica
    if (
      !client_name ||
      !client_id ||
      !credit_value ||
      !interest_rate ||
      !months ||
      !commercial
    ) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const newCredit = await pool.query(
      `INSERT INTO credits 
      (client_name, client_id, credit_value, interest_rate, months, commercial)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [client_name, client_id, credit_value, interest_rate, months, commercial]
    );

    setImmediate(async () => {
    try {
        await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: "melvinjimenez2708@gmail.com",
        subject: "Nuevo crédito registrado",
        text: `
            Cliente: ${client_name}
            Valor: ${credit_value}
            Comercial: ${commercial}
            Fecha: ${new Date().toLocaleString()}
        `,
        });

        console.log("Correo enviado correctamente");
    }   catch (err) {
            console.error("Error enviando correo:", err);
        }
    });

    res.status(201).json(newCredit.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar crédito" });
  }
});

app.get("/credits", async (req, res) => {
  try {
    const { name, client_id, commercial, orderBy } = req.query;

    let query = "SELECT * FROM credits WHERE 1=1";
    let values = [];
    let index = 1;

    if (name) {
      query += ` AND client_name ILIKE $${index++}`;
      values.push(`%${name}%`);
    }

    if (client_id) {
      query += ` AND client_id = $${index++}`;
      values.push(client_id);
    }

    if (commercial) {
      query += ` AND commercial ILIKE $${index++}`;
      values.push(`%${commercial}%`);
    }

    if (orderBy === "value") {
      query += " ORDER BY credit_value DESC";
    } else {
      query += " ORDER BY created_at DESC";
    }

    const result = await pool.query(query, values);
    res.json(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener créditos" });
  }
});

app.delete("/credits/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM credits WHERE id = $1", [id]);

    res.json({ message: "Crédito eliminado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar crédito" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT || 5000}`);
});