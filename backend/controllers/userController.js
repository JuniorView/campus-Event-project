const User = require('../models/userModel');


const userController = {
    registerUser : async (req, res, next) => {
        try {
            const { firstName, lastName, email, password } = req.body;
            const user = await User.findOne({ email });

            if (!user){
                const newUser = new User({ firstName, lastName, email, password });
                await newUser.save();
                res.status(201).json({ message: 'User registered successfully' });
            }else{
                res.status(201).json({ message: 'Logged in successfully' });
            }


        } catch (error) {
            // res.status(400).json({ error: error.message });
            next(error); // Pass error to error handling middleware
        }
    },

   /* loginUser :async (req, res, next) => {
        try {
            const { email, firstName, lastName, password } = req.body;

            // Benutzer suchen
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'User not found. Please register.' });
            }

            // Überprüfung der Daten
            if (
                user.firstName !== firstName ||
                user.lastName !== lastName ||
                user.password !== password
            ) {
                return res.status(400).json({ error: 'User data does not match.' });
            }

            // Erfolgreicher Login
            return res.status(200).json({ message: 'Login successful', user });
        } catch (error) {
            next(error);
        }
    },*/
};

module.exports = userController;



