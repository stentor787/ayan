// utils/buildShops.js

export function buildShopsItem(depEntities) {
    const root = {
      id: 'shops',
      name: 'Магазины',
      children: [],
      isShopsRoot: true
    }
  
    // Если филиалов нет или это не массив
    if (!depEntities || !Array.isArray(depEntities) || !depEntities.length) {
      return root
    }
  
    const groupMap = {}
  
    depEntities.forEach((dep) => {
      let grpId = 0
      let grpName = 'Без группы'
  
      if (dep.departmentGroup && dep.departmentGroup.id) {
        grpId = dep.departmentGroup.id
        grpName = dep.departmentGroup.name
          ? dep.departmentGroup.name.trim()
          : 'Без группы'
      }
  
      // Если в groupMap ещё нет такой группы — создаём
      if (!groupMap[grpId]) {
        groupMap[grpId] = {
          id: grpId,
          name: grpName,
          children: [],
          isShopGroup: true,
        }
      }
  
      // Внутрь найденной/созданной группы пушим филиал
      groupMap[grpId].children.push({
        id: dep.id,
        name: dep.name,
        children: [],
        isShop: true,
        img: dep.img,
      })
    })
  
    // Формируем массив групп
    root.children = Object.values(groupMap)
  
    return root
  }
  