const express = require('express');
const {getUserDetails, validateUser, getUserProfile,logoutUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Registration/Login Route
router.post('/register', validateUser);

// Profile Route
router.get('/profile', authMiddleware, getUserProfile);
// Logout Route
router.post('/logout', logoutUser);
router.get('/details', authMiddleware, getUserDetails);

module.exports = router;
