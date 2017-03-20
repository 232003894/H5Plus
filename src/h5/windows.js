// 窗口控制的和 onload(网页加载完成)
import {
  pages
}
from '../pages'
import {
  os
} from './os.js'
import * as utils from './utils'

var qs = require('qs')

export var _wins = []

/**
 * 打开新页面
 * web:直接打开新url
 * @export
 * @param {any} id 页面id
 * @returns
 */
export function open(id, opts) {
  if (!id) {
    utils.log('open id不能为空!')
    return
  }
  var url = pages[id] || id
  var tmp = url.split('?')
  var baseSearch = {}
  if (tmp.length > 1) {
    baseSearch = qs.parse(tmp[tmp.length - 1])
  }

  opts = opts || {}
  opts.extras = opts.extras || {}

  var _qs = qs.stringify(utils.mix(true, baseSearch, opts.extras))
  if (_qs) {
    _qs = "?" + _qs
  }
  url = tmp[0] + _qs
  var newWin = window.open(url, '_blank')
  newWin.id = id
  utils.mix(true, newWin, baseSearch, opts.extras)
  if (_wins.every((_w) => {
      return _w !== newWin
    })) {
    _wins.push(newWin)
  }
  return newWin
}

/**
 * 回到首页
 * @export
 */
export function goHome() {
  open('index')
}

/**
 * 当前窗体
 */
export function currentWebview() {
  return window
}

/**
 * 当前窗口的创建者窗体
 */
export function opener() {
  return window.opener
}

/**
 * 是否主页
 */
export function isHomePage() {
  return window.location.pathname === '/html/index.html'
}

/**
 * 显示指定窗口
 * @export
 * @param {any} webview
 * @param {any} showLoading
 */
export function showWindow(webview, showLoading) {
  utils.log(os.name + ' 环境 不支持 ' + 'showWindow ' + '!')
}

/**
 * 隐藏指定窗口
 * @export
 * @param {any} webview
 * @param {any} showLoading
 */
export function hideWindow(webview) {
  utils.log(os.name + ' 环境 不支持 ' + 'hideWindow ' + '!')
}

/**
 * 关闭指定窗口
 * @export
 * @param {any} webview
 * @param {any} showLoading
 */
export function closeWindow(webview) {
  if (utils.isWindow(webview)) {
    webview.close()
  } else {
    utils.log(os.name + ' 环境 closeWindow方法不支持 ' + ' webview参数为id' + '!')
  }
}

/**
 * Dom加载完成
 * @param {function} callback
 * @param {Boolean} inRefresh 默认是false
 * @returns
 */
export function onload(callback) {
  let readyRE = /complete|loaded|interactive/
  if (readyRE.test(document.readyState)) {
    callback()
  } else {
    document.addEventListener('DOMContentLoaded', callback, false)
  }
  return this
}

let _refreshs = []
/**
 * 设备的加载完成
 * web,5+ 有效
 * web：等同于onload
 * 5+：‘plusready’后（window.plus存在）：立即执行，否则加入到‘plusready’事件中
 * @export
 * @param {Function} callback
 */
export function mounted(callback) {
  if (window.plus) {
    // 解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
    setTimeout(() => {
      callback()
    }, 16.7)
  } else {
    // 修复：手机app中会调用2次的bug，window.plus改为os.plus
    if (os.plus) {
      document.addEventListener('plusready', function () {
        callback()
      }, false)
    } else {
      onload(callback)
    }
  }
  return this
}
