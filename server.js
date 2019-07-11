//Import Dependencies
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

// Initialize App
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Static Folders
app.use('/css', express.static(path.join(__dirname, 'public', 'css')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

// Homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Signup
app.post("/signup", (req, res) => {

    //check if user exist
    //add user 
    //redirect to /login

    console.log(req.body.name);
    res.end();
});

//login
app.post("/login", (req, res) => {
    //check if user exist
    //check password
    //login
    //redirect to dashboard
});

// Initialize Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log("Server Running");
});