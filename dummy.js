const express = require('express');
const mongoose = require('mongoose');
const config = require('./config');

const User = require('./models/User');
const Report = require('./models/Report');
const Event = require('./models/Event');

const app = express();

mongoose.connect(config.local_db, {useNewUrlParser: true});
let db = mongoose.connection;
db.once('open', () => console.log("Database Connected"));
db.on('error', err => console.log(err));


function randomDate(start, end) {
    var date1 = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    return date1.toISOString().substr(0, date1.toISOString().length -5)
}

function randomData(){

    var data = ['Mini Drafter', 'Mini Drafter', 'Arduino Uno', 'Arduino Uno', 'IR Sensor', 'IR Sensor', 'Bluetooth Module', 'Bread Board', 'Bread Board', 'Connecting Wires', 'Connecting Wires', 'CRO Probes', 'Jumper Pins', 'Jumper Pins', 'EG Kit', 'Basic Electronics Kit', 'Basic Electronics Kit']

    var purchased = []

    var total = Math.floor((Math.random() * 7)+1)
    
    for(var i=0; i<total; i++){
        purchased.push(data[Math.floor(Math.random() * data.length)]);
    }
    
    var purs = '';

    for(var i=0; i<purchased.length; i++){
        purs += `${purchased[i]},`
    }

    return purs.substr(0, purs.length-1)
}

for(var i=0; i<100; i++){
    

    Event.updateOne(
        {
            eventId: 'XDdedzd'
        },
        {
            $push: {
                triggers: {
                    date: randomDate(new Date(2019, 0, 1), new Date(2019, 12, 1)),
                    data: randomData()
                }
            }
        }, () => {}
    )
}

// Initialize Server
const PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => {
    console.log("Server Running");
});