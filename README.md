# H5Plus
整合并统一了dom和h5+的基础方法，并进行了一些扩展

```javascript
// 直接引用
import * as $api from 'h5p.js'

// 或者注册到全局
import * as _api from 'h5p.js'
if (!window.$api) {
  window.$api = _api
}
//在后面的文档示例中统一用`$api`
```

<br>

## 按照类别可以分为：
1. [Utils](/#/md/api/utils.md)（辅助方法）：类别判断、日志、html处理、合并、模板转换等
2. [Action](/#/md/api/Action.md)（附加操作）
3. [Back](/#/md/api/Back.md)（后退操作），对action进行的扩展
4. [Event](/#/md/api/Event.md)（事件通知）
5. [Filter](/#/md/api/Filter.md)（过滤转换），数字、金额、日期、单词复数、大小写、首字母大写等转换，并可以注册为Vue的过滤器
6. [OS](/#/md/api/运行环境.md)（运行环境），系统名称，版本，是否微信等
7. [Storage](/#/md/api/Storage.md)（本地存储），对 window.localStorage 的封装扩展
8. [Dialog](/#/md/api/消息弹窗.md)（消息弹窗），对dom、h5+整合的统一弹窗消息调用，包括：alert、confirm、toast、loading等
9. [Windows](/#/md/api/窗体操作.md)（窗体操作），窗口打开、关闭、显示隐藏、dom加载完成事件、plus加载完成事件等
10. [设备相关](/#/md/api/设备相关.md)，监听back和menu按键、判断是否有网络
11. [Pages](/#/md/api/页面字典.md)（页面字典），所有页面的字典


## 按照使用场景可以分为：
1. [web通用](/#/md/api/通用.md)
2. [H5+扩展](/#/md/api/H5Plus扩展.md)
3. [组件扩展](/#/md/api/组件扩展.md)