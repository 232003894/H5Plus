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
/**
 * 从系统相册选择文件（图片或视频）
 * @export
 */
export function pick(success, error, options) {
  utils.log(os.name + ' 环境 不支持 ' + 'pick ' + '!')
}
/**
 * 进行拍照操作
 * @export
 */
export function captureImage() {
  utils.log(os.name + ' 环境 不支持 ' + 'captureImage ' + '!')
}
/**
 * 图片压缩转换
 * @export
 */
export function compressImage() {
  utils.log(os.name + ' 环境 不支持 ' + 'compressImage ' + '!')
}