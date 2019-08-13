/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import axios from 'axios'
import {
  concatUrl
} from './kit'

export function getListSong(id) {
  const url = baseUrl + 'netease/songList'
  const data = {
    id: id
  }
  return axios.get(concatUrl(url, data))
}

export function getRecommendList(num, page) {
  const url = baseUrl + 'netease/songList/hot'
  const pageAll = page * num
  const data = {
    orderType: 'hot',
    pageSize: num,
    page: pageAll
  }
  return axios.get(concatUrl(url, data))
}
