const router = require('express').Router();
const verifyToken = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

// Register
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Logout
router.post('/logout', verifyToken, authController.logout);

// Get current user
router.get('/me', verifyToken, authController.getCurrentUser);

module.exports = router; 