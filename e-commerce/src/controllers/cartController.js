
const Cart = require('../models/cartModel');
const Product = require('../models/productModel');
const cookieParser = require('cookie-parser');
// Hàm thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1, size } = req.body;
  const userId = req.user;
  
  try {
    // Tìm sản phẩm trong cơ sở dữ liệu
    const product = await Product.findById(productId);
    
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found." });
    }

    // Find user's cart or create a new one
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, products: [] });
    }

    // Check if the product with the selected size is already in the cart
    const existingProductIndex = cart.products.findIndex(
      (item) => item.productId.equals(productId) && item.size === parseInt(size)
    );

    if (existingProductIndex >= 0) {
      // Update quantity if product with selected size exists
      cart.products[existingProductIndex].quantity += quantity;
    } else {
      // Add new product entry with size and quantity
      cart.products.push({ productId, size: parseInt(size), quantity, _id: productId });
    }

    // Save the cart
    await cart.save();
    res.redirect('/cart')
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ success: false, message: "Error adding to cart." });
  }
};

// Hàm lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
  try {
    
    const originalUrl = req.originalUrl
    
    const userId = req.user.id; // Giả sử có user đăng nhập
    const user = req.user;
    // Tìm giỏ hàng của người dùng
    const cart = await Cart.findOne({ userId }).populate('products.productId'); // Populate để lấy chi tiết sản phẩm

    // console.log(JSON.stringify(cart, null, 2)); // Hiển thị toàn bộ dữ liệu giỏ hàng

    if (!cart || cart.products.length === 0) {
      return res.status(200).render('cart', { cart: { products: [] }, user, totalAmount: 0, originalUrl });
    }

    // Tính tổng giá trị giỏ hàng
    const cartItems = cart.products.map(item => {
      const product = item.productId;
      
      return {
        productId: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images[0], // Lấy ảnh đầu tiên
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        total: product.price * item.quantity, // Tính tổng giá cho sản phẩm này
      };
    });
    console.log("Cart Items:", cartItems);
    // Tính tổng cộng
    const totalAmount = cartItems.reduce((acc, item) => acc + item.total, 0);

    res.status(200).render('cart', { cart, user, totalAmount, originalUrl });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving cart" });
  }
};

// Update quantity function
exports.updateQuantity = async (req, res) => {
  console.log('update function is called')
  const userId = req.user.id;
  const { itemId } = req.params;
  const { change } = req.body;
  console.log(change)
  try {
    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    // Find product in cart by item ID
    const productIndex = cart.products.findIndex(item => item._id.equals(itemId));
    if (productIndex < 0) return res.status(404).json({ success: false, message: 'Product not found in cart' });

    // Update the quantity
    cart.products[productIndex].quantity += change;
    if (cart.products[productIndex].quantity < 1) cart.products[productIndex].quantity = 1;

    // Save and recalculate totals
    await cart.save();
    const newSubtotal = cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    res.json({ success: true, updatedQuantity: cart.products[productIndex].quantity, newSubtotal });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating quantity' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const userId = req.user._id;
  const { itemId } = req.params;

  try {
    // Find user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });

    // Remove product by item ID
    cart.products = cart.products.filter(item => !item._id.equals(itemId));

    // Save and recalculate totals
    await cart.save();
    const newSubtotal = cart.products.reduce((sum, item) => sum + item.productId.price * item.quantity, 0);

    res.json({ success: true, newSubtotal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error removing item from cart' });
  }
};
