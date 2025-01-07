const express = require('express');
const router = express.Router();
const { registerUser, loginUser, createAdmin, logoutUser, changePassword } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const User = require('../models/accountModel'); // Đường dẫn đến file accountModel.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Route đăng ký
router.post('/register', registerUser);

// Route đăng nhập
router.post('/login', loginUser);

// Route hiển thị form đăng nhập
router.get('/login', (req, res) => {
    const originalUrl = req.originalUrl
    console.log('Original URL:', originalUrl);
    res.render('login', { message: null, originalUrl: originalUrl });
});

// Route hiển thị trang đăng ký
router.get('/register', (req, res) => {
    const originalUrl = req.originalUrl
    console.log('Original URL:', originalUrl);
    res.render('register', { message: null, originalUrl: originalUrl });
});

// Route xử lý đăng xuất
router.get('/logout', logoutUser);

// Route chỉ admin mới có thể tạo thêm admin khác
router.post('/create-admin', protect, admin, createAdmin);

// Render the Change Password Page
router.get('/change-password', protect, (req, res) => {
    res.render('change-password', { message: null }); // No message initially
});

// Handle Change Password Submission
router.post('/change-password', protect, changePassword);

// Route chỉ admin mới có thể tạo thêm admin khác
router.post('/create-admin', protect, admin, createAdmin);

router.get('/send-otp', (req, res) => {
    res.render('send-otp'); // Hiển thị form để nhập email
});

router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).render('send-otp', { message: 'Email không tồn tại!' });
        }

        // Tạo mã OTP ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 chữ số
        user.otp = otp;
        user.otpExpire = Date.now() + 10 * 60 * 1000; // OTP hết hạn sau 10 phút
        await user.save();

        // Gửi OTP qua email
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        });

        await transporter.sendMail({
            to: email,
            subject: 'Mã xác thực OTP',
            text: `Mã OTP của bạn là: ${otp}. Mã này có hiệu lực trong 10 phút.`,
        });

        res.redirect(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Lỗi khi gửi OTP:', error);
        res.status(500).render('send-otp', { message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
});
  
router.get('/verify-otp', (req, res) => {
    const email = req.query.email; // Lấy email từ query string
    console.log('Email:', email);
    if (!email) {
        return res.status(400).render('error', { message: 'Email không hợp lệ!' });
    }
  
    res.render('verify-otp', { email });
});
  
  

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    console.log('called')
    try {
        const user = await User.findOne({ email });
        console.log(user.otp)
        if (!user) {
            return res.status(404).render('verify-otp', { message: 'Email không tồn tại!', email });
        }

        // Kiểm tra mã OTP
        if (user.otp !== otp || Date.now() > user.otpExpire) {
            return res.status(400).render('verify-otp', { message: 'Mã OTP không hợp lệ hoặc đã hết hạn!', email });
        }

        // OTP hợp lệ
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        res.redirect(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error) {
        console.error('Lỗi khi xác thực OTP:', error);
        res.status(500).render('verify-otp', { message: 'Có lỗi xảy ra, vui lòng thử lại!', email });
    }
});

router.get('/reset-password', async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).render('error', { message: 'Email không hợp lệ!' });
    }

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).render('error', { message: 'Email không tồn tại!' });
        }

        // Truyền `username` vào giao diện
        res.render('reset-password', { email, username: user.username });
    } catch (error) {
        console.error('Lỗi khi truy xuất người dùng:', error);
        res.status(500).render('error', { message: 'Có lỗi xảy ra, vui lòng thử lại!' });
    }
});
  

router.post('/reset-password', async (req, res) => {
    const { email, password, confirmPassword } = req.body;

    try {
        if (password !== confirmPassword) {
            return res.status(400).render('reset-password', { message: 'Mật khẩu không khớp!', email });
        }
  
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).render('reset-password', { message: 'Email không tồn tại!', email });
        }
  
        // Cập nhật mật khẩu mới
        user.password = password;
        await user.save();
    
        res.redirect(`/products`);
    } catch (error) {
        console.error('Lỗi khi đặt lại mật khẩu:', error);
        res.status(500).render('reset-password', { message: 'Có lỗi xảy ra, vui lòng thử lại!', email });
    }
});

module.exports = router;
