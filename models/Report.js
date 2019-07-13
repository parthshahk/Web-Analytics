const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    assetId: {
        type: String
    },
    date: {
        type: String
    },
    user: {
        type: Object
    },
    activity: {
        type: Array     // Array of activities of each visit
    },
    instanceCookie: {
        type: String
    }
});

let Report = module.exports = mongoose.model('Report', reportSchema);