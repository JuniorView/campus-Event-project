const User = require("../models/userModel");
module.exports = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    const user = await User.findOne({ email });
    if (user) {
        // Überprüfung der Daten
        if (
            user.firstName !== firstName ||
            user.lastName !== lastName ||
            user.password !== password
        ) {
            return res.status(400).json({ error: 'User data does not match.' });
        }
    }

    next();
};