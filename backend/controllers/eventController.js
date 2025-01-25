const eventService = require('../services/eventService');
const shiftService = require('../services/shiftService');
const userService = require('../services/userService');

const eventController = {
    registerShift: async (req, res) => {
        const { startTime, endTime, event, role } = req.body;
        const user = req.user;

        const shifts = shiftService.getShiftsByEventAndRole(event, role);
        if (shifts.error) {
            return res.status(shifts.status).json(shifts.error);
        }

        let timeSlot = null;
        for (const shift of shifts.timeslot) {
            if (shift.start === startTime && shift.end === endTime){
                timeSlot = shift;
            }

        }
        if (!timeSlot || timeSlot.status !== 'available') {
            return res.status(400).json({ message: 'Shift is already taken or not available' });
        }

        shiftService.setTimeslot(event, role, timeSlot.id, user.id, "registered");

        res.status(200).json({ message: 'Shift registered successfully' });
    },

    // Fetch all shifts for a specific event and role
    getShifts: async (req, res) => {
        const { eventName, role } = req.query;

        if (!eventName || !role) {
            return res.status(400).json({ message: "Missing eventName or role in the query" });
        }
        // get shifts
        const shifts = shiftService.getShiftsByEventAndRole(eventName, role);
        if (shifts.error) {
            return res.status(shifts.status).json(shifts.error);
        }


        // Map the timeSlots and populate user details
        const updatedSlots = shifts.timeslot.map(slot => {
            let user = null;
            if (slot.user_id !== 0) {
                user = userService.getUserById(slot.user_id);
                if (user.error) {
                    return res.status(user.status).json(user.error); //this is not good, idk what else to do
                }
            }

            return {
                _id: slot.id,
                start: slot.start,
                end: slot.end,
                user: (slot.user_id && slot.user_id !== 0) ? `${user.firstName} ${user.lastName}` : null, // Show user's name if registered
                status: slot.status,
                conflict: slot.conflict
            };
        });
        res.status(200).json({timeSlots: updatedSlots});
    },

    // Get available shifts for a specific event and role
    getAvailableShifts: async (req, res) => {
        const { eventName, role } = req.query;

        if (!eventName || !role) {
            return res.status(400).json({ message: "Missing eventName or role in the query" });
        }

        const shifts = shiftService.getShiftsByEventAndRole(eventName, role);
        if (shifts.error) {
            return res.status(shifts.status).json(shifts.error);
        }

        // Filter for available slots
        const availableSlots = shift.timeSlots.filter(ts => ts.status === 'available');
        res.status(200).json({availableSlots});
    },

    // Get event details by name
    getEventDetailsByName: async (req, res) => {
        const { eventName } = req.params;

        const sanitizedEventName = eventName.replace(/-/g, ' ');
        const event = eventService.getEventByName(sanitizedEventName);

        if (event.error) {
            return res.status(event.status).json(event.error);
        }
        return res.status(200).json({event});
    },

    // Fetch all events
    getAllEvents: async (req, res) => {
        const events = eventService.getAllEvents();
        if (events.error) {
            return res.status(events.status).json(events.error);
        }
        res.status(200).json(events);
    },

    unregisterShift: async (req, res) => {
        const { startTime, endTime, event, role } = req.body;
        const user = req.user;


        const shifts = shiftService.getShiftsByEventAndRole(event, role);
        if (shifts.error) {
            return res.status(shifts.status).json(shifts.error);
        }

        let timeSlot = null;
        for (const shift of shifts.timeslot) {
            if (shift.start === startTime && shift.end === endTime){
                timeSlot = shift;
                break;
            }

        }
        if (!timeSlot || timeSlot.status !== 'registered') {
            return res.status(400).json({ message: 'Shift is already unregistered or not available' });
        }

        shiftService.setTimeslot(event, role, timeSlot.id, user.id, "available");

        res.status(200).json({ message: 'Shift unregistered successfully' });
    },

    
};

module.exports = eventController;
