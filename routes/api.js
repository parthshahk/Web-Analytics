const randomstring = require("randomstring");

// Models
const User = require('../models/User');

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
}