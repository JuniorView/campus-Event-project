const express = require('express');
const { registerUser , loginUser } = require('../controllers/userController');
const validateUser = require('../middlewares/validateUser');

const router = express.Router();

//registrierung or login
router.post('/register', validateUser, registerUser);



module.exports = router;