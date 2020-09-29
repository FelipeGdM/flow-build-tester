/* eslint-disable max-len */
/* eslint-disable camelcase */
const blueprint_spec = {
  requirements: ['core'],
  prepare: [],
  nodes: [
    {
      id: '1-0',
      type: 'Start',
      name: 'Start node',
      parameters: {
        input_schema: {
          matricula: { type: 'string' },
          required: ['matricula'],
        },
      },
      next: '1-1',
      lane_id: '1',
    },
    {
      id: '1-1',
      next: 'F0',
      lane_id: '1',
      type: 'SystemTask',
      category: 'HTTP',
      // category: 'setToBag',
      name: 'Salvar collections na bag',
      parameters: {
        input: {
          // url: { $mustache: 'http://localhost:1337/api/v0/notas/{{bag.matricula}}' },
          notas: { $ref: 'result' },
        },
        request: {
          verb: 'GET',
          url: { $mustache: 'http://localhost:1337/api/v0/notas/{{bag.matricula}}' },
          headers: {
            ContentType: 'application/json',
          },
        },
      },
    },
    {
      id: 'F0',
      type: 'Flow',
      name: 'A matrícula é válida?',
      next: {
        success: '1-2',
        default: '2-99',
      },
      lane_id: '1',
      parameters: {
        input: {
          decision: {
            $ref: 'result.data.status',
          },
        },
      },
    },
    {
      id: '1-2',
      next: 'F1',
      lane_id: '1',
      type: 'SystemTask',
      category: 'setToBag',
      name: 'Calcula média',
      parameters: {
        input: {
          media: {
            $js: '({ result }) => result.data.message.reduce((t, n, i) => (t * i + n) / (i + 1), 0)',
          },
        },
      },
    },
    {
      id: 'F1',
      type: 'Flow',
      name: 'O aluno foi aprovado?',
      next: {
        true: '1-3A',
        false: '1-3B',
        default: '3-99',
      },
      lane_id: '1',
      parameters: {
        input: {
          decision: {
            $js: '({bag}) => bag.media > 5',
          },
        },
      },
    },
    {
      id: '1-3A',
      next: '1-99',
      lane_id: '1',
      type: 'SystemTask',
      category: 'setToBag',
      name: 'Envia email de aprovação',
      parameters: {
        input: {
          email: 'Você foi aprovado!',
        },
      },
    },
    {
      id: '1-3B',
      next: '1-99',
      lane_id: '1',
      type: 'SystemTask',
      category: 'setToBag',
      name: 'Envia email de reprovação',
      parameters: {
        input: {
          email: 'Você foi reprovado!',
        },
      },
    },
    {
      id: '1-99',
      type: 'Finish',
      name: 'Finish node',
      next: null,
      lane_id: '1',
    },
    {
      id: '2-99',
      type: 'Finish',
      name: 'Finish node',
      next: null,
      lane_id: '1',
    },
    {
      id: '3-99',
      type: 'Finish',
      name: 'Finish node',
      next: null,
      lane_id: '1',
    },
  ],
  lanes: [
    {
      id: '1',
      name: 'default',
      rule: ['fn', ['&', 'args'], true],
    },
  ],
  environment: {},
};

module.exports = blueprint_spec;
