// eslint-disable-next-line space-before-function-paren

import {
  searchCategory
} from 'common/js/config'
import {
  splitSingersInObj
} from 'api/kit'
import Song from 'common/js/song'
import Singer from 'common/js/singer'
import SongList from 'common/js/songList'
import Album from 'common/js/album'
import MV from 'common/js/mv'

export default class Record {
  constructor ({
    count,
    category,
    data
  }) {
    this.count = count
    this.category = category
    this.data = data
  }

  analyzeSearchData (category) {
    let ret = []
    if (this.category === searchCategory.song) {
      if (category === searchCategory.song) {
        this.data.forEach((item) => {
          let songObj = {}
          songObj.name = item.name
          songObj.singer = splitSingersInObj(item.ar)
          songObj.id = item.id
          songObj.album = item.al.name
          songObj.duration = item.dt
          songObj.albumPic = item.al.picUrl
          songObj.albumId = item.al.id
          ret.push(new Song(songObj))
        })
        return ret
      }
    }
    if (category === searchCategory.singer) {
      this.data.forEach((item) => {
        let singerObj = {}
        singerObj.name = item.name
        singerObj.id = item.id
        singerObj.img1v1Url = item.img1v1Url
        ret.push(new Singer(singerObj))
      })
      return ret
    }
    if (category === searchCategory.songList) {
      this.data.forEach((item) => {
        let songListObj = {}
        songListObj.name = item.name
        songListObj.id = item.id
        songListObj.picUrl = item.coverImgUrl
        songListObj.desc = item.description
        ret.push(new SongList(songListObj))
      })
      return ret
    }
    if (category === searchCategory.album) {
      this.data.forEach((item) => {
        let AlbumObj = {}
        AlbumObj.name = item.name
        AlbumObj.id = item.id
        AlbumObj.picUrl = item.picUrl
        AlbumObj.desc = item.description
        AlbumObj.company = item.company
        AlbumObj.singer = splitSingersInObj(item.artists)
        ret.push(new Album(AlbumObj))
      })
      return ret
    }
    if (category === searchCategory.mv) {
      this.data.forEach((item) => {
        let mvObj = {}
        mvObj.name = item.name
        mvObj.id = item.id
        mvObj.cover = item.cover
        mvObj.singer = splitSingersInObj(item.artists)
        ret.push(new MV(mvObj))
      })
      return ret
    }
  }
}

export const SONG_PER_PAGE = 50
export const OTHERS_PER_PAGE = 24
