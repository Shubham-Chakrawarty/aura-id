import auraServerConfig from '@aura/eslint-config/server';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'generated/**/*'],
  },
  ...auraServerConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
