/**
 * 消息方法
 */

import * as utils from '../utils'

import {
  os
} from '../os.js'

/**
 * 提示消息
 */
export function toast() {
  utils.log(os.name + ' 环境 不支持' + ' toast ' + '!')
}

/**
 * 提示消息
 */
export function toastClose() {
  utils.log(os.name + ' 环境 不支持' + ' toastClose ' + '!')
}
