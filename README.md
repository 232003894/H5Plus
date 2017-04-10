
[![](https://img.shields.io/npm/l/h5p.js.svg?style=flat-square)](https://www.npmjs.com/package/h5p.js) 
[![](https://img.shields.io/npm/v/h5p.js.svg?style=flat-square)](https://www.npmjs.com/package/h5p.js) 
[![](https://img.shields.io/npm/dm/h5p.js.svg?style=flat-square)](https://www.npmjs.com/package/h5p.js) 
[![](https://img.shields.io/npm/dt/h5p.js.svg?style=flat-square)](https://www.npmjs.com/package/h5p.js) 

# H5Plus
整合并统一了dom和h5+的基础方法，并进行了一些扩展。

```javascript
// 直接引用
import * as $api from 'h5p.js'

// 或者注册到全局
import * as _api from 'h5p.js'
if (!window.$api) {
  window.$api = _api
}
//在后面的文档示例中将统一用`$api`
```
文档：[http://jefferic.oschina.io/yipifaguanjia/#/md/api.md](http://jefferic.oschina.io/yipifaguanjia/#/md/api.md)