
module.exports = function translit (str) {
  if (!str) { return }
  const regexp = /[a-z0-9]/i
  const alph = { ' ': '-', ',': '', а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ж: 'g', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', ы: 'i', э: 'e', ё: 'yo', х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ь: '', ю: 'yu', я: 'ya' }
  return str.toLowerCase().split('').map((item) => {
    // латинские буквы и цифры возвращаем без изменения
    if (regexp.test(item)) {
      return item
    }
    return alph[item]
  }).join('')
}
