export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // You can customize rules here.
    // Example: enforcing scopes like 'server', 'auth-portal', 'shared'
    'scope-enum': [
      2,
      'always',
      [
        'server',
        'auth-portal',
        'shared',
        'deps',
        'infra',
        'docs',
        'tests',
        'database',
        'ci',
        'config',
        'auth',
      ],
    ],
  },
};
