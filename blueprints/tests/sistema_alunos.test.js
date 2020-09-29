/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable camelcase */
require('dotenv').config();

const { Engine } = require('@flowbuild/engine');
const fs = require('fs');
const { runMemorySeeds } = require('@flowbuild/engine/settings/tests/memory_seeds.js');
const blueprint_spec = require('../sistema_alunos');

const states_file = 'sistema_alunos_states.json';

console.log = () => { };
console.error = () => { };

const account_sample = 'ac5dc9a0-93b6-11ea-aae9-15ce6bced829';

const actor_data = {
  id: '1',
  claims: [],
  account_id: account_sample,
};

let engine = null;

beforeAll(async () => {
  await runMemorySeeds();
  engine = new Engine('memory', undefined);
});

afterAll(async () => {
  // await db_utils.clean(db);
  // await db.destroy();
  // Engine.kill();
});

describe('Sistema alunos', () => {
  let workflow = null;

  beforeAll(async () => {
    workflow = await engine.saveWorkflow('sistema_alunos',
      'Sistema de alunos', blueprint_spec);

    expect(workflow.id).toBeDefined();
  });

  test('Bloco 1.1 - Aluno aprovado', async () => {
    const process = await engine.createProcess(workflow.id, actor_data, { matricula: 1234 });

    expect(process.id).toBeDefined();

    await engine.runProcess(process.id, actor_data);

    const state_history = await engine.fetchProcessStateHistory(process.id);
    fs.writeFileSync(`states/fluxo_1_1_${states_file}`, JSON.stringify(state_history, null, 2), 'utf8', () => { });

    expect(state_history.find((state) => state.node_id === '1-1')
      .result.status).toEqual(200);

    // Must pass through node 1-3A
    expect(state_history.find((state) => state.node_id === '1-3A')).toBeDefined();

    expect(state_history[0].status).not.toEqual('error');
  });

  test('Bloco 1.2 - Aluno reprovado', async () => {
    const process = await engine.createProcess(workflow.id, actor_data, { matricula: 5678 });

    expect(process.id).toBeDefined();

    await engine.runProcess(process.id, actor_data);

    const state_history = await engine.fetchProcessStateHistory(process.id);
    fs.writeFileSync(`states/fluxo_1_2_${states_file}`, JSON.stringify(state_history, null, 2), 'utf8', () => { });

    expect(state_history.find((state) => state.node_id === '1-1')
      .result.status).toEqual(200);

    // Must pass through node 1-3B
    expect(state_history.find((state) => state.node_id === '1-3B')).toBeDefined();

    expect(state_history[0].status).not.toEqual('error');
  });

  test('Bloco 2 - Aluno não existe', async () => {
    const process = await engine.createProcess(workflow.id, actor_data, { matricula: 4567 });

    expect(process.id).toBeDefined();

    await engine.runProcess(process.id, actor_data);

    const state_history = await engine.fetchProcessStateHistory(process.id);
    fs.writeFileSync(`states/fluxo_2_${states_file}`, JSON.stringify(state_history, null, 2), 'utf8', () => { });

    // Must pass through node 2-99
    expect(state_history.find((state) => state.node_id === '2-99')).toBeDefined();

    expect(state_history[0].status).not.toEqual('error');
  });
});
