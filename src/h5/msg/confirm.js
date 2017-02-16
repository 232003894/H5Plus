/**
 * 这里放调用window的 confirm
 * 消息方法
 */

import * as utils from '../utils'

import {
  os
} from '../os.js'

/**
 * 弹框消息
 */
export function confirm(msg, options) {
  let onShow = () => {}
  let onHide = () => {}
  let onCancel = () => {}
  let onConfirm = () => {}
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
    if (options.onCancel) {
      onCancel = options.onCancel
    }
    if (options.onConfirm) {
      onConfirm = options.onConfirm
    }
  }
  if (msg) {
    onShow()
    if (window.confirm(msg)) {
      onConfirm()
      onHide()
    } else {
      onCancel()
      onHide()
    }
  } else {
    utils.log('confirm无内容,退出')
  }
}

/**
 * 弹框消息
 */
export function confirmClose() {
  utils.log(os.name + ' 环境 不支持' + ' confirmClose ' + '!')
}
