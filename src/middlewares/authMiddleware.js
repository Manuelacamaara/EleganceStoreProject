import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Segurança Nível 1: Exige que esteja logado
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      // AQUI ESTAVA O BUG: Agora ele usa a senha forte do cofre!
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token inválido ou expirado' });
    }
  } else {
    res.status(401).json({ message: 'Sem token de acesso' });
  }
};

// Segurança Nível 2: Exige que seja Admin
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(401).json({ message: 'Acesso negado: Requer privilégios de administrador' });
  }
};