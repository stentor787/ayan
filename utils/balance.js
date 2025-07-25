import { i18n } from '~/plugins/i18n'
// если товара меньше единицы, то нужно округлять до десятых, в ином случае только целая часть
function getRoundedBalance (balance) {
  if (!balance) { return }
  const bal = balance.toFixed(1)
  return bal < 1 ? bal : Math.trunc(bal)
}
// очень много кода, поэтому вынес в отдельную функцию, используется на странице с продуктом
export default function getBalance (provider, measureType) {
  const balance = {
    status: '',
    content: [],
    val: `${getRoundedBalance(provider.balance)} ${measureType}`
  }
  for (let i = 0; i <= 2; i++) {
    balance.content.push({ id: i, color: '#8CCD28' })
  }
  switch (true) {
    case provider.balance === 0:
      balance.content[0].color = 'gray'
      balance.content[1].color = 'gray'
      balance.content[2].color = 'gray'
      break
    case provider.balance > 0 &&
        provider.balance <= 5:
      balance.content[1].color = 'gray'
      balance.content[2].color = 'gray'
      break
    case provider.balance >= 6 &&
        provider.balance <= 10:
      balance.content[2].color = 'gray'
      break
  }
  const success = balance.content.filter((x) => {
    if (x.color === '#8CCD28') {
      return x
    }
  }).length
  switch (success) {
    case 1:
      balance.status = i18n.t('errors.productLow')
      break
    case 2:
      balance.status = i18n.t('errors.productLimit')
      break
    case 3:
      balance.status = i18n.t('errors.productMany')
      break
  }
  return balance
}
