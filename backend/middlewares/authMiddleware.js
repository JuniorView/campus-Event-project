const User = require('../models/userModel');

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.session?.userId; // Assuming session-based authentication

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const user = await User.findById(userId).select('-password'); // Exclude password
    if (!user) {
      return res.status(401).json({ error: 'User not found. Please log in again.' });
    }

    req.user = user; // Attach user info to request object
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
