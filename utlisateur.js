// Fonction pour afficher / masquer la popup
function toggleRegisterPopup() {
  const popup = document.getElementById("registerPopup");
  popup.classList.toggle("hidden");
}

// Fonction pour enregistrer un utilisateur
function enregistrerUtilisateur() {
  const email = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  const messageElem = document.getElementById("registerMessage");

  if (!email || !password) {
    messageElem.textContent = "Veuillez remplir tous les champs.";
    messageElem.style.color = "red";
    return;
  }

  fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        messageElem.textContent = "✅ Compte créé avec succès.";
        messageElem.style.color = "green";

        localStorage.setItem("userName", email);

        setTimeout(() => {
          toggleRegisterPopup();
          location.reload();
        }, 1000);
      } else if (data.error) {
        messageElem.textContent = "❌ " + data.error;
        messageElem.style.color = "red";
      }
    })
    .catch(err => {
      console.error("Erreur:", err);
      messageElem.textContent = "❌ Erreur de communication avec le serveur.";
      messageElem.style.color = "red";
    });
}

// Écoute du formulaire
document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  enregistrerUtilisateur();
});
