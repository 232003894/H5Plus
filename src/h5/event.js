import * as utils from './utils'
import {
  _wins
} from './windows.js'
import {
  os
} from './os.js'

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

if (!os.plus) {
  window.addEventListener('message', function (e) {
    if (e.data && e.data.eventType) {
      // e.data.tree && 
      // fire(window, e.data.eventType, e.data.eventData)
      if (!!e.data.tree) {
        fire(window, e.data.eventType, e.data.eventData)
      } else {
        if (e.source === window.opener) {
          fireAll(e.data.eventType, e.data.eventData, e.source)
        } else {
          fireAll(e.data.eventType, e.data.eventData)
        }
      }
    }
  }, false)
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
 * 事件通知  html:本窗体和所有子窗体
 * @export
 * @param {any} webview
 * @param {any} eventType
 * @param {Object} eventData
 */
export function fireTree(winObj, eventType, eventData) {
  fire(window, eventType, eventData)
  _wins.forEach(_w => {
    setTimeout(() => {
      _w.postMessage({
        tree: true,
        eventType: eventType,
        eventData: eventData
      }, window.location.origin)
    }, 1)
  })
}

/**
 * 事件通知 所有窗体  html(只通知本窗体)
 * @export
 * @param {any} eventType
 * @param {Object} eventData
 */
export function fireAll(eventType, eventData, excludeWin) {
  fire(window, eventType, eventData)

  _wins.forEach(_w => {
    if (_w !== excludeWin) {
      setTimeout(() => {
        _w.postMessage({
          tree: false,
          eventType: eventType,
          eventData: eventData
        }, window.location.origin)
      }, 1)
    }
  })
  if (window.opener && window.opener !== excludeWin) {
    setTimeout(() => {
      window.opener.postMessage({
        tree: false,
        eventType: eventType,
        eventData: eventData
      }, window.location.origin)
    }, 1)
  }
}
