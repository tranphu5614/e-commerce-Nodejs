const express = require('express');
const router = express.Router();
const { isAdmin, admin, protect } = require('../middleware/authMiddleware'); // Assuming the middleware is in the middleware folder
const { loginAdmin } = require('../controllers/authController')
const dashController = require('../controllers/dashController');

// Admin dashboard route
router.get('/', isAdmin, dashController.getDashboardData)

router.get('/login', (req, res) => {
    res.render('loginAdmin')
})

router.post('/login', loginAdmin);

module.exports = router;
