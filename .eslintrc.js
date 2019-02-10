module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
    node: true
  },
  extends: ["airbnb-base", "prettier"],
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
