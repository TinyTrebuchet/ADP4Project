const express = require('express');
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');
// const flash = require('connect-flash');
var session = require('express-session')
const mongoose = require('mongoose');
const users = require('./models/user');
const appointments = require('./models/appointment');
const salons = require('./models/salon');
const cookieParser = require("cookie-parser");

mongoose.connect('mongodb://localhost:27017/salondb')
    .then(() => {
        console.log("Database connected");
    })
    .catch(err => {
        console.log("OH NO ERROR!!!");
        console.log(err);
    })

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))

app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    let sls = await salons.find({});
    let myapps = await appointments.find({ username: req.session.email });
    let loggedIn = false;
    if (req.session.email) {
        loggedIn = true;
    }
    res.render("index.ejs", { sls, loggedIn, myapps });

    // res.sendFile(path.join(__dirname, "index.html"));
})

app.post('/login', async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    const isExisting = await users.findOne({ email: email });
    if (!isExisting) {
        // flash the message says no user with this username
        res.redirect('/');
    }
    else if (isExisting.password == password) {
        req.session.email = email;
        // document.cookie = "email=" + email + ";";
        res.redirect('/')
    }
    else {
        // flash wrong password and redirect to login panel again
        res.redirect('/');
    }

});

app.post('/signin', async (req, res) => {
    const { username } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const isExisting = await users.findOne({ email: email });

    console.log(isExisting);

    if (isExisting) {
        // flash the message that user already exists with such username;

    }
    else {
        const user = new users({
            name: username,
            email: email,
            password: password
        })

        // flash the message says new entry created
        await user.save();
        console.log("new entry created");
    }

    res.redirect('/');
})

app.post('/logout', async (req, res) => {
    req.session.email = null;
    res.redirect('/');
})

app.post('/appointment', async (req, res) => {
    console.log(req.session.email);
    let { totalCost, appointmentTime, appointmentDate, services, salonName } = req.cookies;
    services = services.split(",");

    const isExisting = await appointments.findOne({ salon: salonName, time: appointmentTime, date: appointmentDate });
    if (isExisting) {
        // flash, sorry time in not available for this salon
        console.log("appointment already existed");
    }
    else {
        const appoin = new appointments({
            username: req.session.email,
            totalCost: totalCost,
            time: appointmentTime,
            date: appointmentDate,
            services: services,
            salon: salonName

        });
        await appoin.save();
    }
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("STARTED");
})