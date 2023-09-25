"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface
      .createTable("roles", {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.STRING,
          defaultValue: Sequelize.UUIDV4
        },
        name: { type: Sequelize.STRING, allowNull: false },
        description: { type: Sequelize.STRING, allowNull: true },
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn(
            'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
          ),
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
      }, {
        timestamps: true, underscored: true, paranoid: true
      });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("roles");
  },
};
