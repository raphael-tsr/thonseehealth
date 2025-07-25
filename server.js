const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const usersFile = path.join(__dirname, "api", "users.json");

// 📌 Enregistrement d’un utilisateur
app.post("/api/users", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Champs requis." });
  }

  fs.readFile(usersFile, "utf8", (err, data) => {
    let users = {};
    if (!err && data) {
      try {
        users = JSON.parse(data);
      } catch (e) {
        return res.status(500).json({ error: "Erreur parsing JSON." });
      }
    }

    if (users[email]) {
      return res.json({ error: "Ce compte existe déjà." });
    }

    users[email] = { password };

    fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur écriture fichier." });
      }
      res.json({ success: true });
    });
  });
});

// --- Commandes ---
const commandesFile = path.join(__dirname, "api", "commandes.json");

// Fonction pour lire commandes
function lireCommandes() {
  try {
    const data = fs.readFileSync(commandesFile, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Fonction pour enregistrer une commande
function enregistrerCommande(commande) {
  const commandes = lireCommandes();
  commandes.push(commande);
  fs.writeFileSync(commandesFile, JSON.stringify(commandes, null, 2));
}

// POST pour enregistrer une commande
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

// GET pour récupérer les commandes
app.get("/api/commandes", (req, res) => {
  const commandes = lireCommandes();
  res.json(commandes);
});



// 🔥 AJOUT : sauvegarde du contenu modifiable par l'admin
const contenuFile = path.join(__dirname, "api", "contenu.json");

app.post("/api/update-content", (req, res) => {
  const { content } = req.body;

  if (!Array.isArray(content)) {
    return res.status(400).json({ error: "Format de contenu invalide." });
  }
  console.log("Contenu reçu :", content);


  fs.writeFile(contenuFile, JSON.stringify(content, null, 2), (err) => {
    if (err) {
      console.error("Erreur d'écriture du fichier contenu.json :", err);
      return res.status(500).json({ error: "Erreur serveur." });
    }

    res.sendStatus(200);
  });
});

// GET pour récupérer le contenu modifiable
app.get("/api/contenu", (req, res) => {
  const contenuFile = path.join(__dirname, "api", "contenu.json");

  fs.readFile(contenuFile, "utf8", (err, data) => {
    if (err) {
      console.error("Erreur lecture contenu.json :", err);
      return res.status(500).json({ error: "Impossible de lire le contenu." });
    }

    try {
      const contenu = JSON.parse(data);
      res.json(contenu);
    } catch (e) {
      res.status(500).json({ error: "Erreur parsing JSON." });
    }
  });
});




// Démarrage serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
