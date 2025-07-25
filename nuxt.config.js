// const path = require('path')
// const { VuetifyPlugin } = require('webpack-plugin-vuetify')

const generateCategory = require('./utils/generateCategory')
const generateProducts = require('./utils/generateProducts')

const apiChose = () => {
  // for old system
  if (process.env.NODE_ENV === 'production') {
    return 'https://ayanmarketapi.kz/api/'
  }
  switch (process.env.NUXT_MODE_AYAN) {
    case 'production':
      return 'https://ayanmarketapi.kz/api/'

    case 'testing':
      return 'http://213.139.208.142:8083/api/'

    default:
      return 'http://213.139.208.142:8083/api/'
  }
}
let isDevMode = true
if (
  process.env.NUXT_MODE_AYAN === 'production' ||
  process.env.NODE_ENV === 'production' ||
  process.env.NUXT_MODE_AYAN === 'testing'
) {
  isDevMode = false
}

module.exports = {
  mode: 'universal',

  telemetry: false,

  components: true,

  dev: isDevMode,
  env: {
    NUXT_ENV_FILESYSTEM_SOURCE: 'http://micro.landing/',
    NUXT_ENV_API_URL: apiChose()
  },
  vue: {
    config: {
      productionTip: isDevMode,
      devtools: isDevMode
    }
  },
  icons: {
    iconfont: 'mdi'
  },

  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
      { name: 'yandex-verification', content: process.env.NODE_ENV === 'production' ? 'a183877b66bae5d6' : 'ayanmarket.kz' },
      { name: 'google-site-verification', content: process.env.NODE_ENV === 'production' ? '6wwx3UDGeMJO6wbDy5AY5HYsw4kM_QV_jeZNhBoJJtU' : 'ayanmarket.kz' },
      { name: 'og:description', content: 'Онлайн доставка продуктов' }
    ],
    link: [{ rel: 'icon', type: 'image/svg+xml', href: '/img/favicon.svg' }],
    script: [
      // JIVO сайт, для отправки сообщений от пользователя, сейчас отключен на время, однако в планах было его подключить снова
      // {
      //   src: '//code-ya.jivosite.com/widget/Bku0mBRJJ5',
      //   ssr: false,
      //   defer: true
      // },
    ]
  },
  // убирает данные метатеги которые идут по умолчанию с контентом >
  meta: {
    ogType: false,
    ogTitle: false,
    ogDescription: false
  },

  serverMiddleware: [
    { path: '/.well-known/apple-app-site-association', handler: '@/middleware/apple.js' },
    { path: '/.well-known/assetlinks.json', handler: '@/middleware/android.js' }
  ],

  router: {
    prefetchLinks: false
    // пока убрал для правильного редиректа на 404
    // extendRoutes (routes, resolve) {
    //   const routesLenth = routes.length
    //   for (let j = 0; j < routesLenth; j++) {
    //     routes.push({
    //       name: 'city-' + routes[j].name,
    //       path: '/:city' + routes[j].path,
    //       component: resolve(
    //         __dirname,
    //         'pages' + path.resolve(routes[j].component).split('pages')[1]
    //       )
    //     })
    //   }
    // }
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#5d4bd0' },

  /*
   ** Global CSS
   */
  css: [
    '@/assets/scss/main.scss'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/layout-plugin',
    '@/plugins/ru-num-string-plugin',
    '@/plugins/event-bus',
    '@/plugins/vue-the-mask',
    '@/plugins/vue-moment',
    { src: '~/plugins/directives', ssr: false },
    { src: '~/plugins/vue-notifications', ssr: false },
    { src: '~/plugins/ymapPlugin.js', ssr: false },
    '@/plugins/services',
    '@/plugins/e-commerce',
    '@/plugins/capitalize',
    '@/plugins/translit',
    '@/plugins/getGeo',
    { src: '~/plugins/i18n.js', ssr: true }
    // этот плагин нужен чтобы работал тришейк для вьютифай, но он не работает с 12 версией ноды
    // new VuetifyPlugin({ styles: 'sass' })
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    ['@nuxtjs/vuetify', { treeShake: true, defaultAssets: { font: false, icons: false }, optionsPath: './vuetify.options.js' }]
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    // '@nuxtjs/pwa',
    '@nuxtjs/style-resources',
    ['nuxt-compress',
      {
        gzip: {
          threshold: 8192
        },
        brotli: {
          threshold: 8192
        }
      }
    ],
    'cookie-universal-nuxt',
    '@nuxtjs/gtm',
    '@nuxtjs/redirect-module',
    '@nuxtjs/sitemap',
    'nuxt-ssr-cache'
  ],
  // настройки для Google tag manager
  gtm: {
    id: 'GTM-PVP2LVJD',
    enabled: !isDevMode,
    layer: 'dataLayer',
    noscript: !isDevMode,
    noscriptId: 'gtm-noscript',
    scriptId: 'gtm-script',
    scriptDefer: false,
    crossOrigin: false
  },

  redirect: [
    {
      from: '(.*)html|(.*)php$', // Если это php или html файл, отправляем на ссылку без формата
      to: (from, req) => {
        return `${req.url.replace('.php', '').replace('.html', '')}`
      },
      statusCode: 301
    }
  ],

  sitemap: {
    hostname: 'https://ayanmarket.kz',
    // для тестирования
    // hostname: 'http://localhost:3000',
    path: '/sitemap.xml',
    // обновление сайтмапа 1 раз в день
    cacheTime: 1000 * 60 * 60 * 24,
    gzip: true,
    // подсказка для поисковых систем как часто обновляются страницы
    defaults: {
      changefreq: 'daily',
      lastmod: new Date()
    },
    exclude: ['404', '/newOrder', '/redirect', '/search', '/basket', '/favorites', '/onlinepay'],
    // список сайтмапов, для статичных страниц, и для динамических
    routes: async () => {
      const categoryRoutes = await generateCategory()
      const ProductsRoutes = await generateProducts()
      return categoryRoutes.concat(ProductsRoutes)
    }
  },

  cache: {
    useHostPrefix: false,
    pages: [/\/product\//, /\/collection\//, /^\/$/],
    key (route, context) {
      const minusRoute = ['/page/', '/neworder', '/search', '/basket']
      for (let i = 0; i < minusRoute.length; i++) {
        if (route.includes(minusRoute[i])) {
          return false
        }
      }

      let cookieHeader = []
      if (
        typeof context.req.headers.cookie !== 'undefined' &&
        context.req.headers.cookie.length > 0
      ) {
        cookieHeader = context.req.headers.cookie.split('; ')
      }
      const cookie = {}
      for (let i = 0; i < cookieHeader.length; i++) {
        const item = cookieHeader[i].split('=')
        cookie[item[0]] = item[1]
      }

      let departmentId = 0
      if (typeof cookie.departmentId !== 'undefined' && cookie.departmentId > 0) {
        departmentId = parseInt(cookie.departmentId)
      }

      if (departmentId > 0) {
        const routeArr = route.split('/')
        if (routeArr[routeArr.length - 1] === '') {
          routeArr[routeArr.length - 1] = departmentId
        } else {
          routeArr.push(departmentId)
        }
        return routeArr.join('/')
      }

      return route
    }
    // Пока убрал из за ошибки
    // store: {
    //   type: 'redis',
    //   host: 'localhost',
    //   ttl: 60 * 60,
    //   configure: [
    //     ['maxmemory-policy', 'allkeys-lru']
    //   ]
    // }
  },

  styleResources: {
    scss: ['@/assets/scss/base/_variables.scss']
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: apiChose()
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    hotMiddleware: {
      client: {
        // turn off client overlay when errors are present
        overlay: false,
        autoConnect: isDevMode
      }
    },
    // отключать для запуска в дев режиме но на прод версии
    ...!isDevMode && { modern: 'client' },
    ...(!isDevMode && {
      extractCSS: {
        ignoreOrder: true
      }
    }),
    vuetify: {
      treeShake: true,
      optionsPath: './vuetify.options.js'
    },
    sourcemap: true,
    optimizeCSS: true,
    minimize: true,
    cssSourceMap: true,
    splitChunks: {
      pages: true,
      vendor: true,
      commons: true,
      runtime: true,
      layouts: true
    },
    optimization: {
      minimize: !isDevMode,
      splitChunks: {
        chunks: 'all',
        name: undefined,
        maxSize: 300000,
        cacheGroups: {
          vuetify: {
            // regex to compare against build resource by path name (e.g., `/node_modules/vuetify`)
            test: /vuetify/,
            name: 'vuetify'
          }
        }
      }
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true
      }
    },
    extend (config, ctx) {
      if (!ctx.isDev) {
        config.mode = 'production'
      }
    },
    transpile: ['vue-notifications']
  }
}
