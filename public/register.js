const form = document.getElementById('registerForm');
const message = document.getElementById('registerMessage');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // --- REGRA DE SEGURANÇA DA SENHA ---
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    message.style.color = 'red';
    message.innerText = 'A senha deve ter pelo menos 6 caracteres, contendo 1 letra maiúscula e 1 número.';
    return;
  }

  try {
    const response = await fetch('/api/auth/register', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      message.style.color = 'red';
      message.innerText = data.message || 'Erro ao cadastrar';
      return;
    }

    message.style.color = 'green';
    message.innerText = 'Cadastro realizado! Verifique seu e-mail para ativar a conta.';
    
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 3000);

  } catch (error) {
    message.style.color = 'red';
    message.innerText = 'Erro de conexão com o servidor';
  }
});

// --- Lógica de Mostrar/Ocultar Senha ---
const togglePassword = document.getElementById('togglePassword');
const passwordInput = document.getElementById('password');
const eyeIcon = document.getElementById('eyeIcon');

if (togglePassword && passwordInput) {
  togglePassword.addEventListener('click', (e) => {
    e.preventDefault();
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    
    if (isPassword) {
      eyeIcon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle>';
    } else {
      eyeIcon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line>';
    }
  });
}