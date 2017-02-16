import * as _back from '../h5/back.js'

export var addBack = _back.addBack
export var removeBack = _back.removeBack
export var addMsgBack = _back.addMsgBack
export var removeMsgBack = _back.removeMsgBack
export var canHistoryBack = _back.canHistoryBack
export var setPreBack = _back.setPreBack
export var back = _back.back
export var plusBack = _back.plusBack
export var menu = _back.menu

export function __back() {
  back(true)
}
export function __menu() {
  menu()
}

import {
  fire
} from '../h5/event.js'

/**
 * 首次按下back按键的时间
 */
var __backFirst = null

import {
  os
} from './os.js'

/**
 * webview 关闭或隐藏
 * 提示‘再按一次退出应用’的时候返回false,其他情况都返回true
 * @param {any} wobj
 * @returns {Boolean} 是否执行了关闭或隐藏操作
 */
function closeWebView(wobj) {
  // 是否首页
  if (wobj.id === window.plus.runtime.appid) {
    // 首页，后退实际上应该是退出应用
    // 首次按键，提示‘再按一次退出应用’
    if (!__backFirst) {
      __backFirst = new Date().getTime()
      // 特别只使用plus,而不用 $api.toast
      // 主要是plus.nativeUI.toast可以穿透所有窗口
      window.plus.nativeUI.toast('再按一次退出应用')
      setTimeout(function () {
        __backFirst = null
      }, 2000)
      return false
    } else {
      if (new Date().getTime() - __backFirst < 2000) {
        // 应用退出
        window.plus.runtime.quit()
      }
      return true
    }
  } else {
    // 其他页面
    if (wobj.preload) {
      wobj.hide('auto')
    } else {
      // 只关闭当前页面自身
      // 其打开的所有子页面 暂不处理
      wobj.close()
    }
    return true
  }
}

if (os.plus) {
  /**
   * 5+ back
   */
  addBack({
    name: 'basic',
    index: 100,
    handle: function () {
      if (!window.plus) {
        return true
      } else {
        plusBack()
        return false
      }
    }
  })

  plusBack = () => {
    // console.log('plusBack')
    if (window.plus) {
      var wobj = window.plus.webview.currentWebview()
      var parent = wobj.parent()
      if (parent) {
        // 激活父窗体的back事件
        fire(parent, 'fromChildrenBack')
        // 只是通知,没执行关闭或隐藏操作,所以返回false
        return false
      } else {
        if (canHistoryBack() && window.history.length > 1) {
          window.history.back()
          // 执行关闭或隐藏操作,所以返回true
          return true
        } else {
          return closeWebView(wobj)
        }
      }
    }
  }

  menu = () => {
    // 菜单
    var menu = document.querySelector('.action-menu')
    if (menu) {
      // 打开菜单
    } else {
      // 执行父窗口的menu
      if (window.plus) {
        var wobj = window.plus.webview.currentWebview()
        var parent = wobj.parent()
        if (parent) {
          fire(parent, 'fromChildrenMenu')
        }
      }
    }
  }
}
