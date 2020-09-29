/* eslint-disable camelcase */
const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const api_router = require('./api-routes');

const router = new Router();

const app = new Koa();
const PORT = process.env.PORT || 1337;

router.get('/', async (ctx) => {
  ctx.body = {
    status: 'success',
    message: 'hello, world!',
  };
});

app.use(bodyParser());
app.use(router.routes());
app.use(api_router.routes());

const server = app.listen(PORT, () => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('Server listening on port: ', PORT);
  }
});

module.exports = server;
