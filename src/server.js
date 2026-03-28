import app from './app.js';
import open from 'open';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../public')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  const url = `http://localhost:${PORT}`;

  console.log(`🚀 Servidor rodando na porta ${PORT}!`);

  if (!process.env.PORT) {
    try {
      console.log(`👉 ${url}`);
      await open(url);
    } catch (error) {
      console.log('Não foi possível abrir o navegador automaticamente.');
    }
  }
});