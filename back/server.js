import express from "express";
import cors from "cors";
import recordRoutes from "./routes/record.js"; // Ajout de la route
import mqtt from "mqtt";

const PORT = process.env.PORT || 5050;
const app = express();

const options = {
  host: "93f56c185fe04dd3b91a255ab6dfc566.s1.eu.hivemq.cloud",
  port: 8883,
  protocol: "mqtts",
  username: "Chicagolil",
  password: "Test1234",
};

app.use(cors());
app.use(express.json());
app.use("/api/records", recordRoutes);

let niveauxActuels = { croquettes: 0 }; // Stockage temporaire des données

// Configuration du client MQTT
const mqttClient = mqtt.connect(options); // Adresse du MQTT local

mqttClient.on("connect", () => {
  console.log("Connecté au broker MQTT");
  mqttClient.subscribe("smartpaws/niveau", (err) => {
    if (err) {
      console.error("Erreur d'abonnement au topic MQTT", err);
    }
  });
});

// Réception des messages publiés sur le topic
mqttClient.on("message", (topic, message) => {
  niveauxActuels = JSON.parse(message.toString());
  console.log("Nouveaux niveaux reçus :", niveauxActuels);
});

// API pour renvoyer les niveaux de croquette actuels
app.get("/api/niveau", (req, res) => {
  res.json(niveauxActuels);
});

// start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});