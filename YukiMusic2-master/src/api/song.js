/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import axios from 'axios'
import {
  concatUrl
} from './kit'

export function getPlayUrl(song) {
  const url = baseUrl + 'netease/url'
  const data = {
    isRedirect: 0,
    id: song.id
  }
  return axios.get(concatUrl(url, data))
}

export function getSongLyrics(id) {
  const url = 'https://api.mlwei.com/music/api/wy/'
  const data = {
    id: id,
    type: 'lrc',
    key: '523077333'
  }
  return axios.get(concatUrl(url, data))
}
