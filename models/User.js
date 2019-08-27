const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    assets : {
        type: Array
    },
    events : {
        type: Array
    }
});

let User = module.exports = mongoose.model('User', userSchema);