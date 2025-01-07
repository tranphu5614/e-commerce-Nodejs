const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser')
const methodOverride = require('method-override');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cartRoutes = require('./routes/cartRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config(); // Nạp biến môi trường từ file .env
const connectDB = require('../config/db')

const app = express();

app.use(express.json());
app.use(express.static('public'))
app.use(cookieParser());
app.use(methodOverride('_method'));

// Thiết lập template engine là EJS
app.set('view engine', 'ejs');

// Cấu hình để phục vụ các tệp tĩnh từ thư mục 'public'
app.use('/public', express.static(path.join(__dirname, 'public')));
// Đặt thư mục views nơi Express sẽ tìm kiếm các file template
app.set('views', path.join(__dirname, 'views'));

// Middleware để phân tích dữ liệu từ form
app.use(express.urlencoded({ extended: true }));

// Routes
// route cho admin
app.use('/admin', adminRoutes);
// Sử dụng route cho xác thực người dùng
app.use('/auth', authRoutes);
// Sử dụng route cho sản phẩm
app.use('/products', productRoutes);
// route cho cart
app.use('/cart', cartRoutes)
// route cho invoice
app.use('/invoices', invoiceRoutes);

app.use('/user', userRoutes);

app.get('/about', (req, res) => {
    res.render('about')
})

app.get('/contact', (req, res) => {
    res.render('contact')
})

app.get('/privacy-policy', (req, res) => {
    res.render('privacy-policy')
})

app.use('', (req, res) => {
    res.render('error')
})
// connect to db
connectDB();

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on  http://localhost:${PORT}/products`));
