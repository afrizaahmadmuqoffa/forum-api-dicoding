const LikesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'likes',
  version: '1.0.0',
  register: async (server, { container }) => {
    const likeHandler = new LikesHandler(container);
    server.route(routes(likeHandler));
  },
};
