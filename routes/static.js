const path = require('path');
const express = require('express');
const config = require('../config');

module.exports = function(app){

    // Static Folders
    app.use('/css', express.static(path.join(config.dirname, 'public', 'css')));
    app.use('/js', express.static(path.join(config.dirname, 'public', 'js')));

    // Dashboard
    app.get("/dashboard", (req, res) => {
        if(req.session.auth == true){
            res.sendFile(path.join(config.dirname, 'public', 'dashboard.html'));
        }else{
            res.redirect("/");
        }
    });

    // Geo Frame
    app.get("/geolocation", (req, res) => {
        if(req.session.auth == true){
            res.sendFile(path.join(config.dirname, 'public', 'geolocation.html'));
        }else{
            res.redirect("/");
        }
    });

    // Assets
    app.get("/assets", (req, res) => {
        if(req.session.auth == true){
            res.sendFile(path.join(config.dirname, 'public', 'assets.html'));
        }else{
            res.redirect("/");
        }
    });

    // Installation
    app.get("/installation", (req, res) => {
        if(req.session.auth == true){
            res.sendFile(path.join(config.dirname, 'public', 'installation.html'));
        }else{
            res.redirect("/");
        }
    });

    // Events
    app.get("/events", (req, res) => {
        if(req.session.auth == true){
            res.sendFile(path.join(config.dirname, 'public', 'events.html'));
        }else{
            res.redirect("/");
        }
    });

    // Event Analysis
    app.get("/eventAnalysis", (req, res) => {
        if(req.session.auth == true){
            res.sendFile(path.join(config.dirname, 'public', 'eventAnalysis.html'));
        }else{
            res.redirect("/");
        }
    });

    // Logo
    app.get("/logo.png", (req, res) => {
        res.sendFile(path.join(config.dirname, 'public', 'logo.png'));
    });

    // Anaytics
    app.get('/analytics.js', (req, res) => {
        res.sendFile(path.join(config.dirname, 'client' ,'analytics.js'));
    });

    // Client JS
    app.get('/client.min.js', (req, res) => {
        res.sendFile(path.join(config.dirname, 'client' ,'client.min.js'));
    });

    // In-View JS
    app.get('/in-view.min.js', (req, res) => {
        res.sendFile(path.join(config.dirname, 'client' ,'in-view.min.js'));
    });

}