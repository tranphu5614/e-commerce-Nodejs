// routes/invoiceRoutes.js
const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const { protect } = require('../middleware/authMiddleware');

// Định nghĩa các route
router.get('/', protect, invoiceController.getAllInvoices);
router.post('/', protect, invoiceController.createInvoice);
router.get('/:id', protect, invoiceController.getInvoiceById);
router.delete('/:id', protect, invoiceController.deleteInvoice);

module.exports = router;
