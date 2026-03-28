import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Relaciona o pedido com o usuário que comprou
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product' // Relaciona o item com o produto original
        },
        name: { type: String, required: true },
        qty: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    totalAmount: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      default: 'pendente' // Pode ser: pendente, pago, enviado, entregue
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);