const fs = require('fs'); // Modul für Dateioperationen
const path = require('path');
const filePath = path.join(__dirname, '../data.json');
const eventService = require('./eventService');

const shiftService = {
    getAllShifts(){
        return JSON.parse(fs.readFileSync(filePath, 'utf8')).shifts;
    },

    getShiftsByEventAndRole(eventName, role){
        const shifts = this.getAllShifts();
        const event = eventService.getEventByName(eventName);
        if (!shifts || !event){
            return {error: 'Something went wrong', status:500};
        }

        // Fetch the shift for the event and role
        for (const current of shifts) {
            if (current.event_id === event.id && current.role.toLowerCase() === role.toLowerCase()) {
                return current;
            }
        }
            return {error: 'Shifts not found for this event and role', status:400};
    },

    setTimeslot(eventName, role, timeslotId, userId, status){
        let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const eventId = eventService.getEventByName(eventName).id;
        let shiftIndex = 0;
        let slotIndex = 0;
        for (const currentShift in data.shifts) {
            if (data.shifts[currentShift].event_id === eventId &&
                data.shifts[currentShift].role.toLowerCase() === role.toLowerCase()) {
                shiftIndex = currentShift;
                break;
            }
        }
        const timeslot = data.shifts[shiftIndex].timeslot;
        for (const currentSlot in timeslot) {
            if (timeslot[currentSlot].id === timeslotId){
                slotIndex = currentSlot;
                break;
            }
        }
        data.shifts[shiftIndex].timeslot[slotIndex].user_id = userId;
        data.shifts[shiftIndex].timeslot[slotIndex].status = status;
        fs.writeFileSync(filePath, JSON.stringify(data));
    },

    getShiftsByEvent(eventName){
        const shifts = this.getAllShifts();
        const event = eventService.getEventByName(eventName);
        if (!shifts || !event){
            return {error: 'Something went wrong', status:500};
        }

        // Fetch the shift for the event and role
        let shiftNames = [];
        for (const current of shifts) {
            if (current.event_id === event.id) {
                shiftNames.join(current.role);
            }
        }
        if (shiftNames.length > 0) {
            return shiftNames;
        }
        return {error: 'Shifts not found for this event', status:400};

    },

    getShiftByUserId(userId){
        const shifts = this.getAllShifts(); // Get all shifts
        if (!shifts) {
            return { error: 'Something went wrong', status: 500 }; // Handle case if shifts aren't found
        }
    
        let response = []; // Create an array to store the user's shifts
    
        // Loop through each shift
        for (const currentShift of shifts) {
            let timeslots = [];
    
            // Loop through each timeslot of the shift
            for (const currentTimeslot of currentShift.timeslot) {
                // If the timeslot matches the userId, add it to the timeslots array
                if (currentTimeslot.user_id === parseInt(userId)) {
                    timeslots.push({
                        id: currentTimeslot.id,
                        start: currentTimeslot.start,
                        end: currentTimeslot.end,
                        status: currentTimeslot.status
                    });
                }
            }
    
            // If there are any matching timeslots, push them to the response array along with the role
            if (timeslots.length > 0) {
                response.push({
                    "event_id": currentShift.event_id,
                    "role": currentShift.role, // Added role name here
                    "timeslot": timeslots
                });
            }
        }
    
        // If no shifts were found, return an error
        if (response.length === 0) {
            return { error: 'No shifts found for this user', status: 400 };
        }
    
        // Return the user's shifts
        return response;

    }
};


module.exports = shiftService;