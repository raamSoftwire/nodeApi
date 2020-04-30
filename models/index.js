'use strict'

const Sequelize = require('sequelize')
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]
const db = {}

let sequelize
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config)
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config)
}

db.user = require('./user.js')(sequelize, Sequelize)
db.book = require('./book.js')(sequelize, Sequelize)
db.copy = require('./copy.js')(sequelize, Sequelize)
db.loan = require('./loan.js')(sequelize, Sequelize)

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
