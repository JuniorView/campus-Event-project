const express = require('express');
const { registerUser } = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');

const router = express.Router();

router.post('/register', validateUser, registerUser);

module.exports = router;