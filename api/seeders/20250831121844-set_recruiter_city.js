module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE recruiter_profiles AS recruiter_profiles
      SET city = 'Kyiv'
      FROM users AS users
      WHERE recruiter_profiles.user_id = users.id
        AND users.email = 'ddo2102@gmail.com'
    `);
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query(`
      UPDATE recruiter_profiles AS recruiter_profiles
      SET city = NULL
      FROM users AS users
      WHERE recruiter_profiles.user_id = users.id
        AND users.email = 'ddo2102@gmail.com'
    `);
  },
};
