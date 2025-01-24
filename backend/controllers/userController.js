const userService = require('../services/userService');


const userController = {
    validateUser: (req, res, next) => {
        const {firstName, lastName, email, password} = req.body;

        // Überprüfen, ob alle Felder vorhanden sind
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({error: 'All fields are required'});
        }

        // Benutzer mit eingegebener E-Mail wird gesucht
        const user = userService.getUserByEmail(email);
        if (user.error) {
            return res.status(user.status).json(user.error);
        }

        // Überprüfen der Benutzerdaten
        if (
            user.firstName !== firstName ||
            user.lastName !== lastName ||
            user.password !== password
        ) {
            return res.status(400).json({error: 'User data does not match.'});
        }

        req.session.userId = user.id;  // Save user ID for existing users
        req.session.firstName = user.firstName;  // Save firstName
        req.session.lastName = user.lastName;    // Save lastName

        res.status(201).json({ message: 'Logged in successfully' });

        // Weiter zur nächsten Middleware
        next();
    },

    getUserProfile: (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).json({error: 'Unauthorized'});
            }

            res.status(200).json({
                firstName: req.session.firstName,  // Use session data
                lastName: req.session.lastName,    // Use session data
                email: req.user.email,
            });
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch user profile.'});
        }
    },

    logoutUser: (req, res) => {
        try {
            // Destroy the session and clear cookies
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    return res.status(500).json({error: 'Failed to log out.'});
                }

                // Clear session cookie
                res.clearCookie('connect.sid'); // Default session cookie name
                res.status(200).json({message: 'Logged out successfully'});
            });
        } catch (error) {
            res.status(500).json({error: 'Internal Server Error'});
        }
    },

    getUserDetails: (req, res) => {
        try {
            if (!req.session || !req.session.userId) {
                return res.status(401).json({error: 'Unauthorized. Please log in.'});
            }

            res.status(200).json({
                firstName: req.session.firstName,
                lastName: req.session.lastName,
                email: req.session.email, // Optional
            });
        } catch (error) {
            res.status(500).json({error: 'Failed to fetch user details.'});
        }
    },
};

module.exports = userController;
