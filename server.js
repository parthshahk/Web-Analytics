//Import Dependencies
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressSession = require('express-session');
const cors = require('cors')
const config = require('./config');

// Models
const User = require('./models/User');
const Report = require('./models/Report');
const Event = require('./models/Event');

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
mongoose.connect(config.local_db, {useNewUrlParser: true});
let db = mongoose.connection;
db.once('open', () => console.log("Database Connected"));
db.on('error', err => console.log(err));

//Routes
require('./routes/auth')(app);
require('./routes/static')(app);
require('./routes/api')(app);
require('./routes/collectors')(app);

// Initialize Server
const PORT = process.env.PORT || config.PORT;
app.listen(PORT, () => {
    console.log("Server Running");
});