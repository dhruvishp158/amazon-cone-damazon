const router = require("express").Router();
const User = require("../models/user");
const passport = require("passport");
const passportConfig = require("../config/passport");
router.get("/signup", function (req, res) {
  res.render("accounts/signup", {
    errors: req.flash("errors"),
  });
});

router.post("/signup", function (req, res, next) {
  let user = new User();
  user.profile.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;

  User.findOne({ email: req.body.email }, function (err, existingUser) {
    if (existingUser) {
      req.flash("errors", "Email address already exist");
      return res.redirect("/signup");
    } else {
      user.save(function (err, user) {
        if (err) return next(err);
        return res.redirect("/");
      });
    }
  });
});

router.get("/login", function (req, res) {
  //   if (req.user) return res.redirect("/");
  res.render("accounts/login", { message: req.flash("loginMessage") });
});

router.post(
  "/login",
  passport.authenticate("local-login", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

router.get("/profile", function (req, res) {
  User.findOne({ _id: req.user._id }, function (err, user) {
    if (err) {
      return next(err);
    }
    res.render("accounts/profile", { user: user });
  });
  //   res.json(req.user);
});
module.exports = router;
