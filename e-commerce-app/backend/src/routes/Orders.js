const express = require('express');
const router  = express.Router();
const { checkout, getMyOrders, getAllOrders, updateOrderStatus } = require('../controllers/OrderController');
const protect = require('../middleware/protect');
const admin   = require('../middleware/admin');

router.post('/checkout',  protect,       checkout);
router.get('/my-orders',  protect,       getMyOrders);
router.get('/',           protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;