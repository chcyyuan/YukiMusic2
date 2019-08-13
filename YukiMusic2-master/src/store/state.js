import {
  playMode
} from 'common/js/config'
import {
  loadSearchHistory,
  loadListStorage,
  loadFavouriteSong
} from 'common/js/cache'

const listStorage = loadListStorage()

const state = {
  singer: {},
  playing: false,
  playList: listStorage,
  sequenceList: listStorage,
  mode: playMode.sequence,
  currentIndex: -1,
  showList: false,
  currentSongList: {},
  songReady: false,
  lyricsReady: false,
  isRandom: false,
  currentAlbum: {},
  searchKeywords: '',
  searchCategory: 0,
  searchHistory: loadSearchHistory(),
  searchResult: {},
  currentPage: 0,
  favorList: loadFavouriteSong(),
  currentMV: {},
  mvMode: false
}

export default state
