if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const request = require('request');
const fetch = require("node-fetch");
const axios = require('axios');
var ObjectId = require('mongodb').ObjectId;
const bodyParser = require('body-parser');
const http = require('http').Server(app);
const io = require('socket.io')(http);
//DB

const mongoose = require('mongoose');
const db = process.env.DATABASE_url
mongoose
    .connect(db, { 
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
      })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));
//
const Notification = require("./models/notifs.js");
const User = require("./models/user.js");
const Stock = require("./models/stocks.js")
const Message = require("./models/message.js")

var port = process.env.PORT || 3001;

require('./passport-config')(passport);
const { ensureAuthenticated, forwardAuthenticated } = require('../project/resources/js/auth');

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/")); //This line is necessary for us to use relative paths and access our resources directory
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use(function (req, res, next) {
    res.locals.currUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.alert = req.flash("alert");
    res.locals.success = req.flash("success");
    next();
})

app.use(methodOverride('_method'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))


function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

app.get('/', ensureAuthenticated, (req, res) => {
    var stockArray = [];
    var stocksLength = req.user.stocks.length;
    User.findById(req.user._id, (err, user) => {
        var stocks = user.stocks;
        //console.log("Stocks order", stocks)
        for (var i = 0; i < stocksLength; i++) {
            axios({
                url: `https://finnhub.io/api/v1/quote?symbol=${stocks[i]}&token=c0qniqv48v6q5go2lo6g`,
                method: 'GET',
                dataType: 'json',
            })
            .then(items => {
                //console.log(items.data);
                stockArray.push(items.data);
                //console.log(stockArray);
            })
            .catch(error => {
                console.log(error);
            })
        }
        //console.log(items.data);
    })
    //console.log("Stock array", stockArray)
    axios({
        url: `https://finnhub.io/api/v1/news?category=general&token=c0qniqv48v6q5go2lo6g`,
        method: 'GET',
        dataType: 'json',
    })
    .then(items => {
        //console.log(stockArray);
        sleep(1000)
        res.status(200).render('index', {
            newsStories: items.data,
            stocksPortfolio: stockArray,
            stocksOwned: req.user.stocks 
        })
    })
    .catch(error => {
        console.log(error);
        res.status(400).render('index', {
            newsStories: '',
            stocksPortfolio: '',
            stocksOwned: ''
        })
    })
})

// app.get('/', ensureAuthenticated, (req, res) => {
//     //console.log(req.user._id)
//     //console.log(req.user._id)
//     // var requests = [`https://finnhub.io/api/v1/news?category=general&token=c0qniqv48v6q5go2lo6g`, `https://finnhub.io/api/v1/quote?symbol=TSLA&token=c0qniqv48v6q5go2lo6g`, `https://finnhub.io/api/v1/quote?symbol=GME&token=c0qniqv48v6q5go2lo6g`]
//     // var stockArray = [];
//     // User.findById(req.user._id, (err, user) => {
//     //     var stocksLength = user.stocks.length;
//     //     var stocks = user.stocks;
//     //     for (var i = 0; i < stocksLength; i++) {
//     //         requests.push(``)
//     //     }
//     //     console.log(stockArray);
//     // });
//     // console.log("Requests", requests);
//     // axios.all(requests).then(axios.spread( 
//     //     function(res1, res2, res3) {
//     //         console.log(res1);
//     //         console.log(res2);
//     //         console.log(res3);
//     //     }
        
//     // )).catch(errors => {
//     //     // react on errors.
//     //     console.log("Error", err);
//     // })
//     //console.log(req.user._id)
//     axios({
//         url: `https://finnhub.io/api/v1/news?category=general&token=c0qniqv48v6q5go2lo6g`,
//         method: 'GET',
//         dataType: 'json',
//     })
//     .then(items => {
//         var stockArray = [];
//         User.findById(req.user._id, (err, user) => {
//             var stocksLength = user.stocks.length;
//             var stocks = user.stocks;
//             for (var i = 0; i < stocksLength; i++) {
//                 axios({
//                     url: `https://finnhub.io/api/v1/quote?symbol=${stocks[i]}&token=c0qniqv48v6q5go2lo6g`,
//                     method: 'GET',
//                     dataType: 'json',
//                 })
//                 .then(items => {
//                     console.log(items.data);
//                     stockArray.push(items.data);
//                     console.log(stockArray);
//                 })
//                 .catch(error => {
//                     console.log(error);
//                 })
//             }
//             console.log(stockArray);
//             //console.log(items.data);
//         })
//         res.render('index', {
//             newsStories: items.data,
//             stocksPortfolio: stockArray,
//             stocksOwned: req.user.stocks 
//         })
//     })
//     .catch(error => {
//         console.log(error);
//         res.render('index', {
//             newsStories: '',
//             stocksPortfolio: '',
//             stocksOwned: ''
//         })
//     })
// })

app.put('/', ensureAuthenticated, (req, res) => {
    var ticker = req.body.tickerPortfolio;
    //console.log(ticker)
    User.findById(req.user._id, (err, user) => {
        if (err) {
            console.log(err)
        }
        else {
            console.log(ticker);
            user.stocks.push(ticker);
            user.save();
            console.log(user);
        }
    })
    res.redirect('/')
})

/*  ********************************
    ************* LOGIN ************
    ******************************** */
app.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login.ejs', {errors: false})
})

app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        errors: 'Wrong username or password'
    }) (req, res, next)
});

/*  ********************************
    *********** REGISTER ***********
    ******************************** */
app.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register.ejs', {errors: false})
})

app.post('/register', (req, res) => {
    const { name, email, password } = req.body;
    const stocks = [];
    const notifications = [];
    let errors = [];

    if (!name || !email || !password) {
      errors.push('Please enter all fields');
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password
      });
    } 
    else {
      User.findOne({ email: email }).then(user => {
        if (user) {
          errors.push('Email already exists');
          res.render('register', {
            errors,
            name,
            email,
            password
          });
        } else {
          const newUser = new User({
            name,
            email,
            password,
            stocks,
            notifications
          });
  
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              newUser.password = hash;
              newUser
                .save()
                .then(user => {
                  req.flash(
                    'success_msg',
                    'You are now registered and can log in'
                  );
                  res.redirect('/login');
                })
                .catch(err => console.log(err));
            });
          });
        }
      });
    }
});

/*  ********************************
    ************* LOGOUT ***********
    ******************************** */
app.delete('/logout', (req, res) => {
    req.logOut()
    req.flash('success_msg', 'You are logged out now')
    res.redirect('/login')
})

/*  ********************************
    ************* NEWS *************
    ******************************** */
app.get('/news', ensureAuthenticated, (req, res) => {
    res.status(200).render('news.ejs')
})

/*  ********************************
    ************ NETWORK ***********
    ******************************** */
app.get('/network', ensureAuthenticated, (req, res) => {
    Stock.find({}, function (err, docs) {
        if(err) {console.log(err)}
        else {

            res.status(200).render('network', {
               trades: docs
            });
        }
    })
})

app.post('/network/follow', ensureAuthenticated, (req, res) => {
    var userName = '';
    User.findById(req.user._id , function(err, docs) {
        if(err){
            console.log(err);
        }
        else{
            userName = docs.name
        }
    })
    sleep(5000);
    console.log("User Name: ", userName);
    var newStock = {

        userId: req.user._id,
        userDisplayName: req.user.name,
        stocksHeld: req.body.ticker,
        priceAdded: req.body.price,
        quantStocks: req.body.quantity
    }
    console.log("Stock :", newStock);

    Stock.create(newStock, (err, docs) => {
        if(err){console.log(err)}
        else {
            console.log("Trade Made")
        }
    })
    res.redirect('/network')
})

function priceData(url) {
    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject('Invalid status code <' + response.statusCode + '>');
            }
            resolve(body);
        });
    });
}

/*  ********************************
    ************ CHARTS ************
    ******************************** */
app.get('/charts', ensureAuthenticated, (req, res) => {
    /*var sample_db_req = [{name: 'john', stocks: ['tsla', 'gme', 'swsx']}, {name: 'bruh', stocks: ['tsla', 'gme', 'swsx']}, {name: 'Garfield', stocks: ['tsla', 'gme', 'swsx']} , {name: 'Odie', stocks: ['tsla', 'gme', 'swsx']}, {name: 'Pookie', stocks: ['tsla', 'gme', 'swsx']}];
    console.log(sample_db_req[0].stocks);
    res.render('charts', {
        data: sample_db_req[0].stocks,
    });
    console.log(req.query.stock);*/
    var ticker = req.query.ticker;
    console.log(ticker);
    //chartData = priceData(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c0qniqv48v6q5go2lo6g`)

    if(ticker) {
        axios({
            url: `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c0qniqv48v6q5go2lo6g`,
            method: 'GET',
            dataType: 'json',
        })
        .then(items => {
            console.log(items.data);
            res.status(200).render('charts', {
                data: items.data,
                stockTicker: ticker
            })
        })
        .catch(error => {
            console.log(error);
            res.status(400).render('charts', {
                data: '',
                stockTicker: ticker
            })
        })
    }
    else {
        res.render('charts', {
            data: '',
            stockTicker: ticker
        })
    }
    // request(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=c0qniqv48v6q5go2lo6g`, { json: true }, (err, res, body) => {
    //     if (err) { return console.log(err); }
    //     console.log(res.body.url);
    //     chartData = res;
    //     console.log("Executed: "+ res.body.c);
    // });
    // await new Promise(r => setTimeout(r, 2000));
    // console.log('Started');
    // console.log(chartData.body.c);
    
})

/*  ********************************
    *********** MESSAGING **********
    ******************************** */

app.get('/messaging', ensureAuthenticated,(req, res) => {
    User.findById(req.user._id, (err, user) => {
        Message.find({}, (err, messages) => {
            //console.log(messages)
            //res.send(messages)
            res.status(200).render('messaging', {
                name: req.user.name,
                data: messages
            })
        })
    })  
})

app.post('/messaging', (req, res) => {
    var message = new Message(req.body);
    message.save((err) => {
        if (err)
            sendStatus(500);
        //res.sendStatus(200);
        io.emit('message', req.body);
    })
    res.redirect('/messaging')
})

/*  ********************************
    ********* NOTIFICATIONS ********
    ******************************** */

// app.get('/notifications', ensureAuthenticated, (req, res) => {
//     var stockArray = [];
//     var priceData = [];
//     var notificationIDs = [];

//     // set stockArray and notificationIDs to user's schema data
//     User.findById(req.user._id, (err, user) => {
//         stockArray = req.user.stocks;
//         notificationIDs = req.user.notifications;
//     })
//     console.log(notificationIDs);

//     // get price data from finnhub
//     var stocksLength = user.stocks.length;
//     for (var i = 0; i < stocksLength; i++) {
//         axios({
//             url: `https://finnhub.io/api/v1/quote?symbol=${stocksArray[i]}&token=c0qniqv48v6q5go2lo6g`,
//             method: 'GET',
//             dataType: 'json',
//         })
//         .then(items => {
//             console.log(items.data);
//             priceData.push(items.data);
//             console.log(priceData);
//         })
//         .catch(error => {
//             console.log(error);
//         })
//     }

//     // find notification based on ID, append each notification scheme to an array
//     var notifsLength = user.notifications.length;
//     var tempNotif;
//     var userNotifs = [];
//     var lastDay;
//     if (notifsLength > 0) {
//         for (var i = 0; i < notifsLength; i++) {
//             tempNotif = Notification.findById(notificationIDs[i]);
//             userNotifs.push(tempNotif)

//             if (i = (notifsLength - 1)) {
//                 Notification.findById(notificationIDs[i], (err, notif) => {
//                     if (err) throw err;
//                     lastDate = notif.date;
//                 });
//             }
//         }
//     }
//     console.log(userNotifs);


//     // if new day and after market close, make new notification
//     var currDay = new Date.getDate();
//     var currMonth = new Date.getMonth();
//     var currYear = new Date.getFullYear();
//     var currHour = new Date.getHour();
//     var currDate = toString(currDay) + "/" + toString(currMonth) + "/" + toString(currYear);
    
//     if ((notifsLength===0) || (currDate != lastDate)) {
//         var newNotification = {
//             date: currDate
//         };

//         console.log(newNotification);
//         Notification.create(newNotification, (err, docs) => {
//             if(err){console.log(err)}
//             else {
//                 res.redirect('/notifications')
//             }
//         });
//     }
// });

   

/*  ********************************
    ************ PROFILE ***********
    ******************************** */
app.get('/account/:id', ensureAuthenticated, (req, res) => {
    //res.render('account.ejs')
    //console.log(req.params.id)
    User.findById(req.params.id, function (err, docs) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Result : ", docs);
            res.render("account", {
                title: "Profile",
                user: docs
            })
        }
    });
})

//Edit profile
app.get('/editprofile/:id', ensureAuthenticated, (req, res) => {
    User.findById(req.params.id, function (err, docs) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("editprofile", {
                title: "Edit Profile",
                user: docs
            })
        }
    });
})

//Edit profile
app.put("/editprofile/:id", ensureAuthenticated, (req, res) => {
    User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email
    }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(docs);
            req.flash("success", "Updated!");
            res.redirect("/account/" + req.params.id)
        }
    })
})

//Change password
app.get('/forgotpass/:id', ensureAuthenticated, (req, res) => {
    User.findById(req.params.id, function (err, docs) {
        if(err) {
            console.log(err);
        }
        else {
            res.render("forgotpass", {
                title: "Forgot Pass",
                user: docs
            })
        }
    });
})

app.put("/forgotpass/:id", ensureAuthenticated, async (req, res) => {
    console.log("Password: ", req.body.password)
    const hashedPassword = await bcrypt.hash(req.body.password,10)
    console.log(hashedPassword)
    User.findByIdAndUpdate(req.params.id, {
        password: hashedPassword
    }, (err, docs) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(docs);
            req.flash("success", "Updated!");
            res.redirect("/account/" + req.params.id)
        }
    })
})

io.on('connection', () =>{
    console.log('a user is connected')
})

// testing something if probably can delete this 
var server = http.listen(port, () => {
    console.log('server is running on port', server.address().port);
});
module.exports = server