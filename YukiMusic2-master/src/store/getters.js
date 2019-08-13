// getters取数据到组件中

export const singer = state => state.singer
export const playing = state => state.playing
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const showList = state => state.showList
export const currentIndex = state => state.currentIndex
export const sequenceIndex = state => {
  if (state.currentIndex >= 0 && state.playList.length > 0 && state.currentIndex < state.playList.length) {
    for (let i = 0; i < state.sequenceList.length; i++) {
      if (state.sequenceList[i].id === state.playList[state.currentIndex].id) {
        return i
      }
    }
  }
}
export const currentSong = state => state.playList[state.currentIndex] || {}
export const currentSongList = state => state.currentSongList
export const songReady = state => state.songReady
export const lyricsReady = state => state.lyricsReady
export const isRandom = state => state.isRandom
export const currentAlbum = state => state.currentAlbum
export const searchHistory = state => {
  let ret = []
  if (state.searchHistory.length !== 0) {
    state.searchHistory.forEach((item) => {
      let obj = {}
      obj.value = item
      ret.push(obj)
    })
  }
  return ret
}
export const searchKeywords = state => state.searchKeywords
export const searchCategory = state => state.searchCategory
export const searchResult = state => state.searchResult
export const currentPage = state => state.currentPage
export const favorList = state => state.favorList
export const currentMV = state => state.currentMV
export const mvMode = state => state.mvMode
