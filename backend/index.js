const express = require('express');
const cors = require('cors');
//const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middlewares/errorHandler');
const { connectDB, closeDB } = require('./helpers/getDatabase');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
// Verbindung zur Datenbank herstellen
(async () => {
    try {
        await connectDB();
    } catch (error) {
        console.error('Failed to start server due to database connection error:', error.message);
        process.exit(1); // Beende den Prozess bei Verbindungsfehlern
    }
})();

// Routes
app.use('/api/users', userRoutes);

// Error Handling Middleware
app.use(errorHandler);


// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));