// функция подсчета общей суммы продуктов в зависимости от скидки или от того с бека приходят продукты или на сайте
export default function getSum (arr) {
  return arr.reduce((acc, item) => {
    // Проверяем существование totalDiscountPrice
    if (item.totalDiscountPrice) {
      return acc + parseFloat(item.totalDiscountPrice)
    }
    // Проверяем существование totalPrice
    if (item.totalPrice) {
      return acc + parseFloat(item.totalPrice)
    }
    // Проверяем существование discountPrice и умножаем на amount
    if (item.discountPrice) {
      return acc + Math.floor(parseFloat(item.discountPrice) * parseFloat(item.amount))
    }
    // Если ни totalDiscountPrice, ни totalPrice, ни discountPrice нет, используем price * amount
    if (item.price) {
      return acc + Math.floor(parseFloat(item.price) * parseFloat(item.amount))
    }
    return acc // Если ничего из вышеперечисленного не подходит, просто возвращаем текущую сумму
  }, 0)
}
