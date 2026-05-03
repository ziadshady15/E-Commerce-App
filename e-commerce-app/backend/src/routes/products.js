const express = require('express');
const router  = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productlogic');
const protect = require('../middleware/protect');
const admin   = require('../middleware/admin');

router.get('/',      getProducts);//m3mlnash protect 3ashan el products momken yeshofha ay wa7ed mesh bas ely 3aml login
router.get('/:id',   getProductById);
router.post('/',     protect, admin, createProduct);
router.put('/:id',   protect, admin, updateProduct);
router.delete('/:id',protect, admin, deleteProduct);

module.exports = router;