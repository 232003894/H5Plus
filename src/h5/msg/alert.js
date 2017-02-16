/**
 * 这里放调用window的 alert
 * 消息方法
 */

import * as utils from '../utils'

import {
  os
} from '../os.js'

/**
 * 弹框消息
 */
export function alert(msg, options) {
  let onShow = () => {}
  let onHide = () => {}
  if (utils.isObject(options)) {
    if (options.title && !msg) {
      msg = options.title
    }
    if (options.onShow) {
      onShow = options.onShow
    }
    if (options.onHide) {
      onHide = options.onHide
    }
  }
  if (msg) {
    onShow()
    window.alert(msg)
    onHide()
  } else {
    utils.log('alert无内容,退出')
  }
}

/**
 * 弹框消息
 */
export function alertClose() {
  utils.log(os.name + ' 环境 不支持' + ' alertClose ' + '!')
}
