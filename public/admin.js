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
  const submitBtn = document.getElementById('submitBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const formTitle = document.getElementById('formTitle');

  // Carrega a lista ao abrir a tela
  carregarProdutos();

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('prodId').value;
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const image = document.getElementById('prodImage').value;
    const countInStock = document.getElementById('prodStock').value;

    const isEdit = id !== '';
    const url = isEdit ? `/api/products/${id}` : '/api/products';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, price, image, countInStock })
      });

      if (response.ok) {
        message.style.color = 'green';
        message.innerText = isEdit ? 'Produto atualizado!' : 'Produto adicionado!';
        resetarFormulario();
        carregarProdutos(); // Atualiza a tabela na hora
      } else {
        message.style.color = 'red';
        message.innerText = `Erro ao salvar produto.`;
      }
    } catch (error) {
      message.style.color = 'red';
      message.innerText = 'Erro ao conectar com o servidor.';
    }
  });

  // Botão Cancelar Edição
  cancelBtn.addEventListener('click', resetarFormulario);

  // --- FUNÇÕES AUXILIARES ---

  async function carregarProdutos() {
    const tbody = document.getElementById('adminProductList');
    tbody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    
    try {
      const response = await fetch('/api/products');
      const products = await response.json();
      tbody.innerHTML = '';

      products.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${p.name}</td>
          <td>R$ ${p.price.toFixed(2).replace('.', ',')}</td>
          <td>${p.countInStock}</td>
          <td>
            <button class="btn-small btn-edit" onclick='editarProduto(${JSON.stringify(p)})'>Editar</button>
            <button class="btn-small btn-delete" onclick='excluirProduto("${p._id}")'>Excluir</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      tbody.innerHTML = '<tr><td colspan="4" style="color:red;">Erro ao buscar produtos.</td></tr>';
    }
  }

  // Prepara o formulário para editar
  window.editarProduto = function(product) {
    document.getElementById('prodId').value = product._id;
    document.getElementById('prodName').value = product.name;
    document.getElementById('prodPrice').value = product.price;
    document.getElementById('prodImage').value = product.image;
    document.getElementById('prodStock').value = product.countInStock;

    formTitle.innerText = "Editar Produto";
    submitBtn.innerText = "Atualizar Produto";
    cancelBtn.style.display = "block";
  };

  // Envia requisição DELETE para o back-end
  window.excluirProduto = async function(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        carregarProdutos(); // Atualiza a lista
      } else {
        alert('Erro ao excluir produto.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    }
  };

  function resetarFormulario() {
    form.reset();
    document.getElementById('prodId').value = '';
    formTitle.innerText = "Cadastrar Novo Produto";
    submitBtn.innerText = "Salvar Produto";
    cancelBtn.style.display = "none";
  }
});