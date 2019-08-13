/* eslint-disable space-before-function-paren */
import {
  baseUrl
} from './config'
import axios from 'axios'
import {
  concatUrl
} from './kit'
import {
  searchCategory
} from 'common/js/config'

export function search(keywords, category, page, pageSize) {
  const url = baseUrl + 'netease/search'
  const data = {
    keyword: keywords,
    type: category === searchCategory.song ? 'song' : category === searchCategory.singer ? 'singer' : category === searchCategory.album ? 'album' : category === searchCategory.songList ? 'songList' : 'mv',
    page: page * pageSize || 0,
    pageSize: pageSize
  }
  return axios.get(concatUrl(url, data))
}
