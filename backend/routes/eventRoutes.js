const express = require('express');
const eventController = require('../controllers/eventController'); 
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
const { registerShift, unregisterShift, getShifts, getAvailableShifts } = require('../controllers/eventController'); 

// Register for a shift 
router.post('/register', authMiddleware, eventController.registerShift);

// Unregister for a shift 
router.post('/unregister', authMiddleware, eventController.unregisterShift);  

// Get available shifts for a specific event and role
router.get('/available-shifts', eventController.getAvailableShifts);

// Fetch event details by event name
router.get('/event-details/:eventName', eventController.getEventDetailsByName);

// Get all shifts for a specific event and role
router.get('/get-shifts', eventController.getShifts);

// Get all events
router.get('/', eventController.getAllEvents);

module.exports = router;
