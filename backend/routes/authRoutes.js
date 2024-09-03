
const express = require('express');
const passport = require('passport');
const router = express.Router();

const appUrl = process.env.APP_URL;
const reactAppUrl = process.env.REACT_APP_URL;

router.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

router.get("/auth/google/callback", passport.authenticate("google", {
    successRedirect: `${reactAppUrl}/dashboard`,
    failureRedirect: `${reactAppUrl}`
}));

router.get("/login/success", (req, res) => {
    console.log("User authenticated");
    console.log(req.user);
    if (req.user) {
        res.status(200).json({
            success: true,
            message: "User has successfully authenticated",
            user: req.user,
            cookies: req.cookies
        });
    } else {
        res.status(500).json({
            success: false,
            message: "User failed to authenticate"
        });
    }
});

router.get("/logout", (req, res) => {
    req.logOut((err) => {
        if (err) {
            return next(err);
        }
        res.redirect(reactAppUrl);
    });
});

router.get("/test", (req, res) => {
    res.send("Test route");
});

module.exports = router;