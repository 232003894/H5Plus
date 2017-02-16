import {
  os
} from '../os.js'

import * as utils from '../../h5/utils.js'
import * as _msg from '../../h5/msg/loading.js'

export var loading = _msg.loading
export var loadingClose = _msg.loadingClose
let loadingonHide = () => {}
if (os.plus) {
  loading = (msg, options) => {
    if (!msg) {
      msg = '载入中'
    }
    let onShow = () => {}
    loadingonHide = () => {}
    if (utils.isObject(options)) {
      if (options.onShow) {
        onShow = options.onShow
      }
      if (options.onHide) {
        loadingonHide = options.onHide
      }
    }
    if (msg) {
      onShow()
      let bodyFontSize = utils.getStyle(document.body).fontSize
      let waitingSize = bodyFontSize.replace('px', '') * 1 * 7.875 + 'px'
      window.plus && window.plus.nativeUI.showWaiting(msg, {
        modal: true,
        round: '10px',
        width: waitingSize,
        height: waitingSize,
        size: bodyFontSize,
        padding: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        back: 'transmit'
      })
    } else {
      utils.log('loading无内容,退出')
    }
  }
  loadingClose = () => {
    window.plus && window.plus.nativeUI.closeWaiting()
    loadingonHide()
  }
}
