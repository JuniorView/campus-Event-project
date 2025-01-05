const express = require('express');
const { registerUser, getUserProfile,logoutUser } = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Registration/Login Route
router.post('/register', validateUser, registerUser);

// Profile Route
router.get('/profile', authMiddleware, getUserProfile);
// Logout Route
router.post('/logout', logoutUser);

module.exports = router;
