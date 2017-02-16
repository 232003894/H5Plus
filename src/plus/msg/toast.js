import {
  os
} from '../os.js'

import * as utils from '../../h5/utils.js'
import * as _msg from '../../h5/msg/toast.js'

export var toast = _msg.toast
export var toastClose = _msg.toastClose

if (os.plus) {
  toast = function (msg, options) {
    let time = 2000
    let onShow = () => {}
    let onHide = () => {}
    if (utils.isObject(options)) {
      if (options.time) {
        time = options.time
      }
      time = (time <= 2000 ? 2000 : 3500)
      if (options.onShow) {
        onShow = options.onShow
      }
      if (options.onHide) {
        onHide = options.onHide
      }
    }
    if (msg) {
      onShow()
      window.plus && window.plus.nativeUI.toast(msg, {
        duration: time === 2000 ? 'short' : 'long'
      })
      setTimeout(() => {
        onHide()
      }, time)
    } else {
      utils.log('toast无内容,退出')
    }
  }
}
