import * as utils from './utils.js'
import {
  os
} from './os.js'
/**
 * 监听back和menu按键
 * @export
 */
export function androidKeys() {
  utils.log(os.name + ' 环境 不支持 ' + 'androidKeys ' + '!')
}
/**
 * 是否网络无连接
 * @export
 * @returns {Boolean} fase:有网络 true:无网络
 */
export function noNetwork() {
  utils.log(os.name + ' 环境 不支持 ' + 'noNetwork ' + '!')
  return false
}
