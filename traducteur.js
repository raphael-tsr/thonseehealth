// fichier: emailCommande.js

const readline = require('readline');

function genererEmailTexte(commande) {
  const utilisateur = commande.utilisateur || "client";
  const panier = commande.panier || [];
  const date = commande.date ? new Date(commande.date).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) : 'une date inconnue';

  let total = 0;
  let lignesProduits = '';

  panier.forEach(item => {
    const sousTotal = (item.prix || 0) * (item.quantite || 0);
    total += sousTotal;
    lignesProduits += `- ${item.nom || "Produit inconnu"} : ${item.quantite || 0} x ${item.prix ? item.prix.toFixed(2) : "0.00"} € = ${sousTotal.toFixed(2)} €\n`;
  });

  return `
Bonjour,

Merci pour votre commande passée le ${date}.

Voici le récapitulatif de votre panier :
${lignesProduits}
Total : ${total.toFixed(2)} €

Nous vous remercions pour votre confiance et restons à votre disposition pour toute question.

Cordialement,
L'équipe Thonsee Health
`.trim();
}

// Interface pour lire l'input JSON depuis le terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("Collez votre message JSON (commande) puis appuyez sur Entrée :");

let input = '';

rl.on('line', (line) => {
  input += line;
  try {
    const commande = JSON.parse(input);
    const emailTexte = genererEmailTexte(commande);
    console.log("\n--- Email généré ---\n");
    console.log(emailTexte);
    rl.close();
  } catch (e) {
    // Si JSON pas complet, continue la lecture
    // Sinon erreur de parsing affichée ci-dessous
    if (!input.trim().endsWith('}')) {
      // Probablement pas encore fini, on attend la suite
      return;
    }
    console.error("Erreur : JSON invalide. Merci de vérifier la syntaxe.");
    rl.close();
  }
});
