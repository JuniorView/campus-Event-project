const User = require('../models/userModel');

exports.registerUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const newUser = new User({ firstName, lastName, email, password });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
       // res.status(400).json({ error: error.message });
        next(error); // Pass error to error handling middleware
    }
};