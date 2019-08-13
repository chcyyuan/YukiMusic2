/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import axios from 'axios'
import {
  concatUrl
} from './kit'

export function getRecommendMV(page, pageSize) {
  const url = baseUrl + 'netease/mv/top'
  const data = {
    pageSize: pageSize,
    page: page * pageSize
  }
  return axios.get(concatUrl(url, data))
}

function getMVDetail(id) {
  const url = baseUrl + 'netease/mv'
  const data = {
    id: id
  }
  return axios.get(concatUrl(url, data))
}

function getMVUrl(id) {
  const url = baseUrl + 'netease/mvUrl'
  const data = {
    id: id,
    isRedirect: 0,
    quality: 720
  }
  return axios.get(concatUrl(url, data))
}

export function getMV(id) {
  return axios.all([getMVDetail(id), getMVUrl(id)])
}
