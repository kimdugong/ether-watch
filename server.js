const { createServer } = require('http');
const next = require('next');
const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  createServer(handle).listen(3001, error => {
    if (error) throw error;
    console.log('Ready on localhost:3001');
  });
});
