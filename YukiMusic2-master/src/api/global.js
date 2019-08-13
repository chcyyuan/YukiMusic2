/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import {
  concatUrl
} from './kit'
import axios from 'axios'

export function getTopSingers(num = 5) {
  const url = baseUrl + 'netease/artist/top'
  const data = {
    pageSize: num
  }

  return axios.get(concatUrl(url, data))
}

export function getGreatSongList(num = 6) {
  const url = baseUrl + 'netease/songList/highQuality'

  const data = {
    pageSize: num
  }

  return axios.get(concatUrl(url, data))
}
