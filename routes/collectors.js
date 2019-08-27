// Models
const Report = require('../models/Report');
const Event = require('../models/Event');
const cors = require('cors')

module.exports = function(app){

    // Collect Static Data
    app.post('/collectStatic', cors(), (req, res, next) => {
        
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+'T'+time;

        let report = new Report();
        report.assetId = req.body.asset;
        report.date = dateTime;
        report.user = req.body.data;
        report.instanceCookie = req.body.cookie;

        report.save();

        res.end();
    });

    //Collect Elements
    app.post('/collectElements', cors(), (req, res, next) => {
        Report.updateOne(
            {
                assetId: req.body.asset,
                instanceCookie: req.body.cookie
            },
            {
                $push: {
                    elements: req.body.data.currentElement
                }
            }, () => {}
        );
        res.end();
    });

    // Collect Visits
    app.post('/collectVisits', cors(), (req, res, next) => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+'T'+time;

        Report.updateOne(
            {
                assetId: req.body.asset,
                instanceCookie: req.body.cookie
            },
            {
                $push: {
                    visits: {
                        date: dateTime,
                        location: req.body.location,
                        referrer: req.body.referrer
                    }
                }
            }, () => {}
        );
        res.end();
    });

    // Collect Events
    app.get('/triggerEvent', cors(), (req, res, next) => {

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+'T'+time;

        if(req.query.data == null){
            
            Event.updateOne(
                {
                    eventId: req.query.id
                },
                {
                    $push: {
                        triggers: {
                            date: dateTime
                        }
                    }
                }, () => {}
            )

        }else{
            
            Event.updateOne(
                {
                    eventId: req.query.id
                },
                {
                    $push: {
                        triggers: {
                            date: dateTime,
                            data: req.query.data
                        }
                    }
                }, () => {}
            )

        }

        res.end()
    })
}