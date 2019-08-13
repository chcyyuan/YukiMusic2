/* eslint-disable space-before-function-paren */
import * as types from './mutation-types'
import {
  LIST_MAX_LENGTH,
  saveFavoriteSong
} from 'common/js/cache'

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_PLAYLIST](state, list) {
    state.playList = list
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.ADD_SEQUENCE_LIST](state, item) {
    state.sequenceList.push(item)
  },
  [types.ADD_PLAYLIST](state, item) {
    state.playList.push(item)
  },
  [types.SET_SEARCH_HISTORY](state, list) {
    state.searchHistory = list
  },
  [types.SET_SEARCH_CATEGORY](state, category) {
    state.searchCategory = category
  },
  [types.SET_SEARCH_KEYWORDS](state, category) {
    state.searchCategory = category
  },
  [types.SET_SEARCH_KEYWORDS](state, keywords) {
    state.searchKeywords = keywords
  },
  [types.TOGGLE_LIST](state) {
    state.showList = !state.showList
  },
  [types.GIVE_SONG_URL](state, {
    index,
    url
  }) {
    state.playList[index].url = url
  },
  [types.GIVE_ALBUM_DESC](state, description) {
    state.currentAlbum.desc = description
  },
  [types.GIVE_ALBUM_COMPANY](state, company) {
    state.currentAlbum.company = company
  },
  [types.SET_CURRENT_SONG_LIST](state, obj) {
    state.currentSongList = obj
  },
  [types.SET_SONG_READY_STATUS](state, flag) {
    state.songReady = flag
  },
  [types.SET_LYRICS_READY_STATUS](state, flag) {
    state.lyricsReady = flag
  },
  [types.REMOVE_SONG](state, index) {
    const removeIndex = state.playList.findIndex((item) => {
      return item.id === state.sequenceList[index].id
    })
    let newIndex = state.currentIndex
    if (newIndex > removeIndex) {
      newIndex--
    }
    state.sequenceList.splice(index, 1)
    // 避免重复删除
    if (state.sequenceList.length !== state.playList.length) {
      state.playList.splice(removeIndex, 1)
    }
    if (newIndex >= state.playList.length) {
      state.currentIndex = state.playList.length - 1
    } else {
      state.currentIndex = newIndex
    }
  },
  [types.REMOVE_FAVOR_SONG](state, index) {
    state.favorList.splice(index, 1)
    saveFavoriteSong(state.favorList)
  },
  [types.CLEAR_PLAYLIST](state) {
    state.playList = []
  },
  [types.CLEAR_SEQUENCE_LIST](state) {
    state.sequenceList = []
  },
  [types.SET_IS_RANDOM](state, flag) {
    state.isRandom = flag
  },
  [types.SET_CURRENT_ALBUM](state, newAlbum) {
    state.currentAlbum = newAlbum
  },
  [types.SET_SEARCH_RESULT](state, record) {
    state.searchResult = record
  },
  [types.SET_CURRENT_PAGE](state, pageNum) {
    state.currentPage = pageNum - 1
  },
  [types.SET_FAVOR_LIST](state, list) {
    state.favorList = list
    saveFavoriteSong(list)
  },
  [types.ADD_FAVOR_LIST](state, {
    messageCaller,
    song
  }) {
    for (let i = 0; i < state.favorList.length; i++) {
      if (state.favorList[i].id === song.id) {
        messageCaller.$message({
          message: '您已经收藏过本歌曲了哦~',
          type: 'warning'
        })
        return
      }
    }
    if (state.favorList.length === LIST_MAX_LENGTH) {
      state.favorList.pop()
      messageCaller.$message({
        message: '收藏夹容量已达上限，系统已自动移除最早收藏的歌曲',
        type: 'warning'
      })
      state.favorList.unshift(song)
      saveFavoriteSong(state.favorList)
      return
    }
    state.favorList.unshift(song)
    saveFavoriteSong(state.favorList)
    messageCaller.$message({
      message: '已放入收藏夹',
      type: 'success'
    })
  },
  [types.SET_CURRENT_MV](state, MVObj) {
    state.currentMV = MVObj
  },
  [types.SET_MV_MODE](state, flag) {
    state.mvMode = flag
  }
}

export default mutations
