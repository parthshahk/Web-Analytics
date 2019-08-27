const randomstring = require("randomstring");

// Models
const User = require('../models/User');
const Event = require('../models/Event')

module.exports = function(app){
    // Add Asset
    app.post('/addAsset', (req, res) => {
        if(req.session.auth == true){
            var random = randomstring.generate({
                length: 7,
                charset: 'alphabetic'
            });
            User.updateOne({email: req.session.user}, {$push: {assets:{id: random, name: req.body.asset}}}, () => {
                res.redirect("/assets");
            });
        }else{
            res.redirect("/");
        }
    });

    // Get Assets
    app.get('/getAssets', (req, res) => {
        if(req.session.auth == true){
            User.findOne({email: req.session.user}, (err, user) => {
                res.json(user.assets);
            });
        }else{
            res.redirect('/');
        }
    });

    // Add Event
    app.post('/addEvent', (req, res) => {
        if(req.session.auth == true){
            var random = randomstring.generate({
                length: 7,
                charset: 'alphabetic'
            });
            User.updateOne({email: req.session.user}, {$push: {events:{id: random, name: req.body.event, type: req.body.eventType}}}, () => {
                let event = new Event();
                event.eventId = random;
                event.save();
                res.redirect("/events");
            });
        }else{
            res.redirect("/");
        }
    });

    // Get Events
    app.get('/getEvents', (req, res) => {
        if(req.session.auth == true){
            User.findOne({email: req.session.user}, (err, user) => {
                res.json(user.events);
            });
        }else{
            res.redirect('/');
        }
    });
}