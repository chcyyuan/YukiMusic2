/* eslint-disable space-before-function-paren */
import {
  transTime
} from 'api/kit'
import {
  getSongLyrics
} from 'api/song'
import {
  ERR_OK
} from 'api/config'

export default class Song {
  constructor({
    name,
    singer,
    id,
    album,
    duration,
    albumPic,
    albumId,
    url
  }) {
    this.name = name
    this.singer = singer
    this.id = id
    this.album = album
    this.duration = duration
    this.normalDuration = transTime(duration)
    this.albumPic = albumPic
    this.albumId = albumId
    this.url = url || ''
  }

  getLyrics() {
    if (this.lyrics) return Promise.resolve(this.lyrics)
    return new Promise((resolve) => {
      getSongLyrics(this.id).then(res => {
        if (res.status === ERR_OK) {
          this.lyrics = res.data
          resolve(res.data)
        }
      })
    })
  }
}
