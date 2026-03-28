document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole'); // Pega o nível de acesso
  const isLogged = userName && userName !== 'undefined' && userName !== 'null';

  const userInfo = document.getElementById('userInfo');
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const navPedidos = document.getElementById('navPedidos');
  const cartCount = document.getElementById('cartCount');

  const atualizarContadorCarrinho = () => {
    const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    if (cartCount) cartCount.innerText = carrinho.length;
  };
  atualizarContadorCarrinho();

  if (isLogged) {
    if (userInfo) userInfo.innerText = `Olá, ${userName}`;
    if (loginLink) loginLink.style.display = 'none';
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    if (navPedidos) navPedidos.style.display = 'inline-block';

    // ✨ MÁGICA DO ADMIN: Injeta o link no menu se for você!
    if (userRole === 'admin') {
      const navMenu = document.querySelector('.menu-navegacao');
      if (navMenu && !document.getElementById('navAdmin')) {
        const adminLink = document.createElement('a');
        adminLink.href = '/admin.html';
        adminLink.id = 'navAdmin';
        adminLink.innerText = 'Painel Admin';
        adminLink.style.color = '#d4a373'; // Cor de destaque
        adminLink.style.fontWeight = 'bold';
        navMenu.appendChild(adminLink);
      }
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        localStorage.clear();
        window.location.href = '/index.html';
      });
    }
  }

  const productList = document.getElementById('product-list');
  if (productList) {
    fetchProducts();
  }
});

async function fetchProducts() {
  try {
    const response = await fetch('/api/products');
    const products = await response.json();
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';

    products.forEach(product => {
      const isOutOfStock = product.countInStock === 0;
      const productDiv = document.createElement('div');
      productDiv.className = 'card-produto';
      productDiv.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p class="preco">R$ ${product.price.toFixed(2).replace('.', ',')}</p>
        <button class="btn ${isOutOfStock ? 'disabled' : ''}" 
                onclick='adicionarAoCarrinho(${JSON.stringify(product)})' 
                ${isOutOfStock ? 'disabled' : ''}>
          ${isOutOfStock ? 'Esgotado' : 'Adicionar ao Carrinho'}
        </button>
      `;
      productList.appendChild(productDiv);
    });
  } catch (error) {
    console.error('Erro ao buscar produtos', error);
  }
}

window.adicionarAoCarrinho = function(product) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  const itemExistente = carrinho.find(item => item.id === product._id);

  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id: product._id, nome: product.name, preco: product.price, imagem: product.image, quantidade: 1 });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  alert(`${product.name} adicionado ao carrinho!`);
  
  const cartCount = document.getElementById('cartCount');
  if (cartCount) cartCount.innerText = carrinho.length;
};