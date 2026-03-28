document.addEventListener('DOMContentLoaded', () => {
  const userName = localStorage.getItem('userName');
  const token = localStorage.getItem('token');
  const isLogged = userName && userName !== 'undefined' && userName !== 'null';

  if (!isLogged) {
    window.location.href = '/login.html';
    return;
  }

  const userInfo = document.getElementById('userInfo');
  const logoutBtn = document.getElementById('logoutBtn');
  const navPedidos = document.getElementById('navPedidos');

  if (userInfo) {
    userInfo.innerText = `Olá, ${userName}`;
    userInfo.style.display = 'inline-block';
  }
  
  if (navPedidos) {
    navPedidos.style.display = 'inline-block';
  }

  if (logoutBtn) {
    logoutBtn.style.display = 'inline-block';
    logoutBtn.classList.remove('hidden');
    
    logoutBtn.addEventListener('click', () => {
      localStorage.clear();
      window.location.href = '/index.html'; 
    });
  }

  renderizarCarrinho();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
      const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
      if (carrinho.length === 0) return;

      const items = carrinho.map(item => ({
        product: item.id,
        name: item.nome,
        qty: item.quantidade,
        price: item.preco
      }));

      checkoutBtn.innerText = "Processando...";
      checkoutBtn.disabled = true;

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ items })
        });

        const data = await response.json();

        if (response.ok) {
          const numeroPedido = data._id ? data._id.substring(0, 6).toUpperCase() : '0001';
          alert(`Pedido #${numeroPedido} realizado com sucesso! 🎉`);
          localStorage.removeItem('carrinho');
          window.location.href = '/pedidos.html'; 
        } else {
          alert(`Erro: ${data.message}`);
          checkoutBtn.innerText = "Finalizar Compra";
          checkoutBtn.disabled = false;
        }
      } catch (error) {
        alert('Erro de conexão ao finalizar pedido.');
        checkoutBtn.innerText = "Finalizar Compra";
        checkoutBtn.disabled = false;
      }
    });
  }
});

function renderizarCarrinho() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  cartItemsContainer.innerHTML = ''; 

  if (carrinho.length === 0) {
    cartItemsContainer.innerHTML = `
      <div style="text-align:center; margin: 50px 0;">
        <p style="color:#666; font-size: 1.1rem; margin-bottom: 20px;">Seu carrinho está vazio.</p>
        <a href="/produtos.html" class="btn" style="text-decoration:none; padding: 10px 25px; border-radius: 5px;">Ir para Produtos</a>
      </div>
    `;
    cartTotalElement.innerText = '0,00';
    checkoutBtn.style.display = 'none'; 
    return;
  }

  let totalConta = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    totalConta += subtotal;

    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <div class="cart-info">
        <h4>${item.nome}</h4>
        <div class="qty-controls">
          <button class="btn-qty" onclick="alterarQuantidade(${index}, -1)">-</button>
          <span>${item.quantidade}</span>
          <button class="btn-qty" onclick="alterarQuantidade(${index}, 1)">+</button>
        </div>
        <p style="margin-top: 5px;">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
      </div>
      <div class="cart-price">
        <p><strong>R$ ${subtotal.toFixed(2).replace('.', ',')}</strong></p>
        <button class="btn-remove" onclick="removerItem(${index})">Remover</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  cartTotalElement.innerText = totalConta.toFixed(2).replace('.', ',');
  checkoutBtn.style.display = 'block'; 
}

// Função nova para somar e subtrair quantidades
window.alterarQuantidade = function(index, mudanca) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho[index]) {
    carrinho[index].quantidade += mudanca;
    
    // Garante que a quantidade nunca seja menor que 1
    if (carrinho[index].quantidade < 1) {
      carrinho[index].quantidade = 1;
    }
    
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    renderizarCarrinho(); // Renderiza de novo para atualizar o total automático
  }
};

window.removerItem = function(index) {
  let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  carrinho.splice(index, 1); 
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
  renderizarCarrinho();
};