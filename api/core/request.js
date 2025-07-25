
class Request {
  constructor (method, resource, data, headers = {}, config = {}) {
    this.method = method
    this.resource = resource
    this.data = data
    this.headers = headers
    this.config = config
  }

  execute (resource, data, headers = {}) {
    headers = { Accept: '*/*', ...headers }
    return client({
      crossdomain: true,
      headers,
      method: this.method,
      url: this.resource || resource,
      data
    })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error(
          'Ошибка в запросе по пути ' +
            resource +
            ' | status: ' +
            error.request.status
        )
        try {
          return JSON.parse(error.request.response)
        } catch (e) {
          return error.request.response
        }
      })
  }
}

let client
const service = {}

export function setClient ($axios) {
  client = $axios

  // client.onRequest((config) => {
  //   console.log(`Making request to ${config.url}`)
  // })

  // Request helpers
  const reqMethods = [
    // url, {}, config:
    'request',
    'delete',
    'get',
    'head',
    'options',
    // url, data, config:
    'post',
    'put',
    'patch'
  ]

  reqMethods.forEach((method) => {
    const request = new Request(method)
    service[method] = request.execute.bind(request)
  })
}

export default service
