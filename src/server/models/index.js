const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(module.filename);
const db = {};
const User = require("./user.js").User;
const Feedback = require("./feedback.js").Feedback;

const sequelize = new Sequelize(
  process.env.DATABASE_URL ||
    "postgres://postgres:admin@localhost:5432/feedback-dev"
);

fs.readdirSync(__dirname)
  .filter(
    file =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach(file => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
module.exports.Feedback = Feedback;
module.exports.User = User;
