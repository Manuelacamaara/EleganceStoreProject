import Product from '../models/Product.js';

// Busca todos os produtos
export async function getProducts(req, res) {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar produtos' });
  }
}

// Cria um novo produto (Admin)
export async function createProduct(req, res) {
  try {
    const { name, price, image, countInStock } = req.body;
    const product = await Product.create({
      name, price, image, countInStock, description: 'Peça exclusiva Elegance Store'
    });
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar produto' });
  }
}

// Atualiza um produto existente (Admin)
export async function updateProduct(req, res) {
  try {
    const { name, price, image, countInStock } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.price = price || product.price;
      product.image = image || product.image;
      product.countInStock = countInStock || product.countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar produto' });
  }
}

// Exclui um produto (Admin)
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: 'Produto removido com sucesso' });
    } else {
      res.status(404).json({ message: 'Produto não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erro ao deletar produto' });
  }
}