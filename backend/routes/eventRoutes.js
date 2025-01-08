const express = require('express');
const eventController = require('../controllers/eventController');  // Correct import
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { registerShift, unregisterShift, getShifts, getAvailableShifts } = require('../controllers/eventController'); // Import unregisterShift

// Register for a shift (Ensure user is authenticated)
router.post('/register', authMiddleware, eventController.registerShift);
// Unregister Shift Route - NEW ROUTE
// Unregister for a shift (Ensure user is authenticated)
router.post('/unregister', authMiddleware, eventController.unregisterShift);  // Correct route

// Get available shifts for a specific event and role
router.get('/available-shifts', eventController.getAvailableShifts);

// Fetch event details by event name
router.get('/event-details/:eventName', eventController.getEventDetailsByName);

// Get all shifts for a specific event and role
router.get('/get-shifts', eventController.getShifts);

// Get all events
router.get('/', eventController.getAllEvents);

module.exports = router;
