import auraServerConfig from '@aura/eslint-config/server';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'src/generated/**/*'],
  },
  ...auraServerConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
