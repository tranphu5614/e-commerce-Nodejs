const multer = require('multer');
const path = require('path');

// Cấu hình nơi lưu trữ và tên file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/');
    },
    filename: function (req, file, cb) {
        // Lấy tên sản phẩm từ req.body và xử lý tên cho hợp lệ
        // const productName = req.body.name.toLowerCase().replace(/[^a-z0-9]/g, '-'); // Thay thế ký tự không hợp lệ bằng dấu '-'
        const productName = req.body.name
        const fileExt = path.extname(file.originalname); // Lấy phần mở rộng của file
        cb(null, productName + fileExt); // Đặt tên file trùng với tên sản phẩm
    }
});

// Kiểm tra loại file để đảm bảo chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Only images are allowed!');
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
