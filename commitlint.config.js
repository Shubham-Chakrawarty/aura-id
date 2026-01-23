export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Allowed format: type(scope): subject
    // Allowed types [build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test]
    // Allowed scopes
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
