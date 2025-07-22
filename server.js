const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

const commandesPath = path.join(__dirname, "api", "commandes.json");

// Utilitaire pour lire les commandes depuis le fichier
function lireCommandes() {
  try {
    const data = fs.readFileSync(commandesPath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    return []; // Si fichier vide ou inexistant
  }
}

// Utilitaire pour sauvegarder une commande dans le fichier
function enregistrerCommande(commande) {
  const commandes = lireCommandes();
  commandes.push(commande);
  fs.writeFileSync(commandesPath, JSON.stringify(commandes, null, 2));
}

// POST - recevoir une commande
app.post("/api/commandes", (req, res) => {
  const { utilisateur, panier } = req.body;

  if (!utilisateur || !Array.isArray(panier)) {
    return res.status(400).json({ error: "Commande invalide." });
  }

  const commande = {
    utilisateur,
    panier,
    date: new Date().toISOString(),
  };

  enregistrerCommande(commande);
  console.log("Nouvelle commande enregistrée :", commande);
  res.status(200).json({ success: true });
});

// GET - récupérer toutes les commandes
app.get("/api/commandes", (req, res) => {
  const commandes = lireCommandes();
  res.json(commandes);
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
