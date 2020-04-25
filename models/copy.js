'use strict'
module.exports = (sequelize, DataTypes) => {
  const Copy = sequelize.define('Copy', {
    book_id: DataTypes.INTEGER
  }, {})
  Copy.associate = function(models) {
    Copy.belongsTo(models.Book)
    Copy.belongsTo(models.Loan)
  }
  return Copy
}
