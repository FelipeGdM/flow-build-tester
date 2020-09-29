/* eslint-disable camelcase */
const Router = require('koa-router');

const api_router = new Router();

const BASE_URL = '/api/v0';

const db = {
  1234: [8, 8, 9, 7],
  5678: [3, 4, 6, 4],
};

api_router.get(`${BASE_URL}/notas`, async (ctx) => {
  console.log('GET /notas!');
  console.log(ctx.request.body);

  ctx.body = {
    status: 'success',
    message: 'Notas hello world!',
  };
});

api_router.get(`${BASE_URL}/notas/:id`, async (ctx) => {
  const matricula = ctx.params.id;
  console.log('GET /notas!');
  console.log(matricula);

  if (typeof db[matricula] === 'undefined') {
    ctx.body = {
      status: 'failed',
      message: 'Aluno não cadastrado!',
    };
    return;
  }

  ctx.body = {
    status: 'success',
    message: db[matricula],
  };
});

module.exports = api_router;
