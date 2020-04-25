'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING
  }, {})
  User.associate = function(models) {
    User.hasMany(models.Loan, {
      foreignKey: 'user_id',
      as: 'loans'
    })
  }
  return User
}
