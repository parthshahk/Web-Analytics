//Import Dependencies
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const expressSession = require('express-session');
const randomstring = require("randomstring");
const cors = require('cors')

// Models
const User = require('./models/User');
const Report = require('./models/Report');

// Initialize App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
    secret: 'webanalyticspass',
    resave: false,
    saveUninitialized: false
}));
app.use(cors());

// Initialize Database
mongoose.connect('mongodb://localhost/wanalytics', {useNewUrlParser: true});
let db = mongoose.connection;
db.once('open', () => console.log("Database Connected"));
db.on('error', err => console.log(err));

// Static Folders
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Homepage
app.get("/", (req, res) => {
    if(req.session.auth == true){
        res.redirect("/dashboard");
    }else{
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
});

// Signup
app.post("/signup", (req, res) => {
    User.findOne({email: req.body.email}, (err, existence) => {
        if(!existence){
            
            let user = new User();
            user.name = req.body.name;
            user.email = req.body.email;

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(req.body.password, salt);

            user.password = hash;
            user.save(err => {
                if(!err){
                    res.redirect(307, '/login');
                }else{
                    console.log(err);
                }
            })
        }else{
            res.redirect('/#userExists');
        }
    });
});

// Login
app.post("/login", (req, res) => {

    User.findOne({email: req.body.email}, (err, user) => {
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                req.session.auth = true;
                req.session.user = user.email;
                res.redirect("/dashboard");
            }else{
                res.redirect('/#incorrectPassword');
            }
        }else{
            res.redirect('/#userDoesNotExist');
        }
    })
});

// Logout
app.get("/logout", (req, res) => {
    if(req.session.auth = true){
        req.session.auth = false;
    }
    res.redirect("/#logout");
});

// Dashboard
app.get("/dashboard", (req, res) => {
    if(req.session.auth == true){
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    }else{
        res.redirect("/");
    }
});

// Assets
app.get("/assets", (req, res) => {
    if(req.session.auth == true){
        res.sendFile(path.join(__dirname, 'public', 'assets.html'));
    }else{
        res.redirect("/");
    }
});

// Installation
app.get("/installation", (req, res) => {
    if(req.session.auth == true){
        res.sendFile(path.join(__dirname, 'public', 'installation.html'));
    }else{
        res.redirect("/");
    }
});

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

// Anaytics
app.get('/analytics.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'client' ,'analytics.js'));
});

// Client JS
app.get('/client.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'client' ,'client.min.js'));
});

// In-View JS
app.get('/in-view.min.js', (req, res) => {
    res.sendFile(path.join(__dirname, 'client' ,'in-view.min.js'));
});

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

// Initialize Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server Running");
});