const dotenv = require("dotenv");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const path = require("path");
const api = require("./api");
const app = express();

const Model = require("./models/index.js");

passport.use(
  new LocalStrategy((username, password, done) => {
    Model.Users.findOne({
      where: {
        username: username
      }
    }).then(function(user) {
      if (user === null) {
        return done(null, false, { message: "Incorrect credentials." });
      }

      var hashedPassword = bcrypt.hashSync(password, user.salt);

      if (user.password === hashedPassword) {
        return done(null, user);
      }

      return done(null, false, { message: "Incorrect credentials." });
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Model.Users.findOne({
    where: {
      id: id
    }
  }).then(user => {
    if (user == null) {
      done(new Error("Wrong user id."));
    }

    done(null, user);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  require("express-session")({
    secret: "some secret",
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static("dist"));

app.post("/signup", api.signup);

app.post("/login", (req, res, next) => {
  return passport.authenticate(
    "local",
    {
      successRedirect: "/feedback",
      failureRedirect: "/"
    },
    (err, token) => {
      if (err || !token) {
        if (err && err.name === "IncorrectCredentialsError") {
          return res.status(400).json({
            success: false,
            message: err.message
          });
        }

        return res.status(400).json({
          success: false,
          message: "Could not process the form."
        });
      }
      return res.json({
        success: true,
        message: "You have successfully logged in!",
        token
      });
    }
  )(req, res, next);
});

app.post("/api/feedback", (req, res) => {
  Model.Users.findOne({
    where: {
      username: req.body.username,
      password: req.body.password
    }
  }).then(function(user) {
    if (user) {
      return api.postFeedback(user.id, req, res);
    } else {
      res.status(401).json({
        success: false,
        message: "You must be logged in first."
      });
    }
  });
});

app.get("/api/feedback", (req, res) => {
  Model.Users.findOne({
    where: {
      username: req.headers["authorization"].split(" ")[0],
      password: req.headers["authorization"].split(" ")[1]
    }
  }).then(function(user) {
    if (user) {
      return api.getFeedback(user.username, req, res);
    } else {
      return res.status(401).json({
        success: false,
        message: "You must be logged in first."
      });
    }
  });
});

app.get("/*", (req, res, next) => {
  const routePath = path.join(__dirname + "/../index.html");
  res.sendFile(routePath);
});

app.listen(process.env.PORT, () =>
  console.log(`Listening on port ${process.env.PORT}!`)
);
