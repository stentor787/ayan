module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: "babel-eslint"
  },
  extends: [
    "@nuxtjs",
    "plugin:nuxt/recommended",
    "plugin:nuxt/base",
    "plugin:vue/recommended",
  ],
  // add your custom rules here
  rules: {
    "no-console": "off",
    "nuxt/no-cjs-in-config": "off",
    "object-shorthand": ["warn", "always", { avoidQuotes: true }]
  }
};
