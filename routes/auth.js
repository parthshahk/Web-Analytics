const path = require('path');
const bcrypt = require('bcryptjs');
const config = require('../config');

// Models
const User = require('../models/User');

module.exports = function(app){

    // Homepage
    app.get("/", (req, res) => {
        if(req.session.auth == true){
            res.redirect("/dashboard");
        }else{
            res.sendFile(path.join(config.dirname, 'public', 'index.html'));
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
}