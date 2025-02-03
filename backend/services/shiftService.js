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
        const shifts = this.getAllShifts();
        if (!shifts){
            return {error: 'Something went wrong', status:500};
        }

        let response = [];

        for (const currentShift of shifts) {
            let timeslots = [];
            for (const currentTimeslot of currentShift.timeslot) {
                if (currentTimeslot.user_id === userId) {
                    timeslots.push(currentTimeslot);
                }
            }
            let item = {"event_id": currentShift.event_id,
                "timeslot": timeslots};
            response.push(item);
        }
        if (response.length > 0) {
            return response;
        }
        return {error: 'no Shifts found', status:400};

    }
}

module.exports = shiftService;