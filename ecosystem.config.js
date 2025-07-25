module.exports = {
  apps: [
    {
      name: 'nuxt-app',
      exec_mode: 'fork',
      script: './server/index.js',
      env_production: {
        NUXT_MODE_AYAN: 'production'
      },
      env_testing: {
        NUXT_MODE_AYAN: 'testing'
      }
    }
  ]
}
