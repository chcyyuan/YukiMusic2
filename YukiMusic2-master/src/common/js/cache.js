/* eslint-disable space-before-function-paren */
import storage from 'good-storage'
import Song from 'common/js/song'

const SEARCH_KEY = '__search__'
const LIST_KEY = '__list__'
const FAVOR_KEY = '__favorite__'
const SEARCH_MAX_LENGTH = 6
export const LIST_MAX_LENGTH = 64

function insertArr(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) return
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

export function saveSearchHistory({
  query,
  empty
}) {
  if (empty) {
    storage.remove(SEARCH_KEY)
    return
  }
  let historyStorage = storage.get(SEARCH_KEY, [])
  insertArr(historyStorage, query, (item) => {
    return item === query
  }, SEARCH_MAX_LENGTH)
  storage.set(SEARCH_KEY, historyStorage)
  return historyStorage
}

export function loadSearchHistory() {
  return storage.get(SEARCH_KEY, [])
}

export function saveListStorage(list) {
  let saveList = list
  if (saveList.length > LIST_MAX_LENGTH) {
    saveList = list.slice(0, LIST_MAX_LENGTH)
  }
  for (let i = 0; i < saveList.length; i++) {
    saveList[i].lyrics = ''
  }
  storage.set(LIST_KEY, saveList)
}

export function loadListStorage() {
  const listStorage = storage.get(LIST_KEY, [])
  let ret = []
  listStorage.forEach((item) => {
    ret.push(new Song(item))
  })
  return ret
}

export function saveFavoriteSong(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].lyrics = ''
  }
  storage.set(FAVOR_KEY, list)
}

export function loadFavouriteSong() {
  const favoriteList = storage.get(FAVOR_KEY, [])
  let ret = []
  favoriteList.forEach((item) => {
    ret.push(new Song(item))
  })
  return ret
}
