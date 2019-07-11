//Import Dependencies
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const expressSession = require('express-session');

// Models
const User = require('./models/User');

// Initialize App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
    secret: 'webanalyticspass',
    resave: false,
    saveUninitialized: false
}));

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

// Initialize Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server Running");
});