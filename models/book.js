'use strict'
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    isbn: DataTypes.INTEGER
  }, {})
  Book.associate = function(models) {
    Book.hasMany(models.Copy, {
      foreignKey: 'book_id',
      as: 'copies'
    })
  }
  return Book
}
