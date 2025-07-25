// 🔐 Liste des emails admin
const admins = ["athonseehealth@gmail.com"];

// Ouvrir / fermer les popups connexion / inscription
window.toggleLoginPopup = function () {
  const popup = document.getElementById("loginPopup");
  popup.classList.toggle("hidden");
  clearLoginMessage();
};

window.toggleRegisterPopup = function () {
  const popup = document.getElementById("registerPopup");
  popup.classList.toggle("hidden");
  clearRegisterMessage();
};

// Messages
function clearLoginMessage() {
  const msg = document.getElementById("loginMessage");
  msg.textContent = "";
  msg.style.color = "";
}

function clearRegisterMessage() {
  const msg = document.getElementById("registerMessage");
  msg.textContent = "";
  msg.style.color = "";
}

// Validation simple email
function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

// 🎯 Afficher email connecté (si présent)
document.addEventListener("DOMContentLoaded", () => {
  const span = document.getElementById("utilisateurConnecte");
  const currentUser = JSON.parse(localStorage.getItem("connectedUser"));
  if (span && currentUser && currentUser.email) {
    span.textContent = currentUser.email;
  }
});

// ✅ GESTION INSCRIPTION UNIQUE
const registerForm = document.getElementById("registerForm");
if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("registerUsername").value.trim();
    const password = document.getElementById("registerPassword").value;
    const message = document.getElementById("registerMessage");

    // Validation
    if (!isValidEmail(email)) {
      message.textContent = "Email invalide.";
      message.style.color = "red";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Le mot de passe doit faire au moins 6 caractères.";
      message.style.color = "red";
      return;
    }

    let comptes = JSON.parse(localStorage.getItem("accounts")) || {};



    // Enregistre dans le localStorage
    comptes[email] = { password: password };
    localStorage.setItem("accounts", JSON.stringify(comptes));

    // Vérifie si c'est un admin
    const isAdmin = admins.includes(email);
    localStorage.setItem("connectedUser", JSON.stringify({ email, isAdmin }));

    // 🔥 Envoie aussi au serveur
    fetch("http://localhost:3000/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        message.textContent = "Inscription réussie !";
        message.style.color = "green";
        registerForm.reset();

        setTimeout(() => {
          toggleRegisterPopup();
          clearRegisterMessage();
          location.reload();
        }, 500);
      } else {
        message.textContent = "Erreur serveur : " + data.error;
        message.style.color = "red";
      }
    })
    .catch(err => {
      message.textContent = "Erreur de communication avec le serveur.";
      message.style.color = "red";
      console.error(err);
    });
  });
}

// ✅ GESTION CONNEXION
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const message = document.getElementById("loginMessage");

    if (!isValidEmail(email)) {
      message.textContent = "Email invalide.";
      message.style.color = "red";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Mot de passe invalide.";
      message.style.color = "red";
      return;
    }

    let comptes = JSON.parse(localStorage.getItem("accounts")) || {};

    if (!comptes[email]) {
      message.textContent = "Compte non trouvé.";
      message.style.color = "red";
      return;
    }

    if (comptes[email].password !== password) {
      message.textContent = "Mot de passe incorrect.";
      message.style.color = "red";
      return;
    }

    // Connexion réussie
    const isAdmin = admins.includes(email);
    localStorage.setItem("connectedUser", JSON.stringify({ email, isAdmin }));
    loginForm.reset();

    setTimeout(() => {
      toggleLoginPopup();
      clearLoginMessage();
      location.reload();
    }, 500);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const span = document.getElementById("utilisateurConnecte");
  const currentUser = JSON.parse(localStorage.getItem("connectedUser"));

  if (span && currentUser?.email) {
    span.textContent = currentUser.email;
  }

  // ✅ Affiche les éléments admin si c'est un admin
  const isAdmin = currentUser?.isAdmin;
  const adminElements = document.querySelectorAll(".admin-only");

  adminElements.forEach(el => {
    if (isAdmin) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
});







