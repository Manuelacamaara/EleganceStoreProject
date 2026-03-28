import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'client' },
  isVerified: { type: Boolean, default: false }, // Controle de confirmação
  verificationToken: { type: String } // O código único enviado por e-mail
}, { timestamps: true });

export default mongoose.model('User', userSchema);