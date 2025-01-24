const fs = require('fs'); // Modul für Dateioperationen
const path = require('path');
const filePath = path.join(__dirname, '../data.json');
const eventService = require(path.resolve('./services/eventService'));

const shiftService = {
    getAllShifts(){
        return JSON.parse(fs.readFileSync(filePath, 'utf8')).shifts;
    },

    getShiftsByEventAndRole(eventName, role){
        const shifts = this.getAllShifts();
        const event = eventService.getEventByName(eventName);
        if (!shifts || !event){
            return JSON.parse("{error: 'Something went wrong', status:500}");
        }

        // Fetch the shift for the event and role
        let correctShifts = [];
        for (const current of shifts) {
            if (current.event_id === event.id && current.role.toLowerCase() === role.toLowerCase()) {
                return current;
            }
        }
            return JSON.parse("{error: 'Shifts not found for this event and role', status:400}");
    },

    setTimeslot(eventName, role, timeslotId, userId, status){
        //ToDo:Write into a file

    }
}
module.exports = shiftService;