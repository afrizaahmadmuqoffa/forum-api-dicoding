module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-console': 'off',
    'linebreak-style': 'off',
    'no-underscore-dangle': 'off',
    camelcase: 'off',
  },
};
