// 窗口控制的和 mounted(plus的ready)
import {
  pages
}
from '../pages'
import {
  fire,
  fireTree,
  fireAll
} from './event.js'
import {
  os
} from './os.js'
import * as utils from '../h5/utils.js'

// 窗体操作的loading效果专门使用plus的loading
import {
  // 显示等待对话框
  loading,
  // loading关闭
  loadingClose
}
from './msg/loading.js'

import * as win from '../h5/windows.js'

export var currentWebview = win.currentWebview
export var opener = win.opener
export var isHomePage = win.isHomePage
export var open = win.open
export var openUrl = win.openUrl
export var goHome = win.goHome
export var onload = win.onload
export var mounted = win.mounted
export var showWindow = win.showWindow
export var hideWindow = win.hideWindow
export var closeWindow = win.closeWindow

const loadingTitle = '载入中'
// 默认打开窗口样式配置
const defaultWin = {
  scalable: false,
  bounce: ''
}
// 默认窗口显示配置
const defaultShow = {
  duration: os.ios ? 300 : 300,
  aniShow: 'slide-in-right'
}
// 默认窗口隐藏配置
const defaultHide = {
  duration: os.ios ? 300 : 300,
  aniHide: 'slide-out-right'
}
let _refreshs = []

let _currentWebview = null

if (os.plus) {
  currentWebview = () => {
    if (window.plus) {
      if (_currentWebview === null) {
        _currentWebview = plus.webview.currentWebview()
      }
    }
    return _currentWebview
  }

  opener = () => {
    if (currentWebview()) {
      return currentWebview().opener()
    } else {
      return null
    }
  }

  isHomePage = () => {
    if (window.plus) {
      return currentWebview().id === window.plus.runtime.appid
    } else {
      return win.isHomePage
    }
  }
  /**
   * 显示指定窗口
   * @export
   * @param {any} webview
   * @param {Boolean} showLoading 默认值true
   */
  showWindow = (webview, showLoading, showOpts) => {
    if (window.plus) {
      if (utils.isString(webview)) {
        webview = plus.webview.getWebviewById(webview)
      }
      if (webview) {
        // utils.log('窗体存在!')
        if (showLoading !== false) {
          loading(loadingTitle, {
            onShow: () => {
              setTimeout(() => {
                loadingClose()
              }, os.ios ? 1100 : 1300)
            }
          })
        }
        showOpts = utils.mix(true, defaultShow, showOpts)
        // console.log(showOpts)
        // ios系统不延时此处的fire不生效，150
        if (os.ios) {
          setTimeout(() => {
            fireTree(webview, 'manualshow', showOpts)
          }, 150)
        } else {
          fireTree(webview, 'manualshow', showOpts)
        }

      } else {
        utils.log('窗体不存在!')
        return
      }
    } else {
      utils.log(os.name + ' 环境 不支持 ' + 'showWindow ' + '!')
      return
    }
  }

  /**
   * 隐藏指定窗口
   * @export
   * @param {any} webview
   */
  hideWindow = (webview, hideOpts) => {
    if (window.plus) {
      hideOpts = utils.mix(true, defaultHide, hideOpts)
      plus.webview.hide(webview, hideOpts.aniHide, hideOpts.duration)
    } else {
      utils.log(os.name + ' 环境 不支持 ' + 'hideWindow ' + '!')
    }
  }

  /**
   * 关闭指定窗口
   * @export
   * @param {any} webview
   */
  closeWindow = (webview, hideOpts) => {
    if (window.plus) {
      hideOpts = utils.mix(true, defaultHide, hideOpts)
      plus.webview.close(webview, hideOpts.aniHide, hideOpts.duration)
    } else {
      utils.log(os.name + ' 环境 不支持 ' + 'closeWindow ' + '!')
    }
  }

  /**
   * 打开新页面
   * web,5+ 有效
   * web:直接打开新url
   * 5+:打开新窗口
   * @export
   * @param {String} id
   * @param {Object} opts {extras,styles,showOpts}
   * @returns
   */
  open = (id, opts) => {
    if (!id) {
      utils.log('open id不能为空!')
      return
    }
    opts = opts || {}
    opts.extras = opts.extras || {}
    opts.styles = opts.styles || {}
    opts.showOpts = opts.showOpts || {}
    var url = pages[id] || id
    var webview = null

    if (window.plus) {
      // 如果是首页就执行 goHome()
      if (id === 'index') {
        webview = plus.webview.getLaunchWebview()
        goHome()
      } else {
        webview = plus.webview.getWebviewById(id)
        if (webview) {
          // 显示已存在窗口
          console.log('显示已存在窗口')
          loading(loadingTitle, {
            onShow: () => {
              setTimeout(() => {
                loadingClose()
              }, os.ios ? 1100 : 1300)
            }
          })
          setTimeout(() => {
            showWindow(webview, false, opts.showOpts)
          }, 500)
          return webview
        }
        // 创建新窗口
        webview = createWindow(url, id, opts.styles, opts.extras)
        showWindow(webview, true, opts.showOpts)
      }
    } else {
      window.location.href = url
    }
    return webview
  }

  openUrl = (url) => {
    if (window.plus) {
      window.plus.runtime.openURL(encodeURI('http://www.zhangxinxu.com/wordpress/2013/04/es5新增数组方法/#foreach'))
    }
  }

  goHome = () => {
    if (window.plus) {
      loading(loadingTitle)
      var webview = window.plus.webview.getLaunchWebview()
      var top = window.plus.webview.getTopWebview()
      var _all = window.plus.webview.all()
      _all.forEach(function (el) {
        if (el.id !== webview.id && top.id !== el.id) {
          el.close('none')
        }
      })
      setTimeout(() => {
        loadingClose()
        setTimeout(() => {
          top.close(defaultHide.aniHide, defaultHide.duration + 100)
        }, 100)
      }, 300)
    } else {
      win.open('index')
    }
  }
}

/**
 * 创建Webview窗口，用于加载新的HTML页面，可通过styles设置Webview窗口的样式，创建完成后需要调用show方法才能将Webview窗口显示出来。
 * @param {any} url
 * @param {any} id
 * @param {any} styles
 * @param {any} extras
 * @returns
 */
function createWindow(url, id, styles, extras) {
  if (!window.plus) {
    return
  }
  var webview
  if (!webview) {
    webview = window.plus.webview.create(url, id, utils.mix(defaultWin, styles), extras)
  }
  return webview
}