/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AutheticationsTestHelper = {
  async getAccessTokenHelper(server) {
    const responsRegister = await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'fulan',
        password: 'admin1234',
        fullname: 'Fulandinho',
      },
    });

    const responseLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'fulan',
        password: 'admin1234',
      },
    });

    const {
      data: {
        addedUser: { id: userId },
      },
    } = JSON.parse(responsRegister.payload);

    const {
      data: { accessToken },
    } = JSON.parse(responseLogin.payload);

    return { userId, accessToken };
  },

  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },
};

module.exports = AutheticationsTestHelper;