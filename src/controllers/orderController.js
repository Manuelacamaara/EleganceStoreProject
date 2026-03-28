import Order from '../models/Order.js';

// @desc    Criar novo pedido (Checkout)
export async function createOrder(req, res) {
  try {
    const { items } = req.body; 

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'O carrinho está vazio' });
    }

    const totalAmountCalculado = items.reduce((total, item) => {
        const precoSeguro = Number(item.price) || 0;
        const qtdSegura = Number(item.qty) || 1;
        return total + (precoSeguro * qtdSegura);
    }, 0);

    const order = await Order.create({
      user: req.user._id, 
      items: items,
      totalAmount: totalAmountCalculado
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Erro detalhado:", error);
    return res.status(500).json({ message: 'Erro ao gerar o pedido', error: error.message });
  }
}

// @desc    Pegar pedidos do usuário logado
// @route   GET /api/orders/myorders
export async function getMyOrders(req, res) {
  try {
    // Busca pedidos onde o 'user' é o ID do cliente logado, ordenado do mais novo pro mais antigo
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar histórico de pedidos.' });
  }
}