const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    eventId: {
        type: String
    },
    triggers: {
        type: Array // date, data
    }
});

let Event = module.exports = mongoose.model('Event', reportSchema);