const express = require('express');
const router = express.Router();
const multer = require('multer');
const { protect } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const { body } = require('express-validator');

const validateProfileUpdate = [
    body('username').notEmpty().withMessage('Username is required'),
    body('existingImage').optional().isString(),
  ];

// Render profile page
router.get('/profile', protect, userController.getProfile);

// Handle profile updates with file upload
router.post('/profile', validateProfileUpdate, userController.updateProfile);

module.exports = router;