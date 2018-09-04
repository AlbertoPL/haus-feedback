"use strict";
const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Feedback = sequelize.define(
    "Feedbacks",
    {
      username: {
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    },
    {}
  );

  return Feedback;
};
