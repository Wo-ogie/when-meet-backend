const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const env = process.env.NODE_ENV || 'development';
// eslint-disable-next-line import/extensions
const config = require('../config/config.js')[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);

db.sequelize = sequelize;

const basename = path.basename(__filename);
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js',
  )
  .forEach((file) => {
    // eslint-disable-next-line import/no-dynamic-require
    const model = require(path.join(__dirname, file));
    console.log(file, model.name);
    db[model.name] = model;
    model.initiate(sequelize);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

module.exports = db;
