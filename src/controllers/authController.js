import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// --- REGISTRO (Simplificado, sem e-mail) ---
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    // 1. Validação de segurança no Backend
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'A senha não atende aos requisitos de segurança.' });
    }

    // 2. Checa duplicidade
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'E-mail já cadastrado.' });

    // 3. Prepara os dados e faz o hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. SALVA DIRETO NO MONGODB
    // Forçamos o isVerified como true para evitar problemas no login
    const user = await User.create({
        name, 
        email, 
        password: hashedPassword,
        isVerified: true 
    });

    res.status(201).json({ 
        message: 'Cadastro realizado com sucesso!',
        token: generateToken(user._id)
    });

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
}

// --- LOGIN (Sem trava de verificação) ---
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // A trava if (!user.isVerified) foi removida daqui!
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
}

// --- ROTA MANTIDA APENAS PARA NÃO QUEBRAR O routes.js ---
export async function verifyEmail(req, res) {
  res.status(200).json({ message: 'Sistema de verificação desativado.' });
}