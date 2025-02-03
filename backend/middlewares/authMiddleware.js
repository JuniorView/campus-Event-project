const userService = require('../services/userService');

const authMiddleware = async (req, res, next) => {
  try {
    const userId = req.session?.userId; // Assuming session-based authentication

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized. Please log in.' });
    }

    const user = userService.getUserById(userId); // Exclude password
    if (user.error) {
      return res.status(user.status).json(user.error);
    }

    req.user = user; // Attach user info to request object
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
