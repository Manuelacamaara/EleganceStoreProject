import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'O nome do produto é obrigatório'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A descrição é obrigatória']
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'O preço não pode ser negativo']
    },
    stock: {
      type: Number,
      required: [true, 'O estoque é obrigatório'],
      min: [0, 'O estoque não pode ser negativo']
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória'],
      trim: true
    },
    imageUrl: {
      type: String,
      default: '' // Se não enviar imagem, fica vazio
    }
  },
  {
    timestamps: true // Cria automaticamente as datas de 'createdAt' e 'updatedAt'
  }
);

export default mongoose.model('Product', productSchema);