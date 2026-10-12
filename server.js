
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

// Import des routes
const patientRoutes = require("./routes/patientRoutes");
const consultationRoutes = require("./routes/consultationRoutes");

// Middlewares
app.use(cors());
app.use(express.json());

// Route de santé
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes API
app.use("/api/patients", patientRoutes);
app.use("/api/consultations", consultationRoutes);

// Route inconnue : 404
app.use((req, res) => {
  res.status(404).json({
    message: "Route introuvable",
    path: req.originalUrl,
    method: req.method
  });
});

// Gestionnaire global d'erreurs
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      message: "JSON invalide"
    });
  }

  console.error(err);

  res.status(500).json({
    message: "Erreur serveur"
  });
});

// Connexion MongoDB et démarrage
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connectée !");
    console.log("Base utilisée :", mongoose.connection.name);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Erreur MongoDB :", err.message);
    process.exit(1);
  });
