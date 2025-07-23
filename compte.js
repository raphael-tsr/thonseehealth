function toggleLoginPopup() {
  document.getElementById('loginPopup').classList.toggle('hidden');
}

function toggleRegisterPopup() {
  document.getElementById('registerPopup').classList.toggle('hidden');
}

function afficherUtilisateur(username) {
  const icon = document.getElementById('userIcon');
  const name = document.getElementById('userName');
  const logoutBtn = document.getElementById('logoutBtn');
  icon.style.display = 'inline';
  name.style.display = 'inline';
  name.textContent = username;
  logoutBtn.style.display = 'inline';
}

function logout() {
  localStorage.removeItem('currentUser');
  document.getElementById('userIcon').style.display = 'none';
  document.getElementById('userName').style.display = 'none';
  document.getElementById('logoutBtn').style.display = 'none';
  document.getElementById('accountsPopup').classList.add('hidden');
}

// Charger la datalist usernames pour le formulaire login
function chargerHistoriqueComptes() {
  const datalist = document.getElementById('usernames');
  if (!datalist) return;
  datalist.innerHTML = '';

  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  Object.keys(accounts).forEach(username => {
    const option = document.createElement('option');
    option.value = username;
    datalist.appendChild(option);
  });
}

// Affiche la popup avec tous les comptes enregistrés, bouton supprimer ajouté
function afficherComptes() {
  console.log('afficherComptes appelé'); // Debug affichage liste

  const ul = document.getElementById('accountsList');
  ul.innerHTML = '';

  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  const currentUser = localStorage.getItem('currentUser');

  if (Object.keys(accounts).length === 0) {
    const li = document.createElement('li');
    li.textContent = "Aucun compte enregistré.";
    ul.appendChild(li);
    return;
  }

  Object.keys(accounts).forEach(username => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.justifyContent = 'space-between';
    li.style.alignItems = 'center';
    li.style.marginBottom = '6px';

    const nomSpan = document.createElement('span');
    nomSpan.textContent = username + (username === currentUser ? " (actuel)" : "");
    nomSpan.style.fontWeight = username === currentUser ? 'bold' : 'normal';
    nomSpan.style.cursor = 'pointer';
    nomSpan.onclick = () => {
      if (username === currentUser) {
        toggleAccountsPopup();
        return;
      }
      const mdp = prompt(`Entrez le mot de passe pour ${username} :`);
      if (!mdp) return;
      if (accounts[username] === mdp) {
        localStorage.setItem('currentUser', username);
        afficherUtilisateur(username);
        toggleAccountsPopup();
        alert(`Connecté en tant que ${username}`);
      } else {
        alert('Mot de passe incorrect.');
      }
    };

    const btnSupprimer = document.createElement('button');
    btnSupprimer.textContent = 'Supprimer';
    btnSupprimer.style.background = 'red';
    btnSupprimer.style.color = 'white';
    btnSupprimer.style.border = 'none';
    btnSupprimer.style.borderRadius = '4px';
    btnSupprimer.style.cursor = 'pointer';
    btnSupprimer.style.padding = '2px 6px';

    btnSupprimer.onclick = (e) => {
      e.stopPropagation(); // éviter que le clic active la connexion
      console.log('Suppression demandée pour', username); // Debug suppression

      if (confirm(`Supprimer définitivement le compte "${username}" ?`)) {
        supprimerCompte(username);
      }
    };

    li.appendChild(nomSpan);
    li.appendChild(btnSupprimer);
    ul.appendChild(li);
  });
}

// Supprime un compte et met à jour l'affichage et la session
function supprimerCompte(username) {
  console.log('supprimerCompte appelé pour', username); // Debug

  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  delete accounts[username];
  localStorage.setItem('accounts', JSON.stringify(accounts));
  console.log('Accounts après suppression:', accounts); // Debug

  const currentUser = localStorage.getItem('currentUser');
  if (currentUser === username) {
    logout();
  }

  afficherComptes();
}

// Connexion
document.getElementById('loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};

  if (accounts[username]) {
    if (accounts[username] === password) {
      localStorage.setItem('currentUser', username);
      afficherUtilisateur(username);
      document.getElementById('loginMessage').textContent = `Bienvenue ${username} !`;
      setTimeout(() => toggleLoginPopup(), 1000);
    } else {
      document.getElementById('loginMessage').textContent = "Mot de passe incorrect.";
    }
  } else {
    document.getElementById('loginMessage').textContent = "Compte inexistant.";
  }
  document.getElementById('loginForm').reset();
});

// Inscription
document.getElementById('registerForm').addEventListener('submit', e => {
  e.preventDefault();
  const username = document.getElementById('registerUsername').value.trim();
  const password = document.getElementById('registerPassword').value.trim();
  let accounts = JSON.parse(localStorage.getItem('accounts')) || {};

  if (accounts[username]) {
    document.getElementById('registerMessage').textContent = "Nom d'utilisateur déjà utilisé.";
  } else {
    accounts[username] = password;
    localStorage.setItem('accounts', JSON.stringify(accounts));
    localStorage.setItem('currentUser', username);
    afficherUtilisateur(username);
    document.getElementById('registerMessage').textContent = `Compte créé avec succès !`;
    setTimeout(() => toggleRegisterPopup(), 1000);
  }
  document.getElementById('registerForm').reset();
});

// Au chargement de la page, afficher utilisateur s'il est connecté
window.addEventListener('DOMContentLoaded', () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) afficherUtilisateur(currentUser);
});

// Ouvrir la liste des comptes au clic sur l'icône ou nom utilisateur
document.getElementById('userIcon').addEventListener('click', () => {
  toggleAccountsPopup();
});
document.getElementById('userName').addEventListener('click', () => {
  toggleAccountsPopup();
});

// Fonction pour préremplir le formulaire loginPopup et connecter directement si compte existant
function autoConnect(username) {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  if (accounts[username]) {
    // Préremplir les champs
    document.getElementById('loginUsername').value = username;
    document.getElementById('loginPassword').value = accounts[username]; // mot de passe sauvegardé en clair (attention !)
    // Lancer connexion automatiquement
    connecter(username, accounts[username]);
  }
}

// Fonction connexion (extrait du submit)
function connecter(username, password) {
  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  if (accounts[username]) {
    if (accounts[username] === password) {
      localStorage.setItem('currentUser', username);
      afficherUtilisateur(username);
      document.getElementById('loginMessage').textContent = `Bienvenue ${username} !`;
      setTimeout(() => toggleLoginPopup(), 1000);
    } else {
      document.getElementById('loginMessage').textContent = "Mot de passe incorrect.";
    }
  } else {
    document.getElementById('loginMessage').textContent = "Compte inexistant.";
  }
}

// Remplir la datalist avec les comptes existants
function chargerHistoriqueComptesLogin() {
  const datalist = document.getElementById('usernamesLogin');
  datalist.innerHTML = ''; // reset
  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  Object.keys(accounts).forEach(username => {
    const option = document.createElement('option');
    option.value = username;
    datalist.appendChild(option);
  });
}

// Quand on change le champ utilisateur dans loginPopup, si correspondance, auto-connect
document.getElementById('loginUsername').addEventListener('input', (e) => {
  const username = e.target.value.trim();
  const accounts = JSON.parse(localStorage.getItem('accounts')) || {};
  if (accounts[username]) {
    autoConnect(username);
  }
});

// Au chargement, remplir datalist
window.addEventListener('DOMContentLoaded', () => {
  chargerHistoriqueComptesLogin();
});

// --- Fermeture popup comptes si clic en dehors ---
window.addEventListener('click', function(event) {
  const popup = document.getElementById('accountsPopup');
  if (!popup.classList.contains('hidden')) {
    // Si clic en dehors de la popup ET pas sur userIcon/userName qui ouvrent la popup
    if (!popup.contains(event.target) && !event.target.matches('#userIcon, #userName')) {
      popup.classList.add('hidden');
    }
  }
});

// pop up user 
function updatePopupUserName() {
  const userName = document.getElement
}


// inscription fermeture de la pop up 

