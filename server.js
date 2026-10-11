
require("dotenv").config({ quiet: true });

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5050;

const MONGO_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/tp-node-mongo";

app.use(cors());
app.use(express.json());

// Route de santé
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes des patients
app.use("/api/patients", require("./routes/patientRoutes"));

// Route inconnue -> 404 en JSON
app.use((req, res) => {
  res.status(404).json({ message: "Route introuvable" });
});

// Gestionnaire global d'erreurs
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "JSON invalide" });
  }

  console.error(err);
  res.status(500).json({ message: "Erreur serveur" });
});

// Connexion MongoDB
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connectée !");
    console.log("Base utilisée :", mongoose.connection.name);
    console.log("Collection :", mongoose.model("Patient").collection.name);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  });
