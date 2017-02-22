// 窗口控制的和 onload(网页加载完成)
import {
  pages
}
from '../pages'
import {
  os
} from './os.js'
import * as utils from './utils'
/**
 * 打开新页面
 * web:直接打开新url
 * @export
 * @param {any} id 页面id
 * @returns
 */
export function open(id) {
  if (!id) {
    utils.log('open id不能为空!')
    return
  }
  window.location.href = pages[id] || id
  return null
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
  return null
}

/**
 * 是否主页
 */
export function isHomePage() {
  return window.location.pathname === 'window.location.pathname'
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
  utils.log(os.name + ' 环境 不支持 ' + 'closeWindow ' + '!')
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
