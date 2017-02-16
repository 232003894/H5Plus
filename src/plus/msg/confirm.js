import {
  os
} from '../os.js'

import * as utils from '../../h5/utils.js'
import * as _msg from '../../h5/msg/confirm.js'

export var confirm = _msg.confirm
export var confirmClose = _msg.confirmClose

if (os.plus) {
  confirm = function (msg, options) {
    let title = ''
    let confirmText = '确定'
    let cancelText = '取消'
    let onShow = () => {}
    let onHide = () => {}
    let onCancel = () => {}
    let onConfirm = () => {}
    if (utils.isObject(options)) {
      if (options.title) {
        if (msg) {
          title = options.title
        } else {
          msg = options.title
        }
      }
      if (options.confirmText) {
        confirmText = options.confirmText
      }
      if (options.cancelText) {
        cancelText = options.cancelText
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
      window.plus && window.plus.nativeUI.confirm(msg, function (e) {
        if (e.index === 0) {
          onConfirm()
        } else if (e.index === 1) {
          onCancel()
        }
        onHide()
      }, title, [confirmText, cancelText])
    } else {
      utils.log('confirm无内容,退出')
    }
  }
}
