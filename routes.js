const routes = require('next-routes')();

routes.add('detail', '/:txId', '/detail');

module.exports = routes;
