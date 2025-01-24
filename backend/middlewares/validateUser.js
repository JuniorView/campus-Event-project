const fs = require('fs'); // Modul für Dateioperationen
const path = require('path'); // Modul für Dateipfade

module.exports = (req, res, next) => {
    const {firstName, lastName, email, password} = req.body;

    // Überprüfen, ob alle Felder vorhanden sind
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({error: 'All fields are required'});
    }

    // Pfad zur JSON-Datei
    const filePath = path.join(__dirname, '../data.json');

    // Lesen der JSON-Datei
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({error: 'Error reading users data file'});
        }

        // Parsen der JSON-Daten
        const users = JSON.parse(data).user;

        // Benutzer mit eingegebener E-Mail wird gesucht
        let user = null;
        for (const current of users) {
            if (current.email === email) {
                user = current;
                console.log("user found");
                break;
            }
        }

        if (user) {
            // Überprüfen der Benutzerdaten
            if (
                user.firstName !== firstName ||
                user.lastName !== lastName ||
                user.password !== password
            ) {
                return res.status(400).json({error: 'User data does not match.'});
            }
        } else {
            return res.status(404).json({error: 'User not found.'});
        }

        req.session.userId = user._id;  // Save user ID for existing users
        req.session.firstName = user.firstName;  // Save firstName
        req.session.lastName = user.lastName;    // Save lastName

        res.status(201).json({ message: 'Logged in successfully' });

        // Weiter zur nächsten Middleware
        next();
    });
}