/* eslint-disable space-before-function-paren */
const pinyin = require('pinyin')

export function concatUrl(url, param) {
  let requestUrl = url + '?'
  for (let k in param) {
    requestUrl += k + '=' + param[k] + '&'
  }
  return requestUrl.slice(0, requestUrl.length - 1)
}

export function splitSingers(list) {
  let ret = ''
  for (let i = 0; i < list.length; i++) {
    ret += list[i] + '/'
  }
  return ret.slice(0, ret.length - 1)
}

export function splitSingersInObj(list) {
  let ret = ''
  for (let i = 0; i < list.length; i++) {
    ret += list[i].name + '/'
  }
  return ret.slice(0, ret.length - 1)
}

export function transDate(timeStamp) {
  let date = new Date(timeStamp)
  let y = date.getFullYear()
  let m = (date.getMonth() + 1).toString().padStart(2, '0')
  let d = date
    .getDate()
    .toString()
    .padStart(2, '0')

  return `${y}-${m}-${d}`
}

export function addTag(singerList) {
  for (let i = 0; i < singerList.length; i++) {
    let tag = transTopinyin(singerList[i].name)
    singerList[i].tag = tag
  }
  return singerList
}

export function divideByTag(tagList) {
  let obj = {}
  let tags = []
  let retArr = []
  for (let i = 0; i < tagList.length; i++) {
    if (!obj[tagList[i].tag]) {
      obj[tagList[i].tag] = [tagList[i]]
      tags.push(tagList[i].tag)
    } else {
      obj[tagList[i].tag].push(tagList[i])
    }
  }
  tags = tags.sort()
  if (tags[0] === '*') {
    tags.shift()
    tags.push('*')
  }

  for (let i = 0; i < tags.length; i++) {
    retArr.push(obj[tags[i]])
  }

  return retArr
}

function transTopinyin(name) {
  let firstLetter = name.slice(0, 1)
  let reg = /[a-zA-Z]/
  if (reg.test(firstLetter)) {
    return firstLetter.toLocaleUpperCase()
  } else if (
    reg.test(
      pinyin(firstLetter, {
        style: pinyin.STYLE_FIRST_LETTER
      })
    )
  ) {
    return pinyin(firstLetter, {
      style: pinyin.STYLE_FIRST_LETTER,
      heteronym: true
    })[0][0].toLocaleUpperCase()
  } else {
    return '*'
  }
}

export function transTime(time) {
  let seconds = time / 1000
  let m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0')
  let s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${m}:${s}`
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function splitTags(arr) {
  let ret = ''
  arr.forEach(item => {
    ret = ret + item + '/'
  })
  ret = ret.slice(0, ret.length - 1)
  return ret
}
