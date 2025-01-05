const User = require('../models/userModel');


const userController = {
    registerUser: async (req, res, next) => {
        try {
          const { firstName, lastName, email, password } = req.body;
          const user = await User.findOne({ email });
    
          if (!user) {
            const newUser = new User({ firstName, lastName, email, password });
            const savedUser = await newUser.save();
    
            req.session.userId = savedUser._id; // Save user ID in session
            res.status(201).json({ message: 'User registered successfully' });
          } else {
            req.session.userId = user._id; // Save user ID for existing users
            res.status(201).json({ message: 'Logged in successfully' });
          }
        } catch (error) {
          next(error); // Pass error to error handling middleware
        }
      },
    
      getUserProfile: (req, res) => {
        try {
          if (!req.user) {
            return res.status(401).json({ error: 'Unauthorized' });
          }
    
          res.status(200).json({
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
          });
        } catch (error) {
          res.status(500).json({ error: 'Failed to fetch user profile.' });
        }
      },
      logoutUser: (req, res) => {
        try {
          // Destroy the session and clear cookies
          req.session.destroy((err) => {
            if (err) {
              console.error('Error destroying session:', err);
              return res.status(500).json({ error: 'Failed to log out.' });
            }
      
            // Clear session cookie
            res.clearCookie('connect.sid'); // Default session cookie name
            res.status(200).json({ message: 'Logged out successfully' });
          });
        } catch (error) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
      },
};

module.exports = userController;
