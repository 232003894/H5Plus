import * as utils from './utils'
import * as act from './action'
import {
  os
} from './os.js'

// confirm
import {
  // 显示一个带有指定消息和 OK 及取消按钮的对话框
  confirm as msgConfirm
}
from '../plus/msg/confirm.js'

/**
 * 增加back执行流程
 * @export
 * @param {Object} back
 * @returns
 */
export function addBack(back) {
  return act.addAction('backs', back)
}

/**
 * 删除back执行流程
 * @export
 * @param {string} 钩子名称
 * @param {string} 钩子排序值
 * @returns
 */
export function removeBack(name, index) {
  return act.removeAction('backs', name, index)
}

let _canHistoryBack = window.location.href
/**
 *  是否可以后退
 * @export
 * @returns {Boolean} 是否可以后退
 */
export function canHistoryBack() {
  return _canHistoryBack !== window.location.href
}

export function init() {
  /**
   * 默认处理-后退
   */
  addBack({
    name: 'basic',
    index: 100,
    handle: function () {
      if (canHistoryBack() && window.history.length > 1) {
        window.history.back()
        return false
      } else {
        winClose()
      }
      return true
    }
  })
}



/**
 * window的关闭页面
 * @export
 */
function winClose() {
  msgConfirm('是否退出应用？', {
    title: '退出',
    confirmText: '退出应用',
    cancelText: '不了',
    onConfirm: () => {
      window.location.href = 'about:blank'
    }
  })
}

var beforeback
/**
 * 设置back前处理
 * @export
 * @param {Function} preBack
 * @returns
 */
export function setPreBack(preBack) {
  beforeback = preBack
}

/**
 * 执行后退(常用用于header的后退)
 * 顺序:msgback > beforeback > back的hooks
 * back的hooks中则更加index的顺序来执行,一般情况下是先 h5+的back 再web的back
 * @export
 * @param {Boolean} closeMsg 是否先执行msg类型的关闭(常用于安卓后退按键的后退),默认值false
 */
export function back(closeMsg) {
  // 是否有msgBacks钩子
  let hasMsgBacks = act.actionCount('msgBacks') > 0
  if (closeMsg === true && hasMsgBacks) {
    // 执行msg关闭
    act.doAction('msgBacks')
  } else {
    if (beforeback && utils.isFunction(beforeback)) {
      // 执行并判断是否继续,false表示终止
      if (beforeback() === false) {
        return
      }
    }
    act.doAction('backs')
  }
}

/**
 * 增加Msg组件关闭的执行流程(比如:alert confirm login popup等)
 * @export
 * @param {type} back
 * @returns
 */
export function addMsgBack(back) {
  return act.addAction('msgBacks', back)
}

/**
 * 删除Msg组件关闭的执行流程(比如:alert confirm login popup等)
 * @export
 * @param {string} 钩子名称
 * @param {string} 钩子排序值
 * @returns
 */
export function removeMsgBack(name, index) {
  // utils.log(name + ' : removeMsgBack')
  return act.removeAction('msgBacks', name, index)
}

export function plusBack() {
  utils.log(os.name + ' 环境 不支持 ' + 'plusBack ' + '!')
}
export function menu() {
  utils.log(os.name + ' 环境 不支持 ' + 'menu ' + '!')
}
