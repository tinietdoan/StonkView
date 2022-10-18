function openForm() {
    document.getElementById("myForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("myForm").style.display = "none";
}

var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    async = require("async"),
    passportLocalMongoose = require("passport-local-mongoose"),
    flash = require("connect-flash"),

const dbUrl = process.env.DB_URL;
const dbLocal = "mongodb://localhost/stonkview";
mongoose.connect(dbUrl, {
    'useNewUrlParser': true
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(flash());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
