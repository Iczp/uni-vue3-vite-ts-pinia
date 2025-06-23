module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-empty': [0], // 允许空主题
    'type-empty': [0], // 允许空类型
    'type-enum': [
      1, // 改为警告级别
      'always',
      [
        's', 'd', 'feat', 'fix', 'docs', 'refactor',
        'test', 'build', 'ci', 'chore', 'improvement',
        'merge', 'revert'
      ],
    ],
  },
};
