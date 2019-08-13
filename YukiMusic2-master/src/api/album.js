/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import axios from 'axios'
import {
  concatUrl
} from './kit'

export function getAlbumDetail(id) {
  const url = baseUrl + 'netease/album'
  const data = {
    format: 0,
    id: id
  }
  return axios.get(concatUrl(url, data))
}
