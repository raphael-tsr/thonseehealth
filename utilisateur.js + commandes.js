// <!-- utilisateur.js + commandes.js -->

function afficherNomUtilisateur() {
  const currentUser = localStorage.getItem('currentUser');
  const userNameDiv = document.getElementById('userName');
  if (userNameDiv) {
    userNameDiv.textContent = currentUser || "Non connecté";
  }
}

function afficherUtilisateur(username) {
  document.getElementById('userIcon').style.display = 'inline';
  const name = document.getElementById('userName');
  name.style.display = 'inline';
  name.textContent = username;
  document.getElementById('logoutBtn').style.display = 'inline';
}

function logout() {
  localStorage.removeItem('currentUser');
  document.getElementById('userIcon').style.display = 'none';
  document.getElementById('userName').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('accountsPopup').classList.add('hidden');
}

// Notification commandes utilisateur
async function majNotifCommandes() {
  const userName = localStorage.getItem("currentUser");
  const notifElem = document.getElementById("notifCommande");
  if (!userName || !notifElem) return;

  try {
    const res = await fetch("http://localhost:3000/api/commandes");
    if (!res.ok) throw new Error("Erreur API");

    const commandes = await res.json();
    const commandesUser = commandes.filter(cmd => cmd.utilisateur === userName);
    notifElem.textContent = commandesUser.length;
    notifElem.style.display = commandesUser.length > 0 ? "inline-block" : "none";
  } catch (err) {
    console.error("Erreur chargement commandes :", err.message);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  afficherNomUtilisateur();
  majNotifCommandes();
});

