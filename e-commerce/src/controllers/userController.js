const User = require('../models/accountModel');
const { validationResult } = require('express-validator');

// Lấy tất cả sản phẩm cho admin
exports.getAllUsersAdmin = async (req, res) => {
    try {
        const perPage = 10;  // Number of items per page
        const currentPage = parseInt(req.query.page) || 1;  // Current page, defaults to 1 if not provided
        const totalUsers = await User.countDocuments();  // Total number of
        const totalPages = Math.ceil(totalProducts / perPage);  // Total pages
        
        const users = await User.find()
            .skip((currentPage - 1) * perPage)  // Skip products of previous pages
            .limit(perPage);  // Limit to 10 products per page

        // Test image
        users.forEach(u => {
            console.log(u.name)
            console.log(u.password)
        })

        // Render trang homepage và truyền dữ liệu user và products vào EJS
        res.render('dashboard', {
            users: users,  // Truyền danh sách users
            totalPages,
            currentPage
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Render profile page
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id); // Get the currently logged-in user's details
        console.log(user)
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('profile', { user });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    const { id } = req.params;
    const { username, existingImage } = req.body;
    console.log(id)
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Use the new image if uploaded; otherwise, use the existing one
    const imagePath = req.file ? `/images/${req.file.filename}` : existingImage;

    try {
        // Update user information
        const updatedUser = await User.findByIdAndUpdate(
        id,
        {
            username,
            images: [imagePath], // Replace or keep the existing image
        },
        { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Redirect to profile page
        res.redirect('/user/profile');
    } catch (error) {
        console.error('Error updating user:', error);

        // Check for specific error types (optional)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }

        res.status(500).json({ message: 'Server error' });
    }
};