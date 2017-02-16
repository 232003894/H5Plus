import * as win from './windows.js'
import * as back from './back'

import '../h5/ready'

win.onload(() => {
  document.addEventListener('manualshow', function (e) {
    if (window.plus) {
      var w = window.plus.webview.currentWebview()
      // fixed:排除已经是TopWebview的情况 2016年12月16日
      var isTop = (w === window.plus.webview.getTopWebview())
      // 如果已经显示但不是TopWebview的情况
      if (w.isVisible() && !isTop) {
        w.hide('none')
        setTimeout(() => {
          w.show(e.detail.aniShow, e.detail.duration + 100)
        }, 500)
      } else {
        w.show(e.detail.aniShow, e.detail.duration)
      }
    }
  })
  document.addEventListener('fromChildrenBack', back.__back)
  document.addEventListener('fromChildrenMenu', back.__menu)
})
