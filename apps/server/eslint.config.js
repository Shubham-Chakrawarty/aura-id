import auraServerConfig from '@aura/eslint-config/server';

export default [
  ...auraServerConfig,
  {
    ignores: ['dist/', 'node_modules/'],
    rules: {
      'no-console': 'off',
    },
  },
];
