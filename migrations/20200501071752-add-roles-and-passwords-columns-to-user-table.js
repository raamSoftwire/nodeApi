'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {

    return Promise.all([
      queryInterface.addColumn(
          'Users',
          'isAdmin',
          {
            type: Sequelize.BOOLEAN
          }
      ),
      queryInterface.addColumn(
          'Users',
          'password',
          {
            type: Sequelize.STRING
          }
      ),
    ]);
  },

  down: (queryInterface, Sequelize) => {
      return Promise.all([
          queryInterface.removeColumn('Users', 'isAdmin'),
          queryInterface.removeColumn('Users', 'password')
      ]);
  }
};
