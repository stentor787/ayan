export default function createParams (departments) {
  let paramsId = ''
  if (departments) {
    const params = departments.reduce((accum, id) => {
      const params = `id=${id}&`
      accum += params
      return accum
    }, '')
    paramsId = `?${params.slice(0, -1)}`
  }
  return paramsId
}
