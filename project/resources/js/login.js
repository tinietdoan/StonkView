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


app.get("/register", (req, res) => {
    Location.find({}, (err, allLocations) => {
        if (err) {
            console.log(err);
        } else {
            res.render("register", {
                locations: allLocations,
                title: "Sign Up"
            });
        }
    })
})

// ====== Login/Register ======
//register
app.post("/register", (req, res) => {
    var newUser = {
        name: req.body.name,
        email: req.body.email,
        security: req.body.security,
        isAdmin: false
    }

    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            return res.render("register")
        } else {
            req.flash("success", "Welcome to Stonkview " + user.email);
            res.redirect("/index.html")
            console.log(user.email);
            console.log(user.password);
        }
    })
})

//login
app.get("/login", (req, res) => {
    Location.find({}, (err, allLocations) => {
        if (err) {
            console.log(err);
        } else {
            res.render("login", {
                locations: allLocations,
                title: "Log In"
            });
        }
    })
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/index.html",
    failureRedirect: "/login.html"
}), function (req, res) {});

//Logout
app.get("/logout", app.isLoggedIn, (req, res) => {
    req.logout();
    req.flash("success", "Logged You Out!")
    res.redirect("/login.html");
})