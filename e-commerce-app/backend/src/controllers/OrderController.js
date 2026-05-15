const Order = require('../models/Orders');
const Cart  = require('../models/Cart');
const Product = require('../models/Product'); // <-- ADD THIS: Import the Product model

const checkout = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product'); //populate 3ashan n access item.product.price w item.product._id 

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orderItems = cart.items.map((item) => ({
      product:  item.product._id,
      quantity: item.quantity,
      price:    item.product.price,
    }));  //n5aly items array -> order items

    let totalPrice = 0;

    for (let i = 0; i < orderItems.length; i++) {
     const item      = orderItems[i];
     const itemTotal = item.price * item.quantity;
     totalPrice      = totalPrice + itemTotal;
    } 

    const order = await Order.create({ user: req.user._id, items: orderItems, totalPrice, shippingAddress });
    await Cart.findOneAndDelete({ user: req.user._id }); //nemsah el user cart ba3d ma el order et3amal

    res.status(201).json(order); //resource created
  } 
  catch (error) { 
    next(error); 
    }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product', 'name image'); //find kol el orders lel current user
    res.status(200).json(orders); //araga3 el orders array
  } 
  catch (error) { 
    next(error); 
    }
};


//ADMIN ONLY FN.S

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.product', 'name price');
    res.status(200).json(orders);
  } catch (error) 
    { 
    next(error); 
    }
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    const newStatus = req.body.status || order.status;

    if (newStatus === 'delivered' && order.status !== 'delivered') {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          await product.save();
        }
      }
    }


    order.status = newStatus; //update status law fe wahed gdeed, law mafesh aseb ely mawgod
    const updated = await order.save();
    res.status(200).json(updated);
  } catch (error) { 
    next(error); 
  }
};

module.exports = { checkout, getMyOrders, getAllOrders, updateOrderStatus };