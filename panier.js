// <!-- panier.js -->

function ajouterAuPanier(button) {
  const produitDiv = button.closest('.produit');
  const nom = produitDiv.getAttribute('data-nom');
  const prix = parseFloat(produitDiv.getAttribute('data-prix'));
  const imgElem = produitDiv.querySelector('img');
  const imageUrl = imgElem ? imgElem.src : '';

  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    alert("Vous devez être connecté pour ajouter au panier.");
    return;
  }

  let panier = JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
  const produitExistant = panier.find(item => item.nom === nom);

  if (produitExistant) {
    produitExistant.quantite++;
  } else {
    panier.push({ nom, prix, quantite: 1, imageUrl });
  }

  localStorage.setItem(`cart_${currentUser}`, JSON.stringify(panier));
  updateCartCount();
  alert(`${nom} a été ajouté au panier !`);
}

function getCart() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return [];
  return JSON.parse(localStorage.getItem(`cart_${currentUser}`)) || [];
}

function updateCartCount() {
  const cart = getCart();
  const totalQuantity = cart.reduce((sum, item) => sum + (item.quantite || 0), 0);
  const countElem = document.getElementById('cartCountNav');
  if (!countElem) return;

  if (totalQuantity > 0) {
    countElem.style.display = 'inline';
    countElem.textContent = totalQuantity;
  } else {
    countElem.style.display = 'none';
  }
}

window.addEventListener('DOMContentLoaded', updateCartCount);

