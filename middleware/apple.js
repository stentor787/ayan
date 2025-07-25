const appleJson = {
  applinks: {
    apps: [],
    details: [{
      appID: 'S4NAVX5GLQ.com.ayan.ayanmarket',
      paths: ['*', '/', '/product/*', '/shop/collection/*']
    }]
  }
}

const handler = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200
  res.end(JSON.stringify(appleJson))
}

export default handler
