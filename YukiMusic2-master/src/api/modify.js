/* eslint-disable space-before-function-paren */
import Singer from 'common/js/singer'
import Album from 'common/js/album'
import SongList from 'common/js/songList'
import {
  transDate,
  splitSingers,
  splitSingersInObj
} from 'api/kit'
import Song from '../common/js/song'

export function modelizeSinger(list) {
  let ret = []
  for (let i = 0; i < list.length; i++) {
    let singer = new Singer(list[i])
    ret.push(singer)
  }
  return ret
}

export function modelizeAlbum(list) {
  let ret = []
  for (let i = 0; i < list.length; i++) {
    let album = {}
    let thisItem = list[i]
    album.name = thisItem.name
    album.id = thisItem.id
    album.picUrl = thisItem.picUrl
    let singers = []
    for (let j = 0; j < thisItem.artists.length; j++) {
      singers.push(thisItem.artists[j].name)
    }
    album.singer = splitSingers(singers)
    ret.push(new Album(album))
  }
  return ret
}

export function modelizeSongList(list) {
  let ret = []
  for (let i = 0; i < list.length; i++) {
    let listItem = {}
    let thisItem = list[i]
    listItem.name = thisItem.name
    listItem.id = thisItem.id
    listItem.picUrl = thisItem.coverImgUrl
    listItem.tag = thisItem.tag
    listItem.ctime = transDate(thisItem.createTime)
    listItem.desc = thisItem.description
    ret.push(new SongList(listItem))
  }
  return ret
}

export function modelizeSong(list) {
  let ret = []
  for (let i = 0; i < list.length; i++) {
    let thisItem = list[i]
    let songItem = {}
    songItem.name = thisItem.name
    songItem.singer = splitSingersInObj(thisItem.ar)
    songItem.id = thisItem.id
    songItem.album = thisItem.al.name
    songItem.duration = thisItem.dt
    songItem.albumPic = thisItem.al.picUrl
    songItem.albumId = thisItem.al.id
    ret.push(new Song(songItem))
  }
  return ret
}
