const User = require('../models/accountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
require('dotenv').config(); // Nạp biến môi trường từ file .env

// Tạo token JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1h',
    });
};

// dang ky
exports.registerUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Kiểm tra xem email hoặc username (trích xuất từ email) có tồn tại chưa
        const username = email.split('@')[0];
        const emailExists = await User.findOne({ email });
        const usernameExists = await User.findOne({ username });

        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        if (usernameExists) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Tạo người dùng mới
        const user = await User.create({ email, username, password, role: 'customer' });

        // Tạo token JWT
        const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Lưu token vào cookies
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development',
            maxAge: 3600000, // 1 giờ
        });

        const redirectUrl = req.query.redirect || '/';
        const decodedUrl = decodeURIComponent(redirectUrl)
        const finalUrl = new URLSearchParams(decodedUrl.split('?')[1]).get('redirect');
        res.status(201).redirect('/products');
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
  

// Đăng nhập người dùng
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Tìm người dùng theo email
        const user = await User.findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            // Tạo token JWT
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

            // Lưu token vào cookies
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'development',
                maxAge: 3600000, // 1 giờ
            });

            const redirectUrl = req.query.redirect || '/';
            const decodedUrl = decodeURIComponent(redirectUrl)
            const finalUrl = new URLSearchParams(decodedUrl.split('?')[1]).get('redirect');
            res.status(201).redirect(finalUrl);
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};    
  

// Chỉ admin có quyền tạo thêm admin mới
exports.createAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const adminUser = await User.create({ email, password, role: 'admin' });
        res.status(201).json({
        _id: adminUser._id,
        username: adminUser.email,
        role: adminUser.role,  // Sẽ là 'admin'
        token: generateToken(adminUser._id, adminUser.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Đăng xuất
exports.logoutUser = (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0), // Xóa cookie bằng cách đặt thời gian hết hạn là quá khứ
    });
    // Kiểm tra và đặt URL mặc định
    const redirectUrl = req.query.redirect ? decodeURIComponent(req.query.redirect) : '/products';
    
    // const finalUrl = new URLSearchParams(decodedUrl.split('?')[1]).get('redirect');
    res.status(200).redirect(redirectUrl);
};

// Admin login route
exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email, role: 'admin' }); // Ensure user has 'admin' role

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            // Set token in cookie
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 3600000,
            });

            res.redirect('/admin'); // Redirect to admin dashboard
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'Please provide both current and new passwords' });
    }

    try {
        const user = await User.findById(req.user._id).select('+password');

        if (!user || !user.password) {
            return res.status(401).json({ message: 'Password is missing for this user' });
        }

        // Check if the current password matches
        const isMatch = await user.matchPassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // Update the password
        user.password = newPassword;
        await user.save();

        res.status(200).render('profile', { user })
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).json({ message: 'Server error' });
    }
};