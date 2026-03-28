document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  // Lógica de Sair
  document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '/index.html';
  });

  const ordersList = document.getElementById('ordersList');

  try {
    const response = await fetch('/api/orders/myorders', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const orders = await response.json();

    if (!response.ok) {
      ordersList.innerHTML = `<p style="color:red;">Erro: ${orders.message}</p>`;
      return;
    }

    if (orders.length === 0) {
      ordersList.innerHTML = '<p style="text-align:center; color:#666;">Você ainda não fez nenhuma compra.</p>';
      return;
    }

    ordersList.innerHTML = ''; // Limpa o "Carregando..."

    orders.forEach(order => {
      const dataPedido = new Date(order.createdAt).toLocaleDateString('pt-BR');
      
      let itensHtml = '';
      order.items.forEach(item => {
        itensHtml += `<li><span>${item.qty}x ${item.name}</span> <span>R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</span></li>`;
      });

      const div = document.createElement('div');
      div.className = 'order-card';
      div.innerHTML = `
        <div class="order-header">
          <span><strong>Pedido #${order._id.substring(0, 8).toUpperCase()}</strong> - ${dataPedido}</span>
          <span class="order-status">${order.status || 'Pendente'}</span>
        </div>
        <ul class="order-items">
          ${itensHtml}
        </ul>
        <div class="order-total">
          Total: R$ ${order.totalAmount.toFixed(2).replace('.', ',')}
        </div>
      `;
      ordersList.appendChild(div);
    });

  } catch (error) {
    ordersList.innerHTML = '<p style="color:red;">Erro ao conectar ao servidor.</p>';
  }
});