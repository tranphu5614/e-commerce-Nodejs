const Product = require('../models/productModel');
const session = require('express-session')

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    // Kiểm tra nếu người dùng đã đăng nhập và có thông tin trong session
    const user = req.user; 

    const nikeProducts = await Product.find({ brand: "Nike" });
    const adidasProducts = await Product.find({ brand: "Adidas" });

    const originalUrl = req.originalUrl

    // Render trang homepage và truyền dữ liệu user và products vào EJS
    res.render('homepage', {
      user: user,         // Truyền thông tin người dùng
      nikeProducts: nikeProducts,  // Truyền danh sách sản phẩm
      adidasProducts: adidasProducts,
      originalUrl: originalUrl
    });
  } catch (err) {
      res.status(500).send('Server Error');
  }
};

// Lấy tất cả sản phẩm cho admin
exports.getAllProductsAdmin = async (req, res) => {
  try {
    // Kiểm tra nếu người dùng đã đăng nhập và có thông tin trong session
    const user = req.user; // hoặc req.user tùy thuộc vào cách bạn quản lý session hoặc token

    const perPage = 10;  // Number of items per page
    const currentPage = parseInt(req.query.page) || 1;  // Current page, defaults to 1 if not provided
    const totalProducts = await Product.countDocuments();  // Total number of products
    const totalPages = Math.ceil(totalProducts / perPage);  // Total pages

    const products = await Product.find()
      .skip((currentPage - 1) * perPage)  // Skip products of previous pages
      .limit(perPage);  // Limit to 10 products per page

    // Render trang homepage và truyền dữ liệu user và products vào EJS
    res.render('dashboard', {
      user: user,         // Truyền thông tin người dùng
      products: products,  // Truyền danh sách sản phẩm
      totalPages,
      currentPage
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Render form cập nhật sản phẩm
exports.renderUpdateProductForm = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.render('updateProduct', {
      product: product,
      message: null, // Có thể sử dụng để hiển thị thông báo
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Chức năng update sản phẩm
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, size, color, stock, description } = req.body;

  // Nếu có file ảnh mới, sử dụng nó; nếu không, giữ ảnh cũ
  const imagePath = req.file ? `/images/${req.file.filename}` : req.body.existingImage;

  // Chuyển size thành mảng nếu cần thiết
  const sizeArray = size.split(',').map(s => s.trim());

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        size: sizeArray,
        color,
        stock,
        images: [imagePath], // Giữ ảnh cũ nếu không có ảnh mới
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(201).redirect('/admin/dashboard');
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).redirect('/admin/dashboard'); // Chuyển hướng lại trang quản lý sau khi xóa
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
  try {
    const user = req.user; // hoặc req.user tùy thuộc vào cách bạn quản lý session hoặc token
    const product = await Product.findById(req.params.id);

    const originalUrl = req.originalUrl
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('viewdetail', {
      user: user,
      product: product,
      cssFile: 'viewdetail.css',
      originalUrl: originalUrl
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.openformAdd = async (req, res) => {
  res.render('addProduct')
};

// Hàm xử lý thêm sản phẩm
exports.addProduct = async (req, res) => {
  console.log('addProduct function called by user:', req.user.username);
  const { name, brand, price, size, color, stock, description } = req.body;
  const imagePath = `/images/${req.file.filename}`;

  // Chuyển các giá trị nhập vào thành mảng nếu cần
  const sizeArray = size.split(',').map(s => s.trim());
  // const imagesArray = images.split(',').map(img => img.trim());

  const product = new Product({
    name,
    brand,
    price,
    size: sizeArray,
    color,
    stock,
    images: [imagePath],
    description
  });

  try {
    const newProduct = await product.save();
    res.status(201).redirect('/admin/dashboard');  // Chuyển hướng sau khi thêm thành công
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Tìm sản phẩm theo tên
exports.searchProducts = async (req, res) => {
  try {
    const searchQuery = req.query.name || ''; // Lấy từ khóa tìm kiếm từ query string

    // Sử dụng $regex để tìm kiếm sản phẩm có tên chứa từ khóa (case-insensitive)
    const products = await Product.find({
      name: { $regex: searchQuery, $options: 'i' }
    }).limit(5); // Giới hạn kết quả trả về (ví dụ: 5 sản phẩm)

    res.json(products); // Trả về kết quả dưới dạng JSON
  } catch (err) {
    console.error('Error occurred:', err);
    res.status(500).send('Server Error');
  }
};

