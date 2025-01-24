const fs = require('fs'); // Modul für Dateioperationen
const path = require('path');
const filePath = path.join(__dirname, '../data.json');

const userService = {
    getAllUsers(){
        return JSON.parse(fs.readFileSync(filePath, 'utf8')).user;
    },

    getUserByEmail(email){
        const users = this.getAllUsers();
        if (!users){
            return {error: 'Something went wrong', status:500};
        }
        // Find the event by name
        for (const current of users) {
            if (current.email=== email) {
                return current;
            }
        }
        return {error: 'User not found', status:404};
    },
    getUserById(id){
        const users = this.getAllUsers();
        if (!users){
            return {error: 'Something went wrong', status:500};
        }
        // Find the event by name
        for (const current of users) {
            if (current.id === id) {
                return current;
            }
        }
        return {error: 'User not found', status:404};
    }
}
module.exports = userService;