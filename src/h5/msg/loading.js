/**
 * 消息方法
 */

import * as utils from '../utils'

import {
  os
} from '../os.js'

/**
 * loading
 */
export function loading() {
  utils.log(os.name + ' 环境 不支持' + ' loading ' + '!')
}

/**
 * loading 关闭
 */
export function loadingClose() {
  utils.log(os.name + ' 环境 不支持' + ' loadingClose ' + '!')
}
