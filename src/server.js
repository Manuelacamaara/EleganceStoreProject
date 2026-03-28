import app from './app.js';
import open from 'open';

const PORT = 5000;

app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;

  console.log('🚀 Servidor rodando!');
  console.log(`👉 ${url}`);

  await open(url);
});