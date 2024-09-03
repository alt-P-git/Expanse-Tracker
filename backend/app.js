const express = require('express')
const cors = require('cors');
const { db } = require('./db/db');
const {readdirSync} = require('fs')
const app = express()
const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./models/userSchema");
const checkAuthentication = require('./middleware/checkAuthentication');


require('dotenv').config()

const PORT = process.env.PORT
const clientid = process.env.GOOGLE_CLIENT_ID;
const clientsecret = process.env.GOOGLE_CLIENT_SECRET;

const appUrl = process.env.APP_URL;
const reactAppUrl = process.env.REACT_APP_URL;

const authRoutes = require('./routes/authRoutes');

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin
        // (like mobile apps or curl requests)
        console.log(origin);
        if (!origin) return callback(null, true);
        return callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(express.json())

//setup session
app.use(session({
    secret: "nge46uywse4za578uesdf2q3lbvsjryio56wergxcmgh",
    resave: false,
    saveUninitialized: true
}));

//setup passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID: clientid,
        clientSecret: clientsecret,
        callbackURL: `${appUrl}/auth/google/callback`,
        scope: ["profile", "email"]
    },
        async (accessToken, refreshToken, profile, done) => {
            console.log(profile);
            try {
                let user = await userdb.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                } else {
                    const newUser = new userdb({
                        googleId: profile.id,
                        displayName: profile.displayName,
                        email: profile.emails[0].value,
                        image: profile.photos[0].value
                    });

                    await newUser.save();
                    return done(null, newUser);
                }
            } catch (error) {
                return done(error, null);
            }
        })
);

/* function checkAuthentication(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log("User not authenticated");
        res.status(401).send("User not authenticated");
    }
} */

//serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.use(authRoutes);

//routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)))

const server = () => {
    db()
    app.listen(PORT, () => {
        console.log('listening to port:', PORT)
    })
}

server()