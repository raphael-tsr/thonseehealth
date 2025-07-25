// emailCommandeInteractif.js
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'Collez votre JSON (CTRL+D pour quitter) > '
});

let inputBuffer = '';

console.log('Collez votre JSON ligne par ligne. Quand le JSON est complet, le mail sera généré automatiquement.');
rl.prompt();

rl.on('line', (line) => {
  inputBuffer += line + '\n';
  try {
    const commande = JSON.parse(inputBuffer);
    // JSON valide, on génère l'email
    const emailTexte = genererEmailTexte(commande);
    console.log('\n--- Email généré ---\n');
    console.log(emailTexte);
    console.log('\n--- Vous pouvez coller une nouvelle commande ---\n');
    inputBuffer = '';  // reset pour la prochaine saisie
  } catch (e) {
    // JSON pas encore valide (probablement incomplet), on attend la suite
  }
  rl.prompt();
});

rl.on('close', () => {
  console.log('\nFin du programme. Au revoir !');
  process.exit(0);
});
