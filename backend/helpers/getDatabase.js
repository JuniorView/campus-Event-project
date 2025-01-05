const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('Database already connected');
        return;
    }
    try {
        await  mongoose.connect('mongodb://127.0.0.1:27017/campusEvents');

        isConnected = true;
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        throw error; // Fehler weiterleiten
    }
};

const closeDB = async () => {
    if (!isConnected) {
        console.log('Database connection is already closed');
        return;
    }
    try {
        await mongoose.connection.close();
        isConnected = false;
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error closing the database connection:', error.message);
        throw error; // Fehler weiterleiten
    }
};

module.exports = { connectDB, closeDB };