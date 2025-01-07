const jwt = require('jsonwebtoken');
const User = require('../models/accountModel');
require('dotenv').config(); // Nạp biến môi trường từ file .env

// Middleware kiểm tra xác thực JWT
exports.protect = async (req, res, next) => {
  let token;

  // Lấy token từ cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Nếu không có token
  if (!token) {
    // console.log('No token, not authorized');
    // return res.status(401).json({ message: 'Not authorized, no token' });
    req.user = null; // Không có token thì không có người dùng
    return next();
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // req.user = decoded; // Lưu thông tin người dùng đã giải mã vào req.user

    // Lấy thông tin user từ database
    req.user = await User.findById(decoded._id).select('-password');
    console.log('User found:', req.user.username, 'with role:', req.user.role);

    next();
  } catch (error) {
    // console.error('Token verification failed:', error);
    // return res.status(401).json({ message: 'Not authorized, token failed' });
    res.clearCookie('token'); // Token không hợp lệ thì xóa cookie
    req.user = null;
    next();
  }
};

// Middleware kiểm tra quyền admin
exports.admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
};

exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
      return res.redirect('/admin/login'); // Redirect to login if no token
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'admin') {
          req.user = decoded;
          next();
      } else {
          return res.status(403).send('Access denied');
      }
  } catch (error) {
      res.clearCookie('token');
      return res.redirect('/admin/login');
  }
}
