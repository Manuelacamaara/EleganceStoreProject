document.addEventListener('DOMContentLoaded', () => {
  const role = localStorage.getItem('userRole');
  const token = localStorage.getItem('token');

  if (role !== 'admin' || !token) {
    alert('Acesso negado. Apenas administradores.');
    window.location.href = '/index.html';
    return;
  }

  const form = document.getElementById('adminForm');
  const message = document.getElementById('adminMessage');

  carregarProdutos();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('prodId').value;

    const productData = {
      name: document.getElementById('prodName').value,
      price: Number(document.getElementById('prodPrice').value),
      imageUrl: document.getElementById('prodImage').value,
      stock: Number(document.getElementById('prodStock').value)
    };

    const isEdit = id !== '';
    const url = isEdit ? `/api/products/${id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        message.style.color = 'green';
        message.innerText = 'Produto salvo com sucesso!';
        form.reset();
        carregarProdutos();
      } else {
        message.style.color = 'red';
        message.innerText = 'Erro ao salvar produto';
      }

    } catch {
      message.innerText = 'Erro de conexão';
    }
  });

  async function carregarProdutos() {
    const tbody = document.getElementById('adminProductList');
    tbody.innerHTML = '';

    const res = await fetch('/api/products');
    const products = await res.json();

    products.forEach(p => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${p.name}</td>
        <td>R$ ${p.price.toFixed(2)}</td>
        <td>${p.stock}</td>
        <td>
          <button onclick='editarProduto(${JSON.stringify(p)})'>Editar</button>
          <button onclick='excluirProduto("${p._id}")'>Excluir</button>
        </td>
      `;

      tbody.appendChild(tr);
    });
  }

  window.editarProduto = (p) => {
    document.getElementById('prodId').value = p._id;
    document.getElementById('prodName').value = p.name;
    document.getElementById('prodPrice').value = p.price;
    document.getElementById('prodImage').value = p.imageUrl;
    document.getElementById('prodStock').value = p.stock;
  };

  window.excluirProduto = async (id) => {
    await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    carregarProdutos();
  };
});