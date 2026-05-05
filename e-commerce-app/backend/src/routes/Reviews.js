const express  = require('express');
const router   = express.Router();
const { createReview, getProductReviews, deleteReview } = require('../controllers/reviewlogic');
const protect  = require('../middleware/protect');
const admin    = require('../middleware/admin');

router.post('/',                     protect,        createReview);//lazm yb2a 3aml login
router.get('/product/:productId',                    getProductReviews);
router.delete('/:id',                protect, admin, deleteReview);

module.exports = router;