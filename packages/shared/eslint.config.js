import baseConfig from '@aura/eslint-config';

export default [
  ...baseConfig,
  {
    ignores: ['dist', 'node_modules', 'coverage'],
  },
  {
    rules: {
      'no-console': 'off',
    },
  },
];
