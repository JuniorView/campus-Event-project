const fs = require('fs'); // Modul für Dateioperationen
const path = require('path');
const filePath = path.join(__dirname, '../data.json');

const eventService = {
    getAllEvents(){
        return JSON.parse(fs.readFileSync(filePath, 'utf8')).events;
    },

    getEventByName (eventName) {
        const events = this.getAllEvents();
        if (!events){
            return {error: 'Something went wrong', status:500};
        }
        // Find the event by name
        for (const current of events) {
            if (current.name.toLowerCase() === eventName.toLowerCase()) {
                return current;
            }
        }
        return {error: 'Event not found', status:404};
    }
}
module.exports = eventService;