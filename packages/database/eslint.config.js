import baseConfig from '@aura/eslint-config';

export default [
  {
    ignores: ['dist/', 'node_modules/', 'src/generated/**/*'],
  },
  ...baseConfig,
  {
    rules: {
      'no-console': 'off',
    },
  },
];
