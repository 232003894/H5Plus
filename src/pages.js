import * as utils from './h5/utils'

export var pages = {}

export function addPage(page) {
  return utils.mix(true, pages, page)
}
