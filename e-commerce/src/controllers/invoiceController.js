// controllers/invoiceController.js
const Invoice = require('../models/invoiceModel');
const Cart = require('../models/cartModel');
const Product = require('../models/productModel')

// Lấy danh sách tất cả các invoice
exports.getAllInvoices = async (req, res) => {
    const user = req.user; // Lấy thông tin người dùng từ middleware (cần đảm bảo middleware hoạt động đúng)
    const { productId } = req.params; // Kiểm tra xem productId có được truyền hay không
    const originalUrl = req.originalUrl; // Lưu URL gốc để chuyển hướng sau khi login/logout
    
    try {
        // Tìm tất cả các hóa đơn của người dùng
        const invoices = await Invoice.find({ username: user.username }).populate('products.productId');

        // Render trang với dữ liệu cần thiết
        res.status(200).render('invoice', { 
            user, 
            invoices, 
            productId, 
            originalUrl 
        });
    } catch (error) {
        console.error('Error fetching invoices:', error);
        res.status(500).json({ success: false, message: "Error fetching invoices." });
    }
};


// Tạo một invoice mới
exports.createInvoice = async (req, res) => {
    const { cartItems, total } = req.body;
    const username = req.user?.username;

    console.log(cartItems)
    console.log(total)
    console.log(username)

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ success: false, message: "Cart is empty." });
    }

    try {
        // Lấy danh sách sản phẩm từ cơ sở dữ liệu
        const productIds = cartItems.map(item => item.productId);
        const products = await Product.find({ _id: { $in: productIds } });
        
        console.log(productIds)
        console.log(products)

        // Kiểm tra xem tất cả sản phẩm có tồn tại không
        if (products.length !== cartItems.length) {
            return res.status(400).json({
                success: false,
                message: "Some products in the cart do not exist.",
            });
        }

        // Tạo hóa đơn mới với thông tin sản phẩm đầy đủ
        const invoiceProducts = cartItems.map(item => {
            const product = products.find(p => p._id.toString() === item.productId.toString());
            if (!product) {
                throw new Error(`Product with ID ${item.productId} not found.`);
            }
            return {
                productId: product._id.toString(), // ID của sản phẩm
                name: product.name, // Tên sản phẩm (nếu cần lưu)
                price: product.price, // Giá sản phẩm (nếu cần lưu)
                quantity: item.quantity, // Số lượng mua
                size: item.size, // Kích thước (nếu cần lưu)
                total: product.price * item.quantity // Tổng giá
            };
        });
               

        const invoice = new Invoice({
            username,
            purchaseDate: new Date(),
            total,
            products: invoiceProducts,
        });

        console.log(products)

        const newInvoice = await invoice.save();

        // Làm trống giỏ hàng sau khi tạo hóa đơn
        try {
            await Cart.deleteOne({ userId: req.user.id });
        } catch (error) {
            console.error("Error clearing cart:", error);
            return res.status(500).json({ success: false, message: "Error clearing cart." });
        }


        res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            invoiceId: newInvoice._id,
        });

    } catch (error) {
        console.error("Error creating invoice:", error);
        res.status(500).json({ success: false, message: "Error creating invoice." });
    }
};

// Lấy thông tin của một invoice dựa trên ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice == null) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa một invoice
exports.deleteInvoice = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice == null) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        await invoice.remove();
        res.json({ message: 'Invoice deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
