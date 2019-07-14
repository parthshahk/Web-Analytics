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
    elements: {
        type: Array
    },
    instanceCookie: {
        type: String
    },
    visits: {
        type: Array
    }
});

let Report = module.exports = mongoose.model('Report', reportSchema);