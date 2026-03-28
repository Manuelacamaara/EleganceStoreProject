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
      required: true,
      default: 'Peça exclusiva Elegance Store'
    },
    price: {
      type: Number,
      required: [true, 'O preço é obrigatório'],
      min: [0, 'O preço não pode ser negativo']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'O estoque não pode ser negativo']
    },
    category: {
      type: String,
      required: true,
      default: 'Roupas'
    },
    imageUrl: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('Product', productSchema);