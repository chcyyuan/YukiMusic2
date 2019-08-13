/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import {
  concatUrl
} from './kit'
import axios from 'axios'

export function getSingerInfo(id) {
  const url = baseUrl + 'netease/artist/info'

  const data = {
    id: id
  }

  return axios.get(concatUrl(url, data))
}

export function getSingerSong(id) {
  const url = baseUrl + 'netease/song/artist'

  const data = {
    id: id
  }

  return axios.get(concatUrl(url, data))
}
