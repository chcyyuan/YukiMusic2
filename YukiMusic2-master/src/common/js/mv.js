export default class MV {
  constructor ({
    id,
    name,
    cover,
    duration,
    singer,
    url,
    desc
  }) {
    this.id = id
    this.name = name
    this.picUrl = cover
    this.duration = duration
    this.singer = singer
    this.url = url || ''
    this.desc = desc || ''
  }
}
