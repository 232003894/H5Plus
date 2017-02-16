import {
  os
} from '../os.js'

import * as utils from '../../h5/utils.js'
import * as _msg from '../../h5/msg/alert.js'

export var alert = _msg.alert
export var alertClose = _msg.alertClose

if (os.plus) {
  alert = function (msg, options) {
    let title = ''
    let buttonText = '确定'
    let onShow = () => {}
    let onHide = () => {}
    if (utils.isObject(options)) {
      if (options.title) {
        if (msg) {
          title = options.title
        } else {
          msg = options.title
        }
      }
      if (options.buttonText) {
        buttonText = options.buttonText
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
      window.plus && window.plus.nativeUI.alert(msg, onHide, title, buttonText, 'div')
    } else {
      utils.log('alert无内容,退出')
    }
  }
}
