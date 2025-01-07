// src/routes/cartRoutes.js
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add/:productId', authMiddleware.protect, cartController.addToCart);
router.get('/', authMiddleware.protect, cartController.getCart);
router.post('/updateQuantity/:itemId', authMiddleware.protect, cartController.updateQuantity);
router.delete('/remove/:itemId', authMiddleware.protect, cartController.removeFromCart);

module.exports = router;