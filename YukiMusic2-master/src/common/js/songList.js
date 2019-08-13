export default class SongList {
  // eslint-disable-next-line space-before-function-paren
  constructor({
    name,
    tag,
    id,
    desc,
    ctime,
    picUrl
  }) {
    this.name = name
    this.tag = tag
    this.id = id
    this.desc = desc
    this.ctime = ctime
    this.picUrl = picUrl
  }
}
