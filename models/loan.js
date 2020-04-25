'use strict'
module.exports = (sequelize, DataTypes) => {
  const Loan = sequelize.define('Loan', {
    user_id: DataTypes.INTEGER,
    copy_id: DataTypes.INTEGER,
    return_due_date: DataTypes.DATEONLY
  }, {})
  Loan.associate = function(models) {
    Loan.belongsTo(models.User)
    Loan.hasOne(models.Copy, {
      foreignKey: 'copy_id',
      as: 'loan',
    })
  }
  return Loan
}
