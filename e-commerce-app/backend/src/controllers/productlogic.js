const Product = require('../models/Product');

const getProducts = async (req, res, next) => {
  try {
    //seach+filter
    const { search, category } = req.query;
    let query = {};
    if (search)
    {
        //mashy da hy5leny 23ml search we y3ml ignore case
      query.name = { $regex: search, $options: 'i' };
    }
    //filter with category
    if (category)
    {
      query.category = category;

    }

    const products = await Product.find(query).populate('category', 'name');

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
     const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ message: 'Name and price are required' });
    }
    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category,
      stock: req.body.stock,
      material: req.body.material
    });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (req.body.name) product.name = req.body.name;
    if (req.body.description) product.description = req.body.description;
    if (req.body.price) product.price = req.body.price;
    if (req.body.image) product.image = req.body.image;
    if (req.body.category) product.category = req.body.category;
    if (req.body.stock) product.stock = req.body.stock;
    if (req.body.material) product.material = req.body.material;
    
    const updated = await product.save();
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };