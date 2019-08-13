/* eslint-disable space-before-function-paren */
export default class Singer {
  constructor({
    name,
    img1v1Url,
    id,
    tag
  }) {
    this.name = name
    this.picUrl = img1v1Url
    this.id = id
    this.tag = tag || ''
  }
}
