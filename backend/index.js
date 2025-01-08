const express = require('express');
const cors = require('cors');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes'); 
const errorHandler = require('./middlewares/errorHandler');
const { connectDB } = require('./helpers/getDatabase');

const app = express();

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
}));
app.use(express.json());

// Session Management
app.use(session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }, 
}));

// Database Connection
(async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Failed to connect to database:', error.message);
        process.exit(1);
    }
})();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes); 

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
