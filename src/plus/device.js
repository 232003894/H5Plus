import * as utils from '../h5/utils'
import * as back from './back'
import {
  os
} from './os.js'
import * as _plusInterface from '../h5/device.js'

export var androidKeys = _plusInterface.androidKeys
export var noNetwork = _plusInterface.noNetwork
export var pick = _plusInterface.pick
export var captureImage = _plusInterface.captureImage
export var compressImage = _plusInterface.compressImage
if (os.plus) {
  /**
   * 监听back和menu按键
   * @export
   */
  androidKeys = () => {
    if (window.plus && os.android) {
      // back
      plus.key.removeEventListener('backbutton', back.__back, false)
      plus.key.addEventListener('backbutton', back.__back, false)
      // menu
      plus.key.removeEventListener('menubutton', back.__menu, false)
      plus.key.addEventListener('menubutton', back.__menu, false)
    }
  }

  /**
   * 是否网络无连接
   * @export
   * @returns {Boolean} fase:有网络 true:无网络
   */
  noNetwork = () => {
    if (window.plus) {
      var nt = window.plus.networkinfo.getCurrentType()
      if (nt === window.plus.networkinfo.CONNECTION_NONE) {
        return true
      }
    }
    return false
  }

  /**
   * 从系统相册选择文件（图片或视频）
   * @param {function} success success(files) [array]files
   * @param {function} error error(err) err.code err.message
   * @param {object} options http://www.html5plus.org/doc/zh_cn/gallery.html#plus.gallery.GalleryOptions
   * @export
   */
  pick = (success, error, options) => {
    if (window.plus) {
      options = options || {}
      window.plus.gallery.pick(function (e) {
        let files = []
        if (e && e.files) {
          files = e.files
        } else {
          files.push(e)
        }
        success(files)
      }, function (err) {
        error(err)
      }, options)
    }
  }

  /**
   * 进行拍照操作
   * @param {function} success success(file) 
   * @param {function} error error(err) err.code err.message
   * @param {object} options http://www.html5plus.org/doc/zh_cn/camera.html#plus.camera.CameraOption
   * @export
   */
  captureImage = (success, error, options) => {
    if (window.plus) {
      options = options || {}
      var cmr = window.plus.camera.getCamera()
      cmr.captureImage(function (file) {
        success(file)
      }, function (err) {
        error(err)
      }, options)
    }
  }

  /**
   * 图片压缩转换
   * @param {object} options http://www.html5plus.org/doc/zh_cn/zip.html#plus.zip.CompressImageOptions
   * @param {function} success success(zip)  http://www.html5plus.org/doc/zh_cn/zip.html#plus.zip.CompressImageSuccessCallback
   * @param {function} error error(err) err.code err.message
   * @export
   */
  compressImage = (options, success, error) => {
    if (window.plus) {
      options = options || {}
      window.plus.zip.compressImage(options, function (zip) {
        success(zip)
      }, function (err) {
        error(err)
      })
    }
  }
}