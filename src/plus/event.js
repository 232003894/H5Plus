import * as _event from '../h5/event.js'
import {
  os
} from './os.js'

export var fire = _event.fire
export var fireTree = _event.fireTree
export var fireAll = _event.fireAll

if (os.plus) {
  /**
   * 事件通知 5+:本窗体和所有子窗体
   * @export
   * @param {any} webview
   * @param {any} eventType
   * @param {Object} eventData
   */
  fireTree = function (webview, eventType, eventData) {
    fire(webview, eventType, eventData)
    if (webview.children) {
      var list = webview.children()
      for (var i = 0; i < list.length; i++) {
        fire(list[i], eventType, eventData)
      }
    }
  }
  /**
   * 事件通知 所有窗体
   * @export
   * @param {any} eventType
   * @param {Object} eventData
   */
  fireAll = function (eventType, eventData) {
    if (window.plus) {
      var list = plus.webview.all()
      for (var i = list.length - 1; i >= 0; i--) {
        fire(list[i], eventType, eventData)
      }
    }
  }
}
