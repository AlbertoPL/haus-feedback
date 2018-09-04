const bcrypt = require("bcrypt");
const axios = require("axios");
const Model = require("../models/index.js");

module.exports.signup = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  if (!username || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please fill out all the fields."
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please make sure your password matches."
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const newUser = {
    username: username,
    salt: salt,
    password: hashedPassword
  };

  Model.Users.create(newUser)
    .then(token => {
      return res.json({
        success: true,
        message: "You have successfully logged in!",
        token
      });
    })
    .catch(error => {
      return res.status(400).json({
        success: false,
        message: "Could not process the form."
      });
    });
};

module.exports.getFeedback = (username, req, res) => {
  Model.Feedbacks.findAll({
    where: {
      username: username
    }
  })
    .then(feedback => {
      return res.json({
        success: true,
        feedback:
          feedback.length > 0
            ? feedback.map(f => {
                return f.text;
              })
            : []
      });
    })
    .error(err => {
      return res.json({
        success: false,
        message: "An error occurred getting feedback from the database"
      });
    });
};

module.exports.postFeedback = (id, req, res) => {
  const newFeedback = {
    username: req.body.username,
    text: req.body.text
  };

  Model.Feedbacks.create(newFeedback)
    .then(() => {
      axios.post(
        "https://hooks.slack.com/services/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",
        {
          text: `${req.body.username}: ${req.body.text}`
        }
      ); //if it fails that's okay
      return res.json({
        success: true
      });
    })
    .catch(error => {
      return res.json({
        success: false
      });
    });
};
