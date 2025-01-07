const mongoose = require('mongoose');
require('dotenv').config();  // Để sử dụng biến môi trường từ file .env
const createAdminUser = require('./initAdmin'); // Import hàm tạo admin

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);  // Không cần truyền các tùy chọn deprecated
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    createAdminUser();  // Gọi hàm tạo admin từ initAdmin.js
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Thoát ứng dụng nếu không kết nối được
  }
};

module.exports = connectDB;
