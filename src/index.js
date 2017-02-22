// fixed
import './h5/_fixed'

/**
 * 工具
 */
export {
  // 获取类型
  getType,
  // 是否为字符串
  isString,
  // 是否为正则
  isRegExp,
  // 是否为一个函数
  isFunction,
  // 是否为日期
  isDate,
  // 是否为数组
  isArray,
  // 是否为一个window对象
  isWindow,
  // 是否为一个对象
  isObject,
  // 是否为一个纯净的JS对象, 不能为window, 任何类(包括自定义类)的实例,元素节点,文本节点
  isPlainObject,
  // isArrayLike,
  // 合并多个对象或深克隆
  mix,
  // 去html标签
  delHtmlTag,
  // 比较对象是否相等
  equals,
  // log输出
  log,
  // 模板替换输出
  tpl,
  getStyle,
  toFixed
}
from './h5/utils'

/**
 * 日期
 */
export {
  // 日期格式化
  formatDate
}
from './h5/filters/date'

/**
 * 日期
 */
export {
  capitalize,
  uppercase,
  lowercase,
  pluralize,
  currency,
  number
}
from './h5/filters/index'

/**
 * 系统环境
 * {
 *   wechat: false||6,
 *   version: 0,
 *   android: false,
 *   isBadAndroid: false,
 *   ios: false,
 *   ipad: false,
 *   iphone: false,
 *   plus: false,
 *   stream: false
 * }
 */
export {
  os
}
from './plus/os'

/**
 * action
 */
export {
  // 执行指定类型的action
  doAction,
  // 添加指定类型action的钩子
  addAction,
  // 删除指定类型action的钩子
  removeAction,
  // 获取指定类型action的钩子的数量
  actionCount
}
from './h5/action'

/**
 * 事件通知
 */
export {
  // 单页面事件通知 html和5+ 都可以用
  fire,
  // 事件通知 5+:本窗体和所有子窗体  html:本窗体
  fireTree,
  // 事件通知 5+:所有窗体  html:本窗体
  fireAll
}
from './plus/event.js'

export {
  // 通过键(key)检索获取应用存储的值
  getStorage,
  // 修改或添加键值(key-value)对数据到应用数据存储中
  setStorage,
  // 通过键(key)检索获取当前状态
  getState,
  // 修改或添加键值(key-value)对数据到当前状态
  setState,
  // 通过键(key)检索获取应用本地配置
  getSetting,
  // 修改或添加键值(key-value)对数据到应用本地配置
  setSetting
}
from './h5/storage'

// 后退
export {
  // 增加back执行流程
  addBack,
  // 删除back执行流程
  removeBack,
  // 增加Msg组件关闭的执行流程(比如:alert confirm login popup等)
  addMsgBack,
  // 删除Msg组件关闭的执行流程(比如:alert confirm login popup等)
  removeMsgBack,
  // get/set 后退是否使用history.back,默认值 true
  canHistoryBack,
  // 设置back前处理
  setPreBack,
  // 执行后退(常用用于header的后退)
  back,
  // plusBack
  plusBack,
  // menu
  menu
}
from './plus/back'

// alert
export {
  // 弹框消息
  alert,
  // 弹窗关闭
  alertClose
}
from './plus/msg/alert.js'

// confirm
export {
  // 显示一个带有指定消息和 OK 及取消按钮的对话框
  confirm,
  // 弹窗关闭
  confirmClose
}
from './plus/msg/confirm.js'

// toast
export {
  // 提示消息，弹出的提示消息为非阻塞模式，显示指定时间后自动消失。
  toast,
  // 提示消息关闭
  toastClose
}
from './plus/msg/toast.js'

// loading
export {
  // 显示等待对话框
  loading,
  // loading关闭
  loadingClose
}
from './plus/msg/loading.js'

/**
 * 页面列表
 */
export {
  pages,
  addPage
}
from './pages'

export {
  currentWebview,
  isHomePage,
  open,
  goHome,
  onload,
  mounted,
  showWindow,
  hideWindow,
  closeWindow
}
from './plus/windows.js'

export {
  androidKeys,
  noNetwork
}
from './plus/device.js'

import './plus/ready.js'
