const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
if (
  process.env.NODE_ENV !== 'production' ||
  process.env.NODE_ENV !== 'testing'
  // для запуска в дев режиме но на прод версии
  //   process.env.NODE_ENV !== 'production' ||
  //   process.env.NODE_ENV !== 'testing'
) {
  config.dev = true
}

async function start () {
  try {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)

    const { host, port } = nuxt.options.server

    // Build only in dev mode
    if (config.dev) {
      const builder = new Builder(nuxt)
      await builder.build()
    } else {
      await nuxt.ready()
    }

    // Give nuxt middleware to express
    app.use(nuxt.render)

    // Listen the server
    app.listen(port, host)
    consola.ready({
      message: `Server listening on http://${host}:${port}`,
      badge: true
    })
  } catch {
    consola.ready({
      message: 'Error',
      badge: true
    })
  }
}
start()
