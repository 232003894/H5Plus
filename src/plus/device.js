import * as utils from '../h5/utils'
import * as back from './back'
import {
  os
} from './os.js'
import * as _plusInterface from '../h5/device.js'

export var androidKeys = _plusInterface.androidKeys
export var noNetwork = _plusInterface.noNetwork
if (os.plus) {
  /**
   * 监听back和menu按键
   * @export
   */
  androidKeys = () => {
    if (window.plus && os.android) {
      // back
      plus.key.removeEventListener('backbutton', back.__back, false)
      plus.key.addEventListener('backbutton', back.__back, false)
      // menu
      plus.key.removeEventListener('menubutton', back.__menu, false)
      plus.key.addEventListener('menubutton', back.__menu, false)
    }
  }

  /**
   * 是否网络无连接
   * @export
   * @returns {Boolean} fase:有网络 true:无网络
   */
  noNetwork = () => {
    if (window.plus) {
      var nt = window.plus.networkinfo.getCurrentType()
      if (nt === window.plus.networkinfo.CONNECTION_NONE) {
        return true
      }
    }
    return false
  }
}
