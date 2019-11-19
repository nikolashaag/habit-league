export function unique(targetArray, prop = false) {
  return targetArray.filter((obj, pos, arr) => {
    if (prop) {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos
    } else {
      return arr.map(mapObj => mapObj).indexOf(obj) === pos
    }
  })
}

export function sort(arrayToSort, prop, ascending = false) {
  if (arrayToSort.length < 1) {
    return []
  }
  function compare(a, b) {
    if (a[prop] > b[prop]) {
      return ascending ? 1 : -1
    }
    if (a[prop] < b[prop]) {
      return ascending ? -1 : 1
    }
    return 0
  }
  return arrayToSort.sort(compare)
}

export const capitalize = word => {
  return word.charAt(0).toUpperCase() + word.slice(1)
}
