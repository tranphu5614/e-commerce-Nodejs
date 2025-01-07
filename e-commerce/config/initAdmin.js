const bcrypt = require('bcryptjs');
const User = require('../src/models/accountModel'); // Model người dùng của bạn

// Hàm tạo admin nếu chưa có
const createAdminUser = async () => {
    try {
        const admin = await User.findOne({ email: 'admin@gmail.com' });
        if (!admin) {
            const hashedPassword = await bcrypt.hash('123456', 10);
            const newAdmin = new User({
                email: 'admin@gmail.com',
                username: 'admin',
                password: '123456',
                role: 'admin',
            });
            await newAdmin.save();
            console.log('Admin account created: email: admin@gmail.com, password: 123456');
        } else {
            console.log('Admin account already exists');
        }
    } catch (error) {
        console.error('Error creating admin account:', error);
    }
};

// Xuất hàm để gọi trong app.js
module.exports = createAdminUser;
