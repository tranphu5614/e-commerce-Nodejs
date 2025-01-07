const User = require('../models/accountModel');
const Product = require('../models/productModel');
const Invoice = require('../models/invoiceModel')

// Lấy tất cả sản phẩm và người dùng cho admin
exports.getDashboardData = async (req, res) => {
    try {
        const perPage = 10;  // Số lượng items trên mỗi trang

        // Sử dụng `userPage` và `productPage` thay vì `page` chung
        const currentPageUser = parseInt(req.query.userPage) || 1;  
        const currentPageProduct = parseInt(req.query.productPage) || 1;  
        const currentPageInvoice = parseInt(req.query.invoicePage) || 1;

        // Lấy tổng số người dùng và số sản phẩm
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalInvoices = await Invoice.countDocuments();

        // Tính số trang tổng cho người dùng và sản phẩm
        const totalPagesUsers = Math.ceil(totalUsers / perPage);
        const totalPagesProducts = Math.ceil(totalProducts / perPage);
        const totalPagesInvoices = Math.ceil(totalInvoices / perPage);

        // Lấy danh sách người dùng cho trang hiện tại
        const users = await User.find()
            .skip((currentPageUser - 1) * perPage)
            .limit(perPage);

        // Lấy danh sách sản phẩm cho trang hiện tại
        const products = await Product.find()
            .skip((currentPageProduct - 1) * perPage)
            .limit(perPage);

        const invoices = await Invoice.find()
            .skip((currentPageInvoice - 1) * perPage)
            .limit(perPage);
        // Render trang dashboard và truyền dữ liệu người dùng và sản phẩm vào EJS
        res.render('dashboard', {
            users: users,  // Danh sách người dùng
            products: products,  // Danh sách sản phẩm
            invoices: invoices,
            totalPagesUsers,
            totalPagesProducts,
            totalPagesInvoices,
            currentPageUser,
            currentPageProduct,
            currentPageInvoice
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
