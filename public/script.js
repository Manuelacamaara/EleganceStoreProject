document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  const userRole = localStorage.getItem('userRole');

  const userInfo = document.getElementById('userInfo');
  const loginLink = document.getElementById('loginLink');
  const logoutBtn = document.getElementById('logoutBtn');
  const navPedidos = document.getElementById('navPedidos');
  const cartCount = document.getElementById('cartCount');

  // ✅ Atualiza carrinho SEMPRE
  atualizarCarrinho();

  // ✅ USUÁRIO LOGADO
  if (userName) {
    if (userInfo) userInfo.innerText = `Olá, ${userName}`;
    if (loginLink) loginLink.style.display = 'none';
    if (logoutBtn) logoutBtn.classList.remove('hidden');

    // 🔥 MOSTRAR "MEUS PEDIDOS" SEMPRE
    if (navPedidos) navPedidos.style.display = 'inline-block';

    // 🔥 ADMIN
    if (userRole === 'admin') {
      const navMenu = document.querySelector('.menu-navegacao');
      if (navMenu && !document.getElementById('navAdmin')) {
        const adminLink = document.createElement('a');
        adminLink.href = '/admin.html';
        adminLink.id = 'navAdmin';
        adminLink.innerText = 'Painel Admin';
        adminLink.style.color = '#d4a373';
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

  fetchProducts();
});

// 🔥 FUNÇÃO DO CARRINHO
function atualizarCarrinho() {
  const cartCount = document.getElementById('cartCount');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (cartCount) {
    cartCount.innerText = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
  }
}

// 🔥 LISTAR PRODUTOS
async function fetchProducts() {
  const res = await fetch('/api/products');
  const products = await res.json();

  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  products.forEach(product => {
    const isOut = product.stock === 0;

    const div = document.createElement('div');
    div.className = 'card-produto';

    div.innerHTML = `
      <img 
        src="${product.imageUrl}" 
        style="width:100%; height:220px; object-fit:cover; border-radius:8px;"
      >

      <h3>${product.name}</h3>

      <p class="preco">R$ ${product.price.toFixed(2)}</p>

      <p style="font-size: 0.9rem; color: ${isOut ? 'red' : 'green'};">
        ${isOut ? 'Esgotado' : 'Em estoque'}
      </p>

      <button 
        class="btn-add ${isOut ? 'disabled' : ''}" 
        onclick='adicionarAoCarrinho(${JSON.stringify(product)})'
        ${isOut ? 'disabled' : ''}
      >
        ${isOut ? 'Esgotado' : 'Adicionar ao Carrinho'}
      </button>
    `;

    productList.appendChild(div);
  });
}

// 🔥 ADICIONAR AO CARRINHO (ATUALIZA NA HORA)
window.adicionarAoCarrinho = function(product) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  const item = carrinho.find(p => p.id === product._id);

  if (item) {
    item.quantidade++;
  } else {
    carrinho.push({
      id: product._id,
      nome: product.name,
      preco: product.price,
      imagem: product.imageUrl,
      quantidade: 1
    });
  }

  localStorage.setItem('carrinho', JSON.stringify(carrinho));

  atualizarCarrinho(); // 🔥 ATUALIZA NA HORA

  alert(`${product.name} adicionado ao carrinho!`);
};