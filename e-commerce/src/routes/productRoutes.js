const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware')

// Lấy tất cả sản phẩm
router.get('/', protect, productController.getAllProducts);

// Route để hiển thị form thêm sản phẩm
router.get('/add', protect, admin, productController.openformAdd);

// -------------------------------------------------------------

// // Route để xử lý khi form thêm sản phẩm được submit
// router.post('/add', productController.addProduct);

// // Cập nhật sản phẩm
// router.put('/:id', productController.updateProduct);

// // Xóa sản phẩm
// router.delete('/:id', productController.deleteProduct);

// -------------------------------------------------------------

// Lấy sản phẩm theo ID
router.get('/:id', protect, productController.getProductById);

// Route thêm sản phẩm chỉ dành cho admin
router.post('/add', protect, admin, upload.single('image'), productController.addProduct);

// Route để xóa sản phẩm chỉ dành cho admin
router.post('/delete/:id', protect, admin, productController.deleteProduct);

// Route để hiển thị form edit sản phẩm
router.get('/update/:id', protect, admin, productController.renderUpdateProductForm);

// Route để cập nhật sản phẩm chỉ dành cho admin
router.post('/update/:id', protect, admin, upload.single('image'), productController.updateProduct);

// Route tìm kiếm
router.get('/search', productController.searchProducts);

module.exports = router;
