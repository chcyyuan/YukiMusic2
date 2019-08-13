//  处理异步请求或者是完成多个mutations操作

import * as types from './mutation-types'
import {
  saveSearchHistory
} from 'common/js/cache'

export const replacePlayList = function ({
  commit,
  state
}, {
  list
}) {
  console.log(list)
  commit(types.CLEAR_PLAYLIST)
  commit(types.CLEAR_SEQUENCE_LIST)
  for (let i = 0; i < list.length; i++) {
    commit(types.ADD_SEQUENCE_LIST, list[i])
    commit(types.ADD_PLAYLIST, list[i])
  }
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_IS_RANDOM, false)
}

export const addToList = function ({
  commit,
  state
}, {
  item,
  play
}) {
  commit(types.ADD_SEQUENCE_LIST, item)
  // 避免乱序后一次点击添加重复歌曲的情况
  if (state.sequenceList.length !== state.playList.length) {
    commit(types.ADD_PLAYLIST, item)
  }
  commit(types.SET_IS_RANDOM, false)
  if (play) {
    commit(types.SET_CURRENT_INDEX, state.sequenceList.length - 1)
    commit(types.SET_PLAYING_STATE, true)
  } else {
    if (state.playList.length === 1) {
      commit(types.SET_CURRENT_INDEX, 0)
      commit(types.SET_PLAYING_STATE, true)
    }
  }
}

export const clearList = function ({
  commit,
  state
}) {
  commit(types.CLEAR_SEQUENCE_LIST)
  commit(types.CLEAR_PLAYLIST)
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_SONG_READY_STATUS, false)
  commit(types.SET_LYRICS_READY_STATUS, false)
}

export const _saveSearchHistory = function ({
  commit,
  state
}, {
  query,
  empty
}) {
  if (empty) {
    saveSearchHistory({
      empty: true
    })
    commit(types.SET_SEARCH_HISTORY, [])
    return
  }
  commit(types.SET_SEARCH_HISTORY, saveSearchHistory({
    query: query
  }))
}
