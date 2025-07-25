/* eslint-disable */
/*
данный мидлвар работает на каждый роут приложения в директории pages.
он нужен для того чтобы определять город каждый раз когда мы переходим в роут.
 */
export default function ({ app, store, route, redirect }) {
  let cityId = app.$cookies.get('cityId')
  let department = app.$cookies.get('departmentId')
  let availableDepartments = app.$cookies.get('availableDepartments')
  let linkPrefix = ''
  // Если зашли первый раз и не выбран город
  if (typeof cityId === 'undefined') {
    // По умолчанию первый город в позиции
    cityId = store.state.GEO.allCitiesListByKeyName["karaganda"].id;
  }

  // Если был найден город в префиксе в строке браузера
  if (typeof route.params.cityId !== 'undefined') {
    // Если был введен не существующий город или ненайденный в списке в бд
    if (
      store.state.GEO.allCitiesListByKeyName[route.params.cityId] === 'undefined'
    ) {
      redirect('/404')
      return
    }

    // Добавим префикс города к пути (route)

    // // Если в поисковой строке отличается город от сохраненного города в куки юзера
    // if (store.state.GEO.allCitiesListByKeyName[route.params.cityId].id !== cityId) {
    //   // Меняем cохраненный город клиента на новый, чтобы поисковый робот легко переходил между городами
    //   cityId = store.state.GEO.allCitiesListByKeyName[route.params.cityId].id
    //   // Автоматически меняем департамент на нулевой нового города
    //   department = store.state.GEO.allCitiesListById[cityId].departments[0].id
    // }
  }

  // Если нет города в строке браузера, а город указан (когда ранее были в другом городе и перешли на главную)
  else if (store.state.GEO.allCitiesList[0] !== undefined) {
    // Если нынешнее значение id города не равно первому id в списке всех городов
    // if (store.state.GEO.allCitiesListByKeyName["karaganda"].id !== cityId) {
    //   // Меняем город клиента на стандартный
    //   cityId = 1
    //   // Автоматически меняем департамент на нулевой нового города
    //   department = store.state.GEO.allCitiesListById[cityId].departments[0].id
    // }
  }

  if (typeof department === 'undefined') {
    // Ставим первый департамент города если его нет
    department = store.state.GEO.allCitiesListById[cityId].departments[0].id
  }
  // store.dispatch('GEO/DEFINE_CITY', {
  //   cityId: cityId,
  //   departmentId: department,
  //   linkPrefix,
  //   activeCityTitle: store.state.GEO.allCitiesListById[cityId].name,
  // })

  app.$cookies.set('cityId', cityId)
  app.$cookies.set('departmentId', department)
  app.$cookies.set('availableDepartments', availableDepartments)
}
