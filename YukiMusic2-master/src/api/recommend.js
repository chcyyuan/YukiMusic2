/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import axios from 'axios'

export function getNewAlbum() {
  const url = baseUrl + 'netease/album/newest'

  return axios.get(url)
}
