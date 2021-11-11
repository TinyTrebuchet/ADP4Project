const express = require('express');
const app = express();
const path = require('path');
const cookieSession = require('cookie-session');
const flash = require('connect-flash');
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
app.use(flash());
app.use(cookieParser());

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
    let sls = await salons.find({});
    let myapps = await appointments.find({ username: req.session.email });
    let currDate = new Date();

    let validApps = [];
    for (let apps of myapps) {
        let appDate = stringToDate(apps.date, apps.time);
        if (appDate >= currDate) {
            validApps.push(apps);
        }
    }
    let loggedIn = false;
    if (req.session.email) {
        loggedIn = true;
    }


    res.render("index.ejs", { sls, loggedIn, validApps, message: req.flash('info') });

    // res.sendFile(path.join(__dirname, "index.html"));
})


app.get('/contributors', async (req, res) => {
    res.render('contributors.ejs');
})

app.post('/login', async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;
    const isExisting = await users.findOne({ email: email });
    if (!isExisting) {
        // flash the message says no user with this username
        req.flash('info', "Invalid Credentials");
        res.redirect('/');
    }
    else if (isExisting.password == password) {
        req.session.email = email;
        // document.cookie = "email=" + email + ";";
        req.flash('info', `Hey, welcome back ${isExisting.name}`);
        res.redirect('/')
    }
    else {
        req.flash('info', "Invalid Credentials");
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
        req.flash('info', "Account already signedup with email");

    }
    else {
        const user = new users({
            name: username,
            email: email,
            password: password
        })

        // flash the message says new entry created
        req.flash('info', "Successfully signed Up");
        await user.save();
        console.log("new entry created");
    }

    res.redirect('/');
})

app.post('/logout', async (req, res) => {
    req.session.email = null;
    res.redirect('/');
})

app.get('/home', async (req, res) => {
    res.redirect('/');
})

app.post('/appointment', async (req, res) => {
    let { totalCost, appointmentTime, appointmentDate, services, salonName } = req.cookies;
    services = services.split(",");

    const isExisting = await appointments.findOne({ salon: salonName, time: appointmentTime, date: appointmentDate });
    if (isExisting) {
        // flash, sorry time in not available for this salon
        req.flash('info', "Sorry, choosen time is already booked");
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
        req.flash('info', "Appointment Booked");

    }
    res.clearCookie("appointmentTime");
    res.clearCookie("appointmentDate");
    res.redirect("/");
});


app.post('/delete', async (req, res) => {
    let id = req.body.id;
    let app = await appointments.findOneAndDelete({ _id: id });
    req.flash("info", `Appoinment at ${app.salon} on ${app.date}, ${app.time} is cancelled.`);
    res.redirect('/');
})

app.listen(3000, () => {
    console.log("STARTED");
})


function getTodayDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

    today = dd + '-' + mm + '-' + yyyy;
    return today;

}

function stringToDate(str, time) {
    let arr = str.split('-');
    let arr_time = time.split(":");
    let t = arr_time[0];
    if (time.slice(-2) == "PM" && t != 12) {
        t += 12;
    }
    let newDate = new Date(parseInt(arr[2]), parseInt(arr[1]) - 1, parseInt(arr[0]), t);
    return newDate;
}