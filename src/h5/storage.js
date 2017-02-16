import {
  mix
} from './utils'

/**
 * 通过键(key)检索获取应用存储的值
 * @export
 * @param {String} key
 * @returns {any}
 */
export function getStorage(key) {
  return window.localStorage.getItem(key) || ''
}

/**
 * 修改或添加键值(key-value)对数据到应用数据存储中
 * @export
 * @param {String} key
 * @param {any} value
 */
export function setStorage(key, value) {
  window.localStorage.setItem(key, value)
}

/**
 * 通过键(key)检索获取对象(objKey)的值
 * @param {any} key
 * @param {any} objKey
 * @returns
 */
function getStorageObject(key, objKey) {
  var obj = JSON.parse(getStorage(key) || '{}')
  var temp = {}
  temp[objKey] = ''
  return mix(true, temp, obj)[objKey]
}

/**
 * 修改或添加键值对数据到对应对象(key)的属性(objKey-value)的值
 * @param {any} key
 * @param {any} objKey
 * @param {any} value
 */
function setStorageObject(key, objKey, value) {
  var obj = JSON.parse(getStorage(key) || '{}')
  obj[objKey] = value
  setStorage('$state', JSON.stringify(obj))
}

/**
 * 通过键(key)检索获取当前状态
 * @export
 * @param {String} key
 * @returns {any}
 */
export function getState(key) {
  return getStorageObject('$state', key)
}

/**
 * 修改或添加键值(key-value)对数据到当前状态
 * @export
 * @param {String} key
 * @param {any} value
 */
export function setState(key, value) {
  setStorageObject('$state', key, value)
}

/**
 * 通过键(key)检索获取应用本地配置
 * @export
 * @param {String} key
 * @returns {any}
 */
export function getSetting(key) {
  return getStorageObject('$settings', key)
}

/**
 * 修改或添加键值(key-value)对数据到应用本地配置
 * @export
 * @param {String} key
 * @param {any} value
 */
export function setSetting(key, value) {
  setStorageObject('$settings', key, value)
}
