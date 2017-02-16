import * as utils from './utils'

var hooks = {}

/**
 * 执行指定类型的action
 * @export
 * @param {String} type action类型
 * @param {Function} callback 回调
 */
export function doAction(type, callback) {
  if (type.trim() === '') {
    return
  }
  if (utils.isFunction(callback)) {
    // 指定了callback
    hooks[type] && hooks[type].every(callback)
  } else {
    // 未指定callback，直接执行
    hooks[type] && hooks[type].every(function (hook, index) {
      // hook.handle() 只要为false就中断后续钩子
      return hook.handle() !== false
    })
  }
}

/**
 * getHookIndex
 * @param {any} type
 * @param {any} name
 * @param {any} index
 * @returns
 */
function getHookIndex(type, name, index) {
  let hook = {
    name: name,
    index: index
  }
  let _index = -1
  let _hooks = hooks[type]
  if (_hooks && utils.isArray(_hooks)) {
    _hooks.forEach(function (_hook, i) {
      if (utils.equals(hook, _hook, 'name,index')) {
        _index = i
      }
    })
  }
  return _index
}

/**
 * 添加指定类型action的钩子
 * handel返回false代表中断后续钩子,反之则继续后续钩子
 * @export
 * @param {String} type action类型
 * @param {Object} hook 处理钩子
 * @returns {Array} 该类型的钩子集合
 */
export function addAction(type, hook) {
  if (type.trim() === '') {
    utils.log('action类型不能为空')
    return false
  }
  if (!hook) {
    utils.log('hook不能为空')
    return false
  }
  if (!hook.handle) {
    utils.log('hook.handle不能为空')
    return false
  }
  hook.index = hook.index || 1000
  hook.name = hook.name || ''

  let _hooks = hooks[type]
  let _index = -1
  if (!_hooks) {
    _hooks = []
  } else {
    _index = getHookIndex(type, hook.name, hook.index)
  }

  if (_index < 0) {
    // unshift push
    _hooks.unshift(hook)
    _hooks.sort(function (a, b) {
      return a.index - b.index
    })
  } else {
    utils.log(type + '类型重复的' + (hook.name || '') + 'action,覆盖旧的')
    _hooks[_index] = hook
  }

  hooks[type] = _hooks
  return hooks[type]
}

/**
 * 删除指定类型action的钩子
 * @export
 * @param {String} type action类型
 * @param {String} name 钩子名称
 * @param {Number} index 钩子排序值
 * @returns {Array} 该类型的钩子集合
 */
export function removeAction(type, name, index) {
  if (type.trim() === '') {
    return
  }
  index = index || 1000
  name = name || ''
  if (hooks[type]) {
    let _index = getHookIndex(type, name, index)
    if (_index >= 0) {
      hooks[type].removeAt(_index)
    }
  }
  return hooks[type]
}

/**
 * 获取指定类型action的钩子的数量
 * @export
 * @param {any} type action类型
 */

/**
 * 获取指定类型action的钩子的数量
 * @export
 * @param {String} type action类型
 * @param {String} name 钩子名称
 * @param {Number} index 钩子排序值
 * @returns {Number} 钩子的数量
 */
export function actionCount(type, name, index) {
  if (type.trim() === '') {
    return 0
  }
  let count = 0

  var _attrs = []
  if (name !== undefined) {
    _attrs.push('name')
  }
  if (index !== undefined) {
    _attrs.push('index')
  }
  let _hooks = hooks[type]
  if (!_hooks) {
    _hooks = []
  }
  if (_attrs.length > 0) {
    let hook = {
      name: name,
      index: index
    }
    if (_hooks && utils.isArray(_hooks)) {
      _hooks.forEach(function (_hook, i) {
        if (utils.equals(hook, _hook, _attrs.join(','))) {
          count++
        }
      })
    }
  } else {
    count = _hooks.length
  }
  return count
}
