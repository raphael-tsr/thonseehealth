// <!-- auth.js -->

const MAX_USERNAME_LENGTH = 30;
const MAX_PASSWORD_LENGTH = 12;

const registerForm = document.getElementById("registerForm");
const registerPopup = document.getElementById("registerPopup");
const registerMessage = document.getElementById("registerMessage");
const usernameInput = document.getElementById("registerUsername");
const passwordInput = document.getElementById("registerPassword");

const loginForm = document.getElementById("loginForm");
const loginPopup = document.getElementById("loginPopup");
const loginMessage = document.getElementById("loginMessage");

// Limitation de caractères inscription
if (usernameInput && passwordInput && registerMessage) {
  usernameInput.addEventListener('input', () => {
    if (usernameInput.value.length > MAX_USERNAME_LENGTH) {
      registerMessage.textContent = `Nom d'utilisateur trop long (max ${MAX_USERNAME_LENGTH})`;
      usernameInput.value = usernameInput.value.slice(0, MAX_USERNAME_LENGTH);
    } else {
      registerMessage.textContent = "";
    }
  });

  passwordInput.addEventListener('input', () => {
    if (passwordInput.value.length > MAX_PASSWORD_LENGTH) {
      registerMessage.textContent = `Mot de passe trop long (max ${MAX_PASSWORD_LENGTH})`;
      passwordInput.value = passwordInput.value.slice(0, MAX_PASSWORD_LENGTH);
    } else {
      registerMessage.textContent = "";
    }
  });
}

// Soumission inscription
registerForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  if (!username || !password) {
    registerMessage.textContent = "Veuillez remplir tous les champs.";
    registerMessage.style.color = "red";
    return;
  }

  let accounts = JSON.parse(localStorage.getItem("accounts")) || {};
  if (accounts[username]) {
    registerMessage.textContent = "Ce nom d'utilisateur est déjà pris.";
    registerMessage.style.color = "red";
    return;
  }

  accounts[username] = password;
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("currentUser", username);
  registerMessage.textContent = "Compte créé avec succès !";
  registerMessage.style.color = "lightgreen";

  fetch("http://localhost:3000/api/comptes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  }).then(res => res.json())
    .then(data => {
      if (data.success) console.log("Compte créé côté serveur.");
      else console.warn("Erreur serveur :", data.error);
    });

  setTimeout(() => {
    registerPopup.classList.add("hidden");
    registerForm.reset();
    registerMessage.textContent = "";
    location.reload();
  }, 1500);
});

// Connexion
loginForm.addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const accounts = JSON.parse(localStorage.getItem("accounts")) || {};

  if (accounts[username] && accounts[username] === password) {
    localStorage.setItem("currentUser", username);
    loginMessage.textContent = "Connexion réussie !";
    loginMessage.style.color = "lightgreen";
    setTimeout(() => {
      loginPopup.classList.add("hidden");
      loginForm.reset();
      loginMessage.textContent = "";
      location.reload();
    }, 500);
  } else {
    loginMessage.textContent = "Nom d'utilisateur ou mot de passe incorrect.";
    loginMessage.style.color = "red";
  }
});

