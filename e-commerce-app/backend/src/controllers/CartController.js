const Cart = require('../models/Cart');

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name price image');
    if (!cart) return res.status(200).json({ items: [] });
    res.status(200).json(cart);
  } catch (error) { next(error); }
};

const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'Product ID is required' });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [{ product: productId, quantity }] });
    } else {
      const existing = cart.items.find((i) => i.product.toString() === productId);
      if (existing) { existing.quantity += quantity; }
      else          { cart.items.push({ product: productId, quantity }); }
      await cart.save();
    }

    await cart.populate('items.product', 'name price image');
    res.status(200).json(cart);
  } catch (error) { next(error); }
};

const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    res.status(200).json({ message: 'Item removed', cart });
  } catch (error) { next(error); }
};

const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ message: 'Cart cleared' });
  } catch (error) { next(error); }
};

module.exports = { getCart, addToCart, removeFromCart, clearCart };