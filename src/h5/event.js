import * as utils from './utils'

var receive = function (eventType, eventData) {
  if (eventType) {
    try {
      if (eventData) {
        eventData = JSON.parse(eventData)
      }
    } catch (e) {}
    document.dispatchEvent(new window.CustomEvent(eventType, {
      detail: eventData,
      bubbles: true,
      cancelable: true
    }))
  }
}

/**
 * 单页面事件通知 html和5+ 都可以用
 * @export
 * @param {Object} winObj webview 或者 window
 * @param {any} eventType
 * @param {Object} eventData
 */
export function fire(winObj, eventType, eventData) {
  if (winObj) {
    if (eventData !== '') {
      eventData = eventData || {}
      // utils.log(JSON.stringify(eventData))
      if (utils.isPlainObject(eventData)) {
        eventData = JSON.stringify(eventData || {}).replace(/'/g, '\\u0027').replace(/\\/g, '\\u005c')
      }
      // utils.log(eventData)
    }
    var _js = '(' + receive.toString().replace('/function ?+(/', 'function') + ')("' + eventType + '",\'' + eventData + '\')'
    if (utils.isWindow(winObj)) {
      // Window
      winObj.eval(_js)
    } else {
      // webview
      winObj.evalJS(_js)
    }
  }
}

/**
 * 事件通知  html:本窗体
 * @export
 * @param {any} webview
 * @param {any} eventType
 * @param {Object} eventData
 */
export function fireTree(winObj, eventType, eventData) {
  fire(winObj, eventType, eventData)
}

/**
 * 事件通知 所有窗体  html(只通知本窗体)
 * @export
 * @param {any} eventType
 * @param {Object} eventData
 */
export function fireAll(eventType, eventData) {
  fire(window, eventType, eventData)
}
