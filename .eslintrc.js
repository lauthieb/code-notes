module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: ["airbnb-base", "plugin:vue/recommended"],
  globals: {
    __static: true
  },
  plugins: ["html"],
  rules: {
    "global-require": 0,
    "import/no-unresolved": 0,
    "no-param-reassign": 0,
    "no-underscore-dangle": 0,
    "no-shadow": 0,
    "import/extensions": 0,
    "import/newline-after-import": 0,
    "no-multi-assign": 0,
    // allow debugger during development
    "no-debugger": process.env.NODE_ENV === "production" ? 1 : 0
  }
};
