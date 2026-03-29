import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS       
  }
});

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// --- REGISTRO ---
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    // 1. Validação de segurança no BACKEND (Double Check)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).json({ message: 'A senha não atende aos requisitos de segurança.' });
    }

    // 2. Checa se usuário já existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'E-mail já cadastrado.' });

    // 3. Prepara os dados
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // 4. Tenta enviar o e-mail PRIMEIRO (ou garante o tratamento de erro)
    const baseUrl = process.env.BASE_URL;
    const url = `${baseUrl}/api/auth/verify/${verificationToken}`;

    try {
        await transporter.sendMail({
            from: `"Elegance Store" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Ative sua conta na Elegance Store',
            html: `
              <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                <h2 style="color: #5a3e49;">Olá, ${name}!</h2>
                <p>Falta apenas um passo para você começar a comprar na Elegance Store.</p>
                <p>Clique no botão abaixo para confirmar seu e-mail e ativar sua conta:</p>
                <a href="${url}" style="background: #5a3e49; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 15px; font-weight: bold;">Confirmar Minha Conta</a>
              </div>
            `
        });

        // 5. SÓ SALVA NO BANCO SE O E-MAIL FOR ENVIADO COM SUCESSO
        await User.create({
            name, email, password: hashedPassword, verificationToken
        });

        res.status(201).json({ message: 'Cadastro realizado! Verifique seu e-mail para ativar a conta.' });

    } catch (mailError) {
        console.error("Erro ao enviar e-mail:", mailError);
        return res.status(500).json({ message: 'Erro ao enviar e-mail de confirmação. Verifique se o e-mail é válido.' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
}

// --- VERIFICAÇÃO DE E-MAIL ---
export async function verifyEmail(req, res) {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('<h1 style="text-align: center; color: red;">Link inválido ou expirado.</h1>');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const baseUrl = process.env.BASE_URL;
    res.redirect(`${baseUrl}/login.html?verified=true`);
  } catch (error) {
    res.status(500).send('<h1>Erro na verificação.</h1>');
  }
}

// --- LOGIN ---
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Por favor, confirme seu e-mail antes de entrar!' });
      }

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