import Product from '../models/Product.js';

// LISTAR
export async function getProducts(req, res) {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
}

// CRIAR
export async function createProduct(req, res) {
  try {
    const { name, price, imageUrl, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      imageUrl,
      stock,
      category: 'Roupas',
      description: 'Peça exclusiva Elegance Store'
    });

    res.status(201).json(product);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
}

// ATUALIZAR
export async function updateProduct(req, res) {
  try {
    const { name, price, imageUrl, stock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    product.name = name ?? product.name;
    product.price = price ?? product.price;
    product.imageUrl = imageUrl ?? product.imageUrl;
    product.stock = stock ?? product.stock;

    const updated = await product.save();

    res.json(updated);

  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
}

// DELETAR
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json({ message: 'Produto removido com sucesso' });

  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
}