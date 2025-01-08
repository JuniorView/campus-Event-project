const Events = require('../models/eventModel'); // Corrected to 'Events'
const Shift = require('../models/shiftModel');


const eventController = {
    registerShift: async (req, res) => {
        try {
            console.log('Request Body:', req.body); // Log the request body for debugging
            const { startTime, endTime, event, role } = req.body;
            const user = req.user;
    
            // Convert to Date objects
            let start = new Date(startTime);
            let end = new Date(endTime);
    
            console.log("Parsed Start:", start, "Parsed End:", end);
    
            console.log("Querying for shift with:", event, role, "start:", start, "end:", end);
    
            // Find the specific shift for the event and role
            const shift = await Shift.findOne({
                event: { $regex: new RegExp(`^${event}$`, 'i') }, // Case-insensitive match for event
                role,
                "timeSlots.start": start,
                "timeSlots.end": end,
            });
    
            console.log("Matched Shift:", shift);
    
            if (!shift) {
                return res.status(404).json({ message: 'Shift not found' });
            }
    
            // Find the specific time slot in the shift
            const timeSlot = shift.timeSlots.find(
                ts => ts.start.getTime() === start.getTime() &&
                      ts.end.getTime() === end.getTime()
            );
    
            console.log("Matched TimeSlot:", timeSlot);
    
            if (!timeSlot || timeSlot.status !== 'available') {
                return res.status(400).json({ message: 'Shift is already taken or not available' });
            }
    
            // Update the time slot with user details
            timeSlot.status = 'registered';
            timeSlot.userId = user._id; // Set userId directly here
    
            // Save the updated shift document
            await shift.save();
    
            res.status(200).json({ message: 'Shift registered successfully' });
        } catch (error) {
            console.error('Error registering shift:', error);
            res.status(500).json({ message: 'Error registering shift', error: error.message });
        }
    },

    // Fetch all shifts for a specific event and role
    getShifts: async (req, res) => {
        try {
            console.log('User:', req.user); // Log user details
            console.log('Headers:', req.headers); // Log request headers
            const { eventName, role } = req.query;  // Extract eventName and role from query string
    
            if (!eventName || !role) {
                return res.status(400).json({ message: "Missing eventName or role in the query" });
            }
    
            // Find the event by name (case-insensitive)
            const event = await Events.findOne({
                name: { $regex: new RegExp(`^${eventName}$`, 'i') } // Case-insensitive search
            });
    
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
    
            // Fetch the shift for the event and role
            const shift = await Shift.findOne({
                event: event.name,
                role: role
            }).populate('timeSlots.userId', 'firstName lastName'); // Populate userId to get first and last names
    
            if (!shift) {
                return res.status(404).json({ message: 'Shifts not found for this event and role' });
            }
    
            // Map the timeSlots and populate user details
            const updatedSlots = shift.timeSlots.map(slot => {
                return {
                    _id: slot._id,
                    start: slot.start,
                    end: slot.end,
                    user: slot.userId ? `${slot.userId.firstName} ${slot.userId.lastName}` : null, // Show user's name if registered
                    status: slot.status,
                    conflict: slot.conflict
                };
            });
    
            res.status(200).json({ timeSlots: updatedSlots });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching shifts', error: error.message });
        }
    },

    // Get available shifts for a specific event and role
    getAvailableShifts: async (req, res) => {
        try {
            const { eventId, role } = req.query;
    
            console.log('eventId:', eventId, 'role:', role); // Debugging to see if params are correct
    
            // Find the shift based on eventId and role
            const shift = await Shift.findOne({ event: eventId, role });
    
            if (!shift) {
                return res.status(404).json({ message: 'Event or role not found' });
            }
    
            // Filter for available slots
            const availableSlots = shift.timeSlots.filter(ts => ts.status === 'available');
            res.status(200).json({ availableSlots });
        } catch (error) {
            res.status(500).json({ message: 'Error fetching available shifts', error: error.message });
        }
    },

    // Get event details by name
    getEventDetailsByName: async (req, res) => {
        try {
            const { eventName } = req.params;
    
            const sanitizedEventName = eventName.replace(/-/g, ' ');
    
            // Search for the event by name (case-insensitive)
            const event = await Events.findOne({ name: { $regex: new RegExp(`^${sanitizedEventName}$`, 'i') } });
    
            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }
    
            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching event details by name', error: error.message });
        }
    },

    


    // Fetch event details
    getEventDetails: async (req, res) => {
        try {
            const { eventId } = req.params;
            const event = await Events.findById(eventId);  // Changed to 'Events'

            if (!event) {
                return res.status(404).json({ message: 'Event not found' });
            }

            res.status(200).json(event);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching event details', error: error.message });
        }
    },

    // Fetch all events
    getAllEvents: async (req, res) => {
        try {
            const events = await Events.find({});  // Fetch all events from the database (corrected model)
            if (events.length === 0) {
                return res.status(404).json({ message: 'No events found' });
            }
            res.status(200).json(events);  // Send all events as JSON response
        } catch (error) {
            res.status(500).json({ message: 'Error fetching events', error: error.message });
        }
    },
    unregisterShift: async (req, res) => {
        try {
            console.log('Request Body to Unregister:', req.body); // Log the request body for debugging
            const { startTime, endTime, event, role } = req.body;
            const user = req.user;
    
            // Convert to Date objects
            let start = new Date(startTime);
            let end = new Date(endTime);
    
            console.log("Parsed Start:", start, "Parsed End:", end);
    
            console.log("Querying for shift with:", event, role, "start:", start, "end:", end);
    
            // Find the specific shift for the event and role
            const shift = await Shift.findOne({
                event: { $regex: new RegExp(`^${event}$`, 'i') }, // Case-insensitive match for event
                role,
                "timeSlots.start": start,
                "timeSlots.end": end,
            });
    
            console.log("Matched Shift:", shift);
    
            if (!shift) {
                return res.status(404).json({ message: 'Shift not found' });
            }
    
            // Find the specific time slot in the shift
            const timeSlot = shift.timeSlots.find(
                ts => ts.start.getTime() === start.getTime() &&
                    ts.end.getTime() === end.getTime()
            );
    
            console.log("Matched TimeSlot:", timeSlot);
    
            if (!timeSlot || timeSlot.status !== 'registered') {
                return res.status(400).json({ message: 'Shift is not registered or already unregistered' });
            }
    
            // Unregister the user from the shift
            timeSlot.status = 'available';
            timeSlot.userId = null; // Remove the userId to unregister
    
            // Save the updated shift document
            await shift.save();
    
            return res.status(200).json({ message: 'Shift unregistered successfully' }); // Ensure proper response
        } catch (error) {
            console.error('Error unregistering shift:', error);
            return res.status(500).json({ message: 'Error unregistering shift', error: error.message });
        }
    },

    
};

module.exports = eventController;
