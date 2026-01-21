import auraServerConfig from '@aura/eslint-config/server';

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },
  ...auraServerConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
