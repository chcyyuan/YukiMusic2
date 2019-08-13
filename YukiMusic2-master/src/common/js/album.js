/* eslint-disable space-before-function-paren */
export default class Album {
  constructor({
    singer,
    id,
    picUrl,
    name,
    description,
    company
  }) {
    this.singer = singer
    this.id = id
    this.picUrl = picUrl
    this.name = name
    this.desc = description || ''
    this.company = company || ''
  }
}
