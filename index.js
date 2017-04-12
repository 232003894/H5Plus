/*!
 * h5p.js v1.1.9
 * https://github.com/232003894/H5Plus
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Array
 */
// fixed Array.isArray
if (!Array.isArray) {
  Array.isArray = function (a) {
    return Object.prototype.toString.call(a) === '[object Array]';
  };
}
/* global NodeList:true */
if (!NodeList.prototype.forEach) {
  // 安卓4.2中 NodeList forEach不支持
  NodeList.prototype.forEach = Array.prototype.forEach;
}

/* eslint-disable no-extend-native */
Array.prototype.removeAt = function (index) {
  // 移除数组中指定位置的元素，返回布尔表示成功与否
  return !!this.splice(index, 1).length;
};

/**
 * Event
 */
// fixed CustomEvent
if (typeof window.CustomEvent === 'undefined') {
  /* eslint-disable no-inner-declarations */
  var CustomEvent = function (event, params) {
    params = params || {
      bubbles: false,
      cancelable: false,
      detail: undefined
    };
    var evt = document.createEvent('Events');
    var bubbles = true;
    for (var name in params) {
      name === 'bubbles' ? bubbles = !!params[name] : evt[name] = params[name];
    }
    evt.initEvent(event, bubbles, true);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
}
/**
 * String
 */
// fixed String trim
if (String.prototype.trim === undefined) {
  // fix for iOS 3.2
  /* eslint-disable no-extend-native */
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}

/**
 * Object
 */
Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  /* eslint-disable no-proto */
  obj['__proto__'] = proto;
  return obj;
};

var class2type = {};

var types = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error'];

types.forEach(function (name, i) {
  class2type['[object ' + name + ']'] = name.toLowerCase();
});

/**
 * 获取类型
 * @export
 * @param {any} obj
 * @returns
 */
function getType(obj) {
  /**
   * ECMA-262 规范定义了Object.prototype.toString的行为：
   当调用 toString 方法，采用如下步骤：
   1. 如果 this 的值是 undefined, 返回 '[object Undefined]'.
   2. 如果 this 的值是 null, 返回 '[object Null]'.
   3. 令 O 为以 this 作为参数调用 ToObject 的结果 .
   4. 令 class 为 O 的 [[Class]] 内部属性的值 .
   5. 返回三个字符串 '[object ', class, and ']' 连起来的字符串 .
    利用这个方法，再配合call，我们可以取得任何对象的内部属性[[Class]]，然后把类型检测转化为字符串比较，以达到我们的目的。
   */
  return obj == null ? String(obj) : class2type[{}.toString.call(obj)] || 'object';
}

/**
 * 判定是否为字符串
 * @export
 * @param {any} value
 * @returns {boolean} 是否为字符串
 */
function isString(value) {
  return getType(value) === 'string';
}

/**
 * 判定是否为正则
 * @export
 * @param {any} value
 * @returns {boolean} 是否为正则
 */
function isRegExp(value) {
  return getType(value) === 'regexp';
}

/**
 * 判定是否为一个函数
 * @export
 * @param {any} value
 * @returns {boolean} 是否为一个函数
 */
function isFunction(value) {
  return getType(value) === 'function';
}

/**
 * 判定是否为日期
 * @export
 * @param {any} value
 * @returns {boolean} 是否为日期
 */
function isDate(value) {
  return getType(value) === 'date';
}

/**
 * 判定是否为数组
 * @export
 * @param {any} value
 * @returns {boolean} 是否为数组
 */
function isArray(value) {
  return getType(value) === 'array';
}

/**
 * 判定是否为一个window对象
 * @export
 * @param {any} obj
 * @returns {boolean} 是否为一个window对象
 */
function isWindow(obj) {
  return obj != null && obj === obj.window;
}

/**
 * 判定是否为一个对象
 * @export
 * @param {any} obj
 * @returns {boolean} 是否为一个对象
 */
function isObject(obj) {
  return getType(obj) === 'object';
}

/**
 * 判定是否为一个纯净的JS对象, 不能为window, 任何类(包括自定义类)的实例,元素节点,文本节点
 * @export
 * @param {any} obj
 * @returns {boolean} 是否为一个纯净的JS对象
 */
function isPlainObject(obj) {
  return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) === Object.prototype;
}

// /**
//  * isArrayLike
//  * @export
//  * @param {any} obj
//  * @returns {boolean}
//  */
// export function isArrayLike(obj) {
//   var length = !!obj && 'length' in obj && obj.length
//   var type = getType(obj)
//   if (type === 'function' || isWindow(obj)) {
//     return false
//   }
//   return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj
// }

/**
 * 用于合并多个对象或深克隆,类似于jQuery.extend；
 * 数组也可以合并,这里数组可以理解为以索引为属性的对象；
 * mix( target, [object1, objectN ] )；
 * mix( [deep], target, [object1, objectN ] )；
 * deep : 如果是true，合并成为递归（又叫做深拷贝）。
 * target : 对象扩展。这将接收新的属性。
 * object1 -- objectN : 一个对象，它包含额外的属性合并到第一个参数。
 * @export
 * @returns {Object} 返回 target
 */
function mix() {
  var options;
  var name;
  var src;
  var copy;
  var copyIsArray;
  var clone;
  var target = arguments[0] || {};
  var i = 1;
  var length = arguments.length;
  var deep = false;
  // 如果第一个参数为布尔,判定是否深拷贝
  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i++;
  }

  // 确保接受方为一个复杂的数据类型
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {};
  }

  // 如果只有一个参数，那么新成员添加于mix所在的对象上
  if (i === length) {
    target = this;
    i--;
  }

  for (; i < length; i++) {
    // 只处理非空参数
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        try {
          // 当options为VBS对象时报错
          copy = options[name];
        } catch (e) {
          continue;
        }

        // 防止环引用
        if (target === copy) {
          continue;
        }
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && isPlainObject(src) ? src : {};
          }
          target[name] = mix(deep, clone, copy);
        } else if (copy !== void 0) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}

/**
 * 去html标签
 * @export
 * @param {String} html
 * @returns
 */
function delHtmlTag(html) {
  var doc = '';
  if (getType(html) === 'string') {
    // doc = html.replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><')
    doc = html.replace(/<\/?.+?>/g, '');
  }
  return doc;
}

/**
 * 比较对象是否相等
 * @param {Object} x
 * @param {Object} y
 * @param {String} propertys 设置对比的属性,多属性用逗号分隔,非必填
 */
function equals(x, y, propertys) {
  // If both x and y are null or undefined and exactly the same
  if (x === y) {
    return true;
  }
  // If they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }
  // They must have the exact same prototype chain, the closest we can do is
  // test the constructor.
  if (x.constructor !== y.constructor) {
    return false;
  }

  if (typeof x === 'function' && typeof y === 'function') {
    return x.toString() === y.toString();
  }

  if (propertys) {
    var arrs = propertys.split(',');
    for (var arr in arrs) {
      var _p = arrs[arr];
      if (x.hasOwnProperty(_p) && y.hasOwnProperty(_p)) {
        // If they have the same strict value or identity then they are equal
        if (x[_p] === y[_p]) {
          continue;
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof x[_p] !== 'object' && typeof x[_p] !== 'function') {
          return false;
        }
        // Objects and Arrays must be tested recursively
        if (!equals(x[_p], y[_p])) {
          return false;
        }
      }
    }
  } else {
    for (var p in x) {
      // Inherited properties were tested using x.constructor === y.constructor
      if (x.hasOwnProperty(p)) {
        // Allows comparing x[ p ] and y[ p ] when set to undefined
        if (!y.hasOwnProperty(p)) {
          return false;
        }
        // If they have the same strict value or identity then they are equal
        if (x[p] === y[p]) {
          continue;
        }
        // Numbers, Strings, Functions, Booleans must be strictly equal
        if (typeof x[p] !== 'object' && typeof x[p] !== 'function') {
          return false;
        }
        // Objects and Arrays must be tested recursively
        if (!equals(x[p], y[p])) {
          return false;
        }
      }
    }

    for (p in y) {
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * log
 * @export
 * @param {string} msg
 */
function log(msg) {
  var br = '\r\n';
  var _d = new Date();
  var str = '[' + _d.toLocaleTimeString() + ' ' + _d.getMilliseconds() + ']' + br + ' ';
  str += msg;
  console.log(str);
}

var rformat = /\\?{#([^{}]+)#}/gm;

/**
 * 模板替换输出
 * @export
 * @param {any} tpl 示例:'最少输入##minlength##个字'
 * @param {any} data  示例:{'minlength': 12}
 * @returns
 */
function tpl(tplStr, data) {
  data = data || {};
  tplStr = tplStr || '';
  return tplStr.replace(rformat, function (_, name) {
    return data[name] == null ? '' : data[name];
  });
}

/**
 * 获取dom元素的style
 * @export
 * @param {any} domObj
 * @returns {Object} style
 */
function getStyle(domObj) {
  return domObj.currentStyle != null ? domObj.currentStyle : window.getComputedStyle(domObj, false);
}

var accounting = require('accounting');
/**
 * 把 Number 四舍五入为指定小数位数的数字
 * @export
 * @param {Number} value
 * @returns {Number} precision
 */
var toFixed = accounting.toFixed;

/*
 'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
 'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
 'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
 'MMMM': Month in year (January-December)
 'MMM': Month in year (Jan-Dec)
 'MM': Month in year, padded (01-12)
 'M': Month in year (1-12)
 'dd': Day in month, padded (01-31)
 'd': Day in month (1-31)
 'EEEE': Day in Week,(Sunday-Saturday)
 'EEE': Day in Week, (Sun-Sat)
 'HH': Hour in day, padded (00-23)
 'H': Hour in day (0-23)
 'hh': Hour in am/pm, padded (01-12)
 'h': Hour in am/pm, (1-12)
 'mm': Minute in hour, padded (00-59)
 'm': Minute in hour (0-59)
 'ss': Second in minute, padded (00-59)
 's': Second in minute (0-59)
 'a': am/pm marker
 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
 format string can also be one of the following predefined localizable formats:
 'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
 'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
 'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
 'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
 'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
 'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
 'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
 'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
 */

function toInt(str) {
  return parseInt(str, 10) || 0;
}

function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg = '-';
    num = -num;
  }
  num = '' + num;
  while (num.length < digits) {
    num = '0' + num;
  }
  if (trim) {
    num = num.substr(num.length - digits);
  }
  return neg + num;
}

function dateGetter(name, size, offset, trim) {
  return function (date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset) {
      value += offset;
    }
    if (value === 0 && offset === -12) {
      value = 12;
    }
    return padNumber(value, size, trim);
  };
}

function dateStrGetter(name, shortForm) {
  return function (date, formats) {
    var value = date['get' + name]();
    var get = (shortForm ? 'SHORT' + name : name).toUpperCase();
    return formats[get][value];
  };
}

function timeZoneGetter(date) {
  var zone = -1 * date.getTimezoneOffset();
  var paddedZone = zone >= 0 ? '+' : '';
  paddedZone += padNumber(Math[zone > 0 ? 'floor' : 'ceil'](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2);
  return paddedZone;
}
// 取得上午下午

function ampmGetter(date, formats) {
  return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1];
}
var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
  yy: dateGetter('FullYear', 2, 0, true),
  y: dateGetter('FullYear', 1),
  MMMM: dateStrGetter('Month'),
  MMM: dateStrGetter('Month', true),
  MM: dateGetter('Month', 2, 1),
  M: dateGetter('Month', 1, 1),
  dd: dateGetter('Date', 2),
  d: dateGetter('Date', 1),
  HH: dateGetter('Hours', 2),
  H: dateGetter('Hours', 1),
  hh: dateGetter('Hours', 2, -12),
  h: dateGetter('Hours', 1, -12),
  mm: dateGetter('Minutes', 2),
  m: dateGetter('Minutes', 1),
  ss: dateGetter('Seconds', 2),
  s: dateGetter('Seconds', 1),
  sss: dateGetter('Milliseconds', 3),
  EEEE: dateStrGetter('Day'),
  EEE: dateStrGetter('Day', true),
  a: ampmGetter,
  Z: timeZoneGetter
};
var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/;
var raspnetjson = /^\/Date\((\d+)\)\/$/;

function formatDate(date, format) {
  var locate = formatDate.locate;
  var text = '';
  var parts = [];
  var fn;
  var match;
  format = format || 'mediumDate';
  format = locate[format] || format;
  if (typeof date === 'string') {
    if (/^\d+$/.test(date)) {
      date = toInt(date);
    } else if (raspnetjson.test(date)) {
      date = +RegExp.$1;
    } else {
      var trimDate = date.trim();
      var dateArray = [0, 0, 0, 0, 0, 0, 0];
      var oDate = new Date(0);
      // 取得年月日
      trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
        var array = c.length === 4 ? [c, a, b] : [a, b, c];
        dateArray[0] = toInt(array[0]); // 年
        dateArray[1] = toInt(array[1]) - 1; // 月
        dateArray[2] = toInt(array[2]); // 日
        return '';
      });
      var dateSetter = oDate.setFullYear;
      var timeSetter = oDate.setHours;
      trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
        dateArray[3] = toInt(a); // 小时
        dateArray[4] = toInt(b); // 分钟
        dateArray[5] = toInt(c); // 秒
        if (d) {
          // 毫秒
          dateArray[6] = Math.round(parseFloat('0.' + d) * 1000);
        }
        return '';
      });
      var tzHour = 0;
      var tzMin = 0;
      trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
        dateSetter = oDate.setUTCFullYear;
        timeSetter = oDate.setUTCHours;
        if (symbol) {
          tzHour = toInt(symbol + c);
          tzMin = toInt(symbol + d);
        }
        return '';
      });

      dateArray[3] -= tzHour;
      dateArray[4] -= tzMin;
      dateSetter.apply(oDate, dateArray.slice(0, 3));
      timeSetter.apply(oDate, dateArray.slice(3));
      date = oDate;
    }
  }
  if (typeof date === 'number') {
    date = new Date(date);
  }
  if (!isDate(date)) {
    return;
  }
  while (format) {
    match = rdateFormat.exec(format);
    if (match) {
      parts = parts.concat(match.slice(1));
      format = parts.pop();
    } else {
      parts.push(format);
      format = null;
    }
  }
  parts.forEach(function (value) {
    fn = DATE_FORMATS[value];
    text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, '').replace(/''/g, '\'');
  });
  return text;
}

var locate = {
  AMPMS: {
    0: '上午',
    1: '下午'
  },
  DAY: {
    0: '星期日',
    1: '星期一',
    2: '星期二',
    3: '星期三',
    4: '星期四',
    5: '星期五',
    6: '星期六'
  },
  MONTH: {
    0: '1月',
    1: '2月',
    2: '3月',
    3: '4月',
    4: '5月',
    5: '6月',
    6: '7月',
    7: '8月',
    8: '9月',
    9: '10月',
    10: '11月',
    11: '12月'
  },
  SHORTDAY: {
    '0': '周日',
    '1': '周一',
    '2': '周二',
    '3': '周三',
    '4': '周四',
    '5': '周五',
    '6': '周六'
  },
  fullDate: 'y年M月d日EEEE',
  longDate: 'y年M月d日',
  medium: 'yyyy-M-d H:mm:ss',
  mediumDate: 'yyyy-M-d',
  mediumTime: 'H:mm:ss',
  'short': 'yy-M-d ah:mm',
  shortDate: 'yy-M-d',
  shortTime: 'ah:mm'
};
locate.SHORTMONTH = locate.MONTH;
formatDate.locate = locate;

/**
 * 首字母大写
 * 'abc' => 'Abc'
 * @param {any} value
 * @returns
 */
function capitalize(value) {
  if (!value && value !== 0) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * 大写
 * 'abc' => 'ABC'
 * @param {any} value
 * @returns
 */
function uppercase(value) {
  return value || value === 0 ? value.toString().toUpperCase() : '';
}

/**
 * 小写
 * 'AbC' => 'abc'
 * @param {any} value
 * @returns
 */
function lowercase(value) {
  return value || value === 0 ? value.toString().toLowerCase() : '';
}
// http://www.css88.com/doc/lodash/#_debouncefunc-wait0-options

var _pluralize = require('pluralize');

/**
 * 单词复数
 * @param {String} value 待处理的单词
 * @param {Number} count 次数
 * @param {Boolean} inclusive 包含次数
 */
function pluralize(value, count, inclusive) {
  return _pluralize(value, count, inclusive);
}

var accounting$1 = require('accounting');
accounting$1.settings = {
  currency: {
    symbol: '¥', // default currency symbol is '$'
    format: '%s%v', // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal: '.', // decimal point separator
    thousand: ',', // thousands separator
    precision: 2 // decimal places
  },
  number: {
    precision: 0, // default precision on numbers is 0
    thousand: ',',
    decimal: '.'
  }
};

function currency(value, opts) {
  return accounting$1.formatMoney(value, opts || {});
}

function number(value, opts) {
  return accounting$1.formatNumber(value, opts || {});
}

var ua$1 = navigator.userAgent;

var os = {
  name: 'web',
  wechat: false,
  version: 0,
  android: false,
  isBadAndroid: false,
  ios: false,
  ipad: false,
  iphone: false
};

// wechat
var match$1 = ua$1.match(/(MicroMessenger)\/([\d.]+)/i);
if (match$1) {
  os.name += ' wechat';
  os.wechat = match$1[2].replace(/_/g, '.');
}
// android
match$1 = ua$1.match(/(Android);?[\s/]+([\d.]+)?/);
if (match$1) {
  os.name += ' android';
  os.android = true;
  os.version = match$1[2];
  os.isBadAndroid = !/Chrome\/\d/.test(window.navigator.appVersion);
}
// ipad
match$1 = ua$1.match(/(iPad).*OS\s([\d_]+)/);
if (match$1) {
  os.name += ' iPad';
  os.ios = os.ipad = true;
  os.version = match$1[2].replace(/_/g, '.');
}
// iphone
match$1 = ua$1.match(/(iPhone\sOS)\s([\d_]+)/);
if (!os.ipad && match$1) {
  os.name += ' iPhone';
  os.ios = os.iphone = true;
  os.version = match$1[2].replace(/_/g, '.');
}

var ua = navigator.userAgent;

os.plus = false;
os.stream = false;

//  5+ Browser
var match = ua.match(/Html5Plus/i);
if (match) {
  os.name += ' h5+';
  os.plus = true;
  // document.body.classList.add( $.className( 'plus' ) )
}

// 最好有流应用自己的标识
match = ua.match(/StreamApp/i);
if (match) {
  os.name += ' stream';
  os.stream = true;
  // document.body.classList.add( $.className( 'plus-stream' ) )
}

var hooks = {};

/**
 * 执行指定类型的action
 * @export
 * @param {String} type action类型
 * @param {Function} callback 回调
 */
function doAction(type, callback) {
  if (type.trim() === '') {
    return;
  }
  if (isFunction(callback)) {
    // 指定了callback
    hooks[type] && hooks[type].every(callback);
  } else {
    // 未指定callback，直接执行
    hooks[type] && hooks[type].every(function (hook, index) {
      // hook.handle() 只要为false就中断后续钩子
      return hook.handle() !== false;
    });
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
  var hook = {
    name: name,
    index: index
  };
  var _index = -1;
  var _hooks = hooks[type];
  if (_hooks && isArray(_hooks)) {
    _hooks.forEach(function (_hook, i) {
      if (equals(hook, _hook, 'name,index')) {
        _index = i;
      }
    });
  }
  return _index;
}

/**
 * 添加指定类型action的钩子
 * handel返回false代表中断后续钩子,反之则继续后续钩子
 * @export
 * @param {String} type action类型
 * @param {Object} hook 处理钩子
 * @returns {Array} 该类型的钩子集合
 */
function addAction(type, hook) {
  if (type.trim() === '') {
    log('action类型不能为空');
    return false;
  }
  if (!hook) {
    log('hook不能为空');
    return false;
  }
  if (!hook.handle) {
    log('hook.handle不能为空');
    return false;
  }
  hook.index = hook.index || 1000;
  hook.name = hook.name || '';

  var _hooks = hooks[type];
  var _index = -1;
  if (!_hooks) {
    _hooks = [];
  } else {
    _index = getHookIndex(type, hook.name, hook.index);
  }

  if (_index < 0) {
    // unshift push
    _hooks.unshift(hook);
    _hooks.sort(function (a, b) {
      return a.index - b.index;
    });
  } else {
    log(type + '类型重复的 ' + (hook.name || '') + '-action,覆盖旧的');
    _hooks[_index] = hook;
  }

  hooks[type] = _hooks;
  return hooks[type];
}

/**
 * 删除指定类型action的钩子
 * @export
 * @param {String} type action类型
 * @param {String} name 钩子名称
 * @param {Number} index 钩子排序值
 * @returns {Array} 该类型的钩子集合
 */
function removeAction(type, name, index) {
  if (type.trim() === '') {
    return;
  }
  index = index || 1000;
  name = name || '';
  if (hooks[type]) {
    var _index = getHookIndex(type, name, index);
    if (_index >= 0) {
      hooks[type].removeAt(_index);
    }
  }
  return hooks[type];
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
function actionCount(type, name, index) {
  if (type.trim() === '') {
    return 0;
  }
  var count = 0;

  var _attrs = [];
  if (name !== undefined) {
    _attrs.push('name');
  }
  if (index !== undefined) {
    _attrs.push('index');
  }
  var _hooks = hooks[type];
  if (!_hooks) {
    _hooks = [];
  }
  if (_attrs.length > 0) {
    var hook = {
      name: name,
      index: index
    };
    if (_hooks && isArray(_hooks)) {
      _hooks.forEach(function (_hook, i) {
        if (equals(hook, _hook, _attrs.join(','))) {
          count++;
        }
      });
    }
  } else {
    count = _hooks.length;
  }
  return count;
}

var pages = {};

function addPage(page) {
  return mix(true, pages, page);
}

var qs = require('qs');

var _wins = [];

/**
 * 打开新页面
 * web:直接打开新url
 * @export
 * @param {any} id 页面id
 * @returns
 */
function open(id, opts) {
  if (!id) {
    log('open id不能为空!');
    return;
  }
  var url = pages[id] || id;
  var tmp = url.split('?');
  var baseSearch = {};
  if (tmp.length > 1) {
    baseSearch = qs.parse(tmp[tmp.length - 1]);
  }

  opts = opts || {};
  opts.extras = opts.extras || {};

  var _qs = qs.stringify(mix(true, baseSearch, opts.extras));
  if (_qs) {
    _qs = "?" + _qs;
  }
  url = tmp[0] + _qs;
  var newWin = window.open(url, '_blank');
  newWin.id = id;
  mix(true, newWin, baseSearch, opts.extras);
  if (_wins.every(function (_w) {
    return _w !== newWin;
  })) {
    _wins.push(newWin);
  }
  return newWin;
}

/**
 * 回到首页
 * @export
 */
function goHome() {
  open('index');
}

/**
 * 当前窗体
 */
function currentWebview() {
  return window;
}

/**
 * 当前窗口的创建者窗体
 */
function opener() {
  return window.opener;
}

/**
 * 是否主页
 */
function isHomePage() {
  return window.location.pathname === '/html/index.html';
}

/**
 * 显示指定窗口
 * @export
 * @param {any} webview
 * @param {any} showLoading
 */
function showWindow(webview, showLoading) {
  log(os.name + ' 环境 不支持 ' + 'showWindow ' + '!');
}

/**
 * 隐藏指定窗口
 * @export
 * @param {any} webview
 * @param {any} showLoading
 */
function hideWindow(webview) {
  log(os.name + ' 环境 不支持 ' + 'hideWindow ' + '!');
}

/**
 * 关闭指定窗口
 * @export
 * @param {any} webview
 * @param {any} showLoading
 */
function closeWindow(webview) {
  if (isWindow(webview)) {
    webview.close();
  } else {
    log(os.name + ' 环境 closeWindow方法不支持 ' + ' webview参数为id' + '!');
  }
}

/**
 * Dom加载完成
 * @param {function} callback
 * @param {Boolean} inRefresh 默认是false
 * @returns
 */
function onload(callback) {
  var readyRE = /complete|loaded|interactive/;
  if (readyRE.test(document.readyState)) {
    callback();
  } else {
    document.addEventListener('DOMContentLoaded', callback, false);
  }
  return this;
}

/**
 * 设备的加载完成
 * web,5+ 有效
 * web：等同于onload
 * 5+：‘plusready’后（window.plus存在）：立即执行，否则加入到‘plusready’事件中
 * @export
 * @param {Function} callback
 */
function mounted(callback) {
  if (window.plus) {
    // 解决callback与plusready事件的执行时机问题(典型案例:showWaiting,closeWaiting)
    setTimeout(function () {
      callback();
    }, 16.7);
  } else {
    // 修复：手机app中会调用2次的bug，window.plus改为os.plus
    if (os.plus) {
      document.addEventListener('plusready', function () {
        callback();
      }, false);
    } else {
      onload(callback);
    }
  }
  return this;
}

var receive = function (eventType, eventData) {
  if (eventType) {
    try {
      if (eventData) {
        eventData = JSON.parse(eventData);
      }
    } catch (e) {}
    document.dispatchEvent(new window.CustomEvent(eventType, {
      detail: eventData,
      bubbles: true,
      cancelable: true
    }));
  }
};

if (!os.plus) {
  window.addEventListener('message', function (e) {
    if (e.data && e.data.eventType) {
      // e.data.tree && 
      // fire(window, e.data.eventType, e.data.eventData)
      if (!!e.data.tree) {
        fire$1(window, e.data.eventType, e.data.eventData);
      } else {
        if (e.source === window.opener) {
          fireAll$1(e.data.eventType, e.data.eventData, e.source);
        } else {
          fireAll$1(e.data.eventType, e.data.eventData);
        }
      }
    }
  }, false);
}

/**
 * 单页面事件通知 html和5+ 都可以用
 * @export
 * @param {Object} winObj webview 或者 window
 * @param {any} eventType
 * @param {Object} eventData
 */
function fire$1(winObj, eventType, eventData) {
  if (winObj) {
    if (eventData !== '') {
      eventData = eventData || {};
      // utils.log(JSON.stringify(eventData))
      if (isPlainObject(eventData)) {
        eventData = JSON.stringify(eventData || {}).replace(/'/g, '\\u0027').replace(/\\/g, '\\u005c');
      }
      // utils.log(eventData)
    }
    var _js = '(' + receive.toString().replace('/function ?+(/', 'function') + ')("' + eventType + '",\'' + eventData + '\')';
    if (isWindow(winObj)) {
      // Window
      winObj.eval(_js);
    } else {
      // webview
      winObj.evalJS(_js);
    }
  }
}

/**
 * 事件通知  html:本窗体和所有子窗体
 * @export
 * @param {any} webview
 * @param {any} eventType
 * @param {Object} eventData
 */
function fireTree$1(winObj, eventType, eventData) {
  fire$1(window, eventType, eventData);
  _wins.forEach(function (_w) {
    setTimeout(function () {
      _w.postMessage({
        tree: true,
        eventType: eventType,
        eventData: eventData
      }, window.location.origin);
    }, 1);
  });
}

/**
 * 事件通知 所有窗体  html(只通知本窗体)
 * @export
 * @param {any} eventType
 * @param {Object} eventData
 */
function fireAll$1(eventType, eventData, excludeWin) {
  fire$1(window, eventType, eventData);

  _wins.forEach(function (_w) {
    if (_w !== excludeWin) {
      setTimeout(function () {
        _w.postMessage({
          tree: false,
          eventType: eventType,
          eventData: eventData
        }, window.location.origin);
      }, 1);
    }
  });
  if (window.opener && window.opener !== excludeWin) {
    setTimeout(function () {
      window.opener.postMessage({
        tree: false,
        eventType: eventType,
        eventData: eventData
      }, window.location.origin);
    }, 1);
  }
}

var fire = fire$1;
exports.fireTree = fireTree$1;
exports.fireAll = fireAll$1;

if (os.plus) {
  /**
   * 事件通知 5+:本窗体和所有子窗体
   * @export
   * @param {any} webview
   * @param {any} eventType
   * @param {Object} eventData
   */
  exports.fireTree = function (webview, eventType, eventData) {
    fire(webview, eventType, eventData);
    if (webview.children) {
      var list = webview.children();
      for (var i = 0; i < list.length; i++) {
        fire(list[i], eventType, eventData);
      }
    }
  };
  /**
   * 事件通知 所有窗体
   * @export
   * @param {any} eventType
   * @param {Object} eventData
   */
  exports.fireAll = function (eventType, eventData) {
    if (window.plus) {
      var list = plus.webview.all();
      for (var i = list.length - 1; i >= 0; i--) {
        fire(list[i], eventType, eventData);
      }
    }
  };
}

/**
 * 通过键(key)检索获取应用存储的值
 * @export
 * @param {String} key
 * @returns {any}
 */
function getStorage(key) {
  return window.localStorage.getItem(key) || '';
}

/**
 * 修改或添加键值(key-value)对数据到应用数据存储中
 * @export
 * @param {String} key
 * @param {any} value
 */
function setStorage(key, value) {
  window.localStorage.setItem(key, value);
}

/**
 * 通过键(key)检索获取对象(objKey)的值
 * @param {any} key
 * @param {any} objKey
 * @returns
 */
function getStorageObject(key, objKey) {
  var obj = JSON.parse(getStorage(key) || '{}');
  var temp = {};
  temp[objKey] = '';
  return mix(true, temp, obj)[objKey];
}

/**
 * 修改或添加键值对数据到对应对象(key)的属性(objKey-value)的值
 * @param {any} key
 * @param {any} objKey
 * @param {any} value
 */
function setStorageObject(key, objKey, value) {
  var obj = JSON.parse(getStorage(key) || '{}');
  obj[objKey] = value;
  setStorage('$state', JSON.stringify(obj));
}

/**
 * 通过键(key)检索获取当前状态
 * @export
 * @param {String} key
 * @returns {any}
 */
function getState(key) {
  return getStorageObject('$state', key);
}

/**
 * 修改或添加键值(key-value)对数据到当前状态
 * @export
 * @param {String} key
 * @param {any} value
 */
function setState(key, value) {
  setStorageObject('$state', key, value);
}

/**
 * 通过键(key)检索获取应用本地配置
 * @export
 * @param {String} key
 * @returns {any}
 */
function getSetting(key) {
  return getStorageObject('$settings', key);
}

/**
 * 修改或添加键值(key-value)对数据到应用本地配置
 * @export
 * @param {String} key
 * @param {any} value
 */
function setSetting(key, value) {
  setStorageObject('$settings', key, value);
}

/**
 * 弹框消息
 */
function confirm$1(msg, options) {
  var onShow = function () {};
  var onHide = function () {};
  var onCancel = function () {};
  var onConfirm = function () {};
  if (isObject(options)) {
    if (options.title && !msg) {
      msg = options.title;
    }
    if (options.onShow) {
      onShow = options.onShow;
    }
    if (options.onHide) {
      onHide = options.onHide;
    }
    if (options.onCancel) {
      onCancel = options.onCancel;
    }
    if (options.onConfirm) {
      onConfirm = options.onConfirm;
    }
  }
  if (msg) {
    onShow();
    if (window.confirm(msg)) {
      onConfirm();
      onHide();
    } else {
      onCancel();
      onHide();
    }
  } else {
    log('confirm无内容,退出');
  }
}

/**
 * 弹框消息
 */
function confirmClose$1() {
  log(os.name + ' 环境 不支持' + ' confirmClose ' + '!');
}

exports.confirm = confirm$1;
var confirmClose = confirmClose$1;

if (os.plus) {
  exports.confirm = function (msg, options) {
    var title = '';
    var confirmText = '确定';
    var cancelText = '取消';
    var onShow = function () {};
    var onHide = function () {};
    var onCancel = function () {};
    var onConfirm = function () {};
    if (isObject(options)) {
      if (options.title) {
        if (msg) {
          title = options.title;
        } else {
          msg = options.title;
        }
      }
      if (options.confirmText) {
        confirmText = options.confirmText;
      }
      if (options.cancelText) {
        cancelText = options.cancelText;
      }
      if (options.onShow) {
        onShow = options.onShow;
      }
      if (options.onHide) {
        onHide = options.onHide;
      }
      if (options.onCancel) {
        onCancel = options.onCancel;
      }
      if (options.onConfirm) {
        onConfirm = options.onConfirm;
      }
    }
    if (msg) {
      onShow();
      window.plus && window.plus.nativeUI.confirm(msg, function (e) {
        if (e.index === 0) {
          onConfirm();
        } else if (e.index === 1) {
          onCancel();
        }
        onHide();
      }, title, [confirmText, cancelText]);
    } else {
      log('confirm无内容,退出');
    }
  };
}

/**
 * 增加back执行流程
 * @export
 * @param {Object} back
 * @returns
 */
function addBack$1(back) {
  return addAction('backs', back);
}

/**
 * 删除back执行流程
 * @export
 * @param {string} 钩子名称
 * @param {string} 钩子排序值
 * @returns
 */
function removeBack$1(name, index) {
  return removeAction('backs', name, index);
}

var _canHistoryBack = window.location.href;
/**
 *  是否可以后退
 * @export
 * @returns {Boolean} 是否可以后退
 */
function canHistoryBack$1() {
  return _canHistoryBack !== window.location.href;
}

function init$1() {
  /**
   * 默认处理-后退
   */
  addBack$1({
    name: 'basic',
    index: 100,
    handle: function () {
      if (canHistoryBack$1() && window.history.length > 1) {
        window.history.back();
        return false;
      } else {
        winClose();
      }
      return true;
    }
  });
}

/**
 * window的关闭页面
 * @export
 */
function winClose() {
  exports.confirm('是否退出应用？', {
    title: '退出',
    confirmText: '退出应用',
    cancelText: '不了',
    onConfirm: function () {
      window.location.href = 'about:blank';
    }
  });
}

var beforeback;
/**
 * 设置back前处理
 * @export
 * @param {Function} preBack
 * @returns
 */
function setPreBack$1(preBack) {
  beforeback = preBack;
}

/**
 * 执行后退(常用用于header的后退)
 * 顺序:msgback > beforeback > back的hooks
 * back的hooks中则更加index的顺序来执行,一般情况下是先 h5+的back 再web的back
 * @export
 * @param {Boolean} closeMsg 是否先执行msg类型的关闭(常用于安卓后退按键的后退),默认值false
 */
function back$1(closeMsg) {
  // 是否有msgBacks钩子
  var hasMsgBacks = actionCount('msgBacks') > 0;
  if (closeMsg === true && hasMsgBacks) {
    // 执行msg关闭
    doAction('msgBacks');
  } else {
    if (beforeback && isFunction(beforeback)) {
      // 执行并判断是否继续,false表示终止
      if (beforeback() === false) {
        return;
      }
    }
    doAction('backs');
  }
}

/**
 * 增加Msg组件关闭的执行流程(比如:alert confirm login popup等)
 * @export
 * @param {type} back
 * @returns
 */
function addMsgBack$1(back) {
  return addAction('msgBacks', back);
}

/**
 * 删除Msg组件关闭的执行流程(比如:alert confirm login popup等)
 * @export
 * @param {string} 钩子名称
 * @param {string} 钩子排序值
 * @returns
 */
function removeMsgBack$1(name, index) {
  // utils.log(name + ' : removeMsgBack')
  return removeAction('msgBacks', name, index);
}

function plusBack$1() {
  log(os.name + ' 环境 不支持 ' + 'plusBack ' + '!');
}
function menu$1() {
  log(os.name + ' 环境 不支持 ' + 'menu ' + '!');
}

var addBack = addBack$1;
var removeBack = removeBack$1;
var addMsgBack = addMsgBack$1;
var removeMsgBack = removeMsgBack$1;
var canHistoryBack = canHistoryBack$1;
var setPreBack = setPreBack$1;
var back = back$1;
exports.plusBack = plusBack$1;
exports.menu = menu$1;
var init = init$1;

function __back() {
  back(true);
}
function __menu() {
  exports.menu();
}

/**
 * 首次按下back按键的时间
 */
var __backFirst = null;

/**
 * webview 关闭或隐藏
 * 提示‘再按一次退出应用’的时候返回false,其他情况都返回true
 * @param {any} wobj
 * @returns {Boolean} 是否执行了关闭或隐藏操作
 */
function closeWebView(wobj) {
  // 是否首页
  if (wobj.id === window.plus.runtime.appid) {
    // 首页，后退实际上应该是退出应用
    // 首次按键，提示‘再按一次退出应用’
    if (!__backFirst) {
      __backFirst = new Date().getTime();
      // 特别只使用plus,而不用 $api.toast
      // 主要是plus.nativeUI.toast可以穿透所有窗口
      window.plus.nativeUI.toast('再按一次退出应用');
      setTimeout(function () {
        __backFirst = null;
      }, 2000);
      return false;
    } else {
      if (new Date().getTime() - __backFirst < 2000) {
        // 应用退出
        window.plus.runtime.quit();
      }
      return true;
    }
  } else {
    // 其他页面
    if (wobj.preload) {
      wobj.hide('auto');
    } else {
      // 只关闭当前页面自身
      // 其打开的所有子页面 暂不处理
      wobj.close();
    }
    return true;
  }
}

if (os.plus) {
  init = function () {
    /**
     * 5+ back
     */
    addBack({
      name: 'basic',
      index: 100,
      handle: function () {
        if (!window.plus) {
          return true;
        } else {
          exports.plusBack();
          return false;
        }
      }
    });
  };

  exports.plusBack = function () {
    // console.log('plusBack')
    if (window.plus) {
      var wobj = window.plus.webview.currentWebview();
      var parent = wobj.parent();
      if (parent) {
        // 激活父窗体的back事件
        fire$1(parent, 'fromChildrenBack');
        // 只是通知,没执行关闭或隐藏操作,所以返回false
        return false;
      } else {
        if (canHistoryBack() && window.history.length > 1) {
          window.history.back();
          // 执行关闭或隐藏操作,所以返回true
          return true;
        } else {
          return closeWebView(wobj);
        }
      }
    }
  };

  exports.menu = function () {
    // 菜单
    var menu = document.querySelector('.action-menu');
    if (menu) {
      // 打开菜单
    } else {
      // 执行父窗口的menu
      if (window.plus) {
        var wobj = window.plus.webview.currentWebview();
        var parent = wobj.parent();
        if (parent) {
          fire$1(parent, 'fromChildrenMenu');
        }
      }
    }
  };
}

/**
 * 弹框消息
 */
function alert$1(msg, options) {
  var onShow = function () {};
  var onHide = function () {};
  if (isObject(options)) {
    if (options.title && !msg) {
      msg = options.title;
    }
    if (options.onShow) {
      onShow = options.onShow;
    }
    if (options.onHide) {
      onHide = options.onHide;
    }
  }
  if (msg) {
    onShow();
    window.alert(msg);
    onHide();
  } else {
    log('alert无内容,退出');
  }
}

/**
 * 弹框消息
 */
function alertClose$1() {
  log(os.name + ' 环境 不支持' + ' alertClose ' + '!');
}

exports.alert = alert$1;
var alertClose = alertClose$1;

if (os.plus) {
  exports.alert = function (msg, options) {
    var title = '';
    var buttonText = '确定';
    var onShow = function () {};
    var onHide = function () {};
    if (isObject(options)) {
      if (options.title) {
        if (msg) {
          title = options.title;
        } else {
          msg = options.title;
        }
      }
      if (options.buttonText) {
        buttonText = options.buttonText;
      }
      if (options.onShow) {
        onShow = options.onShow;
      }
      if (options.onHide) {
        onHide = options.onHide;
      }
    }
    if (msg) {
      onShow();
      window.plus && window.plus.nativeUI.alert(msg, onHide, title, buttonText, 'div');
    } else {
      log('alert无内容,退出');
    }
  };
}

/**
 * 提示消息
 */
function toast$1() {
  log(os.name + ' 环境 不支持' + ' toast ' + '!');
}

/**
 * 提示消息
 */
function toastClose$1() {
  log(os.name + ' 环境 不支持' + ' toastClose ' + '!');
}

exports.toast = toast$1;
var toastClose = toastClose$1;

if (os.plus) {
  exports.toast = function (msg, options) {
    var time = 2000;
    var onShow = function () {};
    var onHide = function () {};
    if (isObject(options)) {
      if (options.time) {
        time = options.time;
      }
      time = time <= 2000 ? 2000 : 3500;
      if (options.onShow) {
        onShow = options.onShow;
      }
      if (options.onHide) {
        onHide = options.onHide;
      }
      if (!options.position) {
        options.position = 'bottom';
      }
    }
    if (msg) {
      onShow();
      window.plus && window.plus.nativeUI.toast(msg, {
        duration: time === 2000 ? 'short' : 'long',
        verticalAlign: options.position
      });
      setTimeout(function () {
        onHide();
      }, time);
    } else {
      log('toast无内容,退出');
    }
  };
}

/**
 * loading
 */
function loading$1() {
  log(os.name + ' 环境 不支持' + ' loading ' + '!');
}

/**
 * loading 关闭
 */
function loadingClose$1() {
  log(os.name + ' 环境 不支持' + ' loadingClose ' + '!');
}

exports.loading = loading$1;
exports.loadingClose = loadingClose$1;
var loadingonHide = function () {};
if (os.plus) {
  exports.loading = function (msg, options) {
    if (!msg) {
      msg = '载入中';
    }
    var onShow = function () {};
    loadingonHide = function () {};
    if (isObject(options)) {
      if (options.onShow) {
        onShow = options.onShow;
      }
      if (options.onHide) {
        loadingonHide = options.onHide;
      }
    }
    if (msg) {
      onShow();
      var bodyFontSize = getStyle(document.body).fontSize;
      var waitingSize = bodyFontSize.replace('px', '') * 1 * 7.875 + 'px';
      window.plus && window.plus.nativeUI.showWaiting(msg, {
        modal: true,
        round: '10px',
        width: waitingSize,
        height: waitingSize,
        size: bodyFontSize,
        padding: '10px',
        background: 'rgba(0,0,0,0.8)',
        color: '#fff',
        back: 'transmit'
      });
    } else {
      log('loading无内容,退出');
    }
  };
  exports.loadingClose = function () {
    window.plus && window.plus.nativeUI.closeWaiting();
    loadingonHide();
  };
}

var _this = undefined;

exports.currentWebview = currentWebview;
exports.opener = opener;
exports.isHomePage = isHomePage;
exports.open = open;
exports.goHome = goHome;
var onload$1 = onload;
var mounted$1 = mounted;
exports.showWindow = showWindow;
exports.hideWindow = hideWindow;
exports.closeWindow = closeWindow;

var loadingTitle = '载入中';
// 默认打开窗口样式配置
var defaultWin = {
  scalable: false,
  bounce: ''
};
// 默认窗口显示配置
var defaultShow = {
  duration: os.ios ? 300 : 200,
  aniShow: 'slide-in-right'
};
// 默认窗口隐藏配置
var defaultHide = {
  duration: os.ios ? 300 : 200,
  aniHide: 'slide-out-right'
};
var _currentWebview = null;

if (os.plus) {
  exports.currentWebview = function () {
    if (window.plus) {
      if (_currentWebview === null) {
        _currentWebview = plus.webview.currentWebview();
      }
    }
    return _currentWebview;
  };

  exports.opener = function () {
    if (exports.currentWebview()) {
      return exports.currentWebview().opener();
    } else {
      return null;
    }
  };

  exports.isHomePage = function () {
    if (window.plus) {
      return exports.currentWebview().id === window.plus.runtime.appid;
    } else {
      return isHomePage;
    }
  };
  /**
   * 显示指定窗口
   * @export
   * @param {any} webview
   * @param {Boolean} showLoading 默认值true
   */
  exports.showWindow = function (webview, showLoading, showOpts) {
    if (window.plus) {
      if (isString(webview)) {
        webview = plus.webview.getWebviewById(webview);
      }
      if (webview) {
        // utils.log('窗体存在!')
        if (showLoading !== false) {
          exports.loading(loadingTitle, {
            onShow: function () {
              setTimeout(function () {
                exports.loadingClose();
              }, os.ios ? 1000 : 900);
            }
          });
        }
        showOpts = mix(true, defaultShow, showOpts);
        // console.log(showOpts)
        // ios系统不延时此处的fire不生效，150
        setTimeout(function () {
          exports.fireTree(webview, 'manualshow', showOpts);
        }, os.ios ? 150 : 1);
      } else {
        log('窗体不存在!');
        return;
      }
    } else {
      log(os.name + ' 环境 不支持 ' + 'showWindow ' + '!');
      return;
    }
  };

  /**
   * 隐藏指定窗口
   * @export
   * @param {any} webview
   */
  exports.hideWindow = function (webview, hideOpts) {
    if (window.plus) {
      hideOpts = mix(true, defaultHide, hideOpts);
      plus.webview.hide(webview, hideOpts.aniHide, hideOpts.duration);
    } else {
      log(os.name + ' 环境 不支持 ' + 'hideWindow ' + '!');
    }
  };

  /**
   * 关闭指定窗口
   * @export
   * @param {any} webview
   */
  exports.closeWindow = function (webview, hideOpts) {
    if (window.plus) {
      hideOpts = mix(true, defaultHide, hideOpts);
      plus.webview.close(webview, hideOpts.aniHide, hideOpts.duration);
    } else {
      log(os.name + ' 环境 不支持 ' + 'closeWindow ' + '!');
    }
  };

  /**
   * 打开新页面
   * web,5+ 有效
   * web:直接打开新url
   * 5+:打开新窗口
   * @export
   * @param {String} id
   * @param {Object} opts {extras,styles,showOpts}
   * @returns
   */
  exports.open = function (id, opts) {
    if (!id) {
      log('open id不能为空!');
      return;
    }
    opts = opts || {};
    opts.extras = opts.extras || {};
    opts.styles = opts.styles || {};
    opts.showOpts = opts.showOpts || {};
    var url = pages[id] || id;
    var webview = null;

    if (window.plus) {
      // 如果是首页就执行 goHome()
      if (id === 'index') {
        webview = plus.webview.getLaunchWebview();
        exports.goHome();
      } else {
        webview = plus.webview.getWebviewById(id);
        if (webview) {
          // 显示已存在窗口
          console.log('显示已存在窗口');
          exports.loading(loadingTitle, {
            onShow: function () {
              setTimeout(function () {
                exports.loadingClose();
              }, os.ios ? 1000 : 900);
            }
          });
          setTimeout(function () {
            exports.showWindow(webview, false, opts.showOpts);
          }, 500);
          return webview;
        }
        // 创建新窗口
        webview = createWindow(url, id, opts.styles, opts.extras);
        exports.showWindow(webview, true, opts.showOpts);
      }
    } else {
      window.location.href = url;
    }
    return webview;
  };

  exports.goHome = function () {
    if (window.plus) {
      exports.loading(loadingTitle);
      var webview = window.plus.webview.getLaunchWebview();
      var top = window.plus.webview.getTopWebview();
      var _all = window.plus.webview.all();
      _all.forEach(function (el) {
        if (el.id !== webview.id && top.id !== el.id) {
          el.close('none');
        }
      }, _this);
      setTimeout(function () {
        exports.loadingClose();
        setTimeout(function () {
          top.close(defaultHide.aniHide, defaultHide.duration + 100);
        }, 100);
      }, 300);
    } else {
      open('index');
    }
  };
}

/**
 * 创建Webview窗口，用于加载新的HTML页面，可通过styles设置Webview窗口的样式，创建完成后需要调用show方法才能将Webview窗口显示出来。
 * @param {any} url
 * @param {any} id
 * @param {any} styles
 * @param {any} extras
 * @returns
 */
function createWindow(url, id, styles, extras) {
  if (!window.plus) {
    return;
  }
  var webview;
  if (!webview) {
    webview = window.plus.webview.create(url, id, mix(defaultWin, styles), extras);
  }
  return webview;
}

/**
 * 监听back和menu按键
 * @export
 */
function androidKeys$1() {
  log(os.name + ' 环境 不支持 ' + 'androidKeys ' + '!');
}
/**
 * 是否网络无连接
 * @export
 * @returns {Boolean} fase:有网络 true:无网络
 */
function noNetwork$1() {
  log(os.name + ' 环境 不支持 ' + 'noNetwork ' + '!');
  return false;
}
/**
 * 从系统相册选择文件（图片或视频）
 * @export
 */
function pick$1(success, error, options) {
  log(os.name + ' 环境 不支持 ' + 'pick ' + '!');
}
/**
 * 进行拍照操作
 * @export
 */
function captureImage$1() {
  log(os.name + ' 环境 不支持 ' + 'captureImage ' + '!');
}
/**
 * 图片压缩转换
 * @export
 */
function compressImage$1() {
  log(os.name + ' 环境 不支持 ' + 'compressImage ' + '!');
}

exports.androidKeys = androidKeys$1;
exports.noNetwork = noNetwork$1;
exports.pick = pick$1;
exports.captureImage = captureImage$1;
exports.compressImage = compressImage$1;
if (os.plus) {
  /**
   * 监听back和menu按键
   * @export
   */
  exports.androidKeys = function () {
    if (window.plus && os.android) {
      // back
      plus.key.removeEventListener('backbutton', __back, false);
      plus.key.addEventListener('backbutton', __back, false);
      // menu
      plus.key.removeEventListener('menubutton', __menu, false);
      plus.key.addEventListener('menubutton', __menu, false);
    }
  };

  /**
   * 是否网络无连接
   * @export
   * @returns {Boolean} fase:有网络 true:无网络
   */
  exports.noNetwork = function () {
    if (window.plus) {
      var nt = window.plus.networkinfo.getCurrentType();
      if (nt === window.plus.networkinfo.CONNECTION_NONE) {
        return true;
      }
    }
    return false;
  };

  /**
   * 从系统相册选择文件（图片或视频）
   * @param {function} success success(files) [array]files
   * @param {function} error error(err) err.code err.message
   * @param {object} options http://www.html5plus.org/doc/zh_cn/gallery.html#plus.gallery.GalleryOptions
   * @export
   */
  exports.pick = function (success, error, options) {
    if (window.plus) {
      options = options || {};
      window.plus.gallery.pick(function (e) {
        var files = [];
        if (e && e.files) {
          files = e.files;
        } else {
          files.push(e);
        }
        success(files);
      }, function (err) {
        error(err);
      }, options);
    }
  };

  /**
   * 进行拍照操作
   * @param {function} success success(file) 
   * @param {function} error error(err) err.code err.message
   * @param {object} options http://www.html5plus.org/doc/zh_cn/camera.html#plus.camera.CameraOption
   * @export
   */
  exports.captureImage = function (success, error, options) {
    if (window.plus) {
      options = options || {};
      var cmr = window.plus.camera.getCamera();
      cmr.captureImage(function (file) {
        success(file);
      }, function (err) {
        error(err);
      }, options);
    }
  };

  /**
   * 图片压缩转换
   * @param {object} options http://www.html5plus.org/doc/zh_cn/zip.html#plus.zip.CompressImageOptions
   * @param {function} success success(zip)  http://www.html5plus.org/doc/zh_cn/zip.html#plus.zip.CompressImageSuccessCallback
   * @param {function} error error(err) err.code err.message
   * @export
   */
  exports.compressImage = function (options, success, error) {
    if (window.plus) {
      options = options || {};
      window.plus.zip.compressImage(options, function (zip) {
        success(zip);
      }, function (err) {
        error(err);
      });
    }
  };
}

onload$1(function () {
  init();
  document.addEventListener('manualshow', function (e) {
    if (window.plus) {
      var w = window.plus.webview.currentWebview();
      // fixed:排除已经是TopWebview的情况 2016年12月16日
      var isTop = w === window.plus.webview.getTopWebview();
      // 如果已经显示但不是TopWebview的情况
      if (w.isVisible() && !isTop) {
        w.hide('none');
        setTimeout(function () {
          w.show(e.detail.aniShow, e.detail.duration + 100);
        }, 500);
      } else {
        w.show(e.detail.aniShow, e.detail.duration);
      }
    }
  });
  document.addEventListener('fromChildrenBack', __back);
  document.addEventListener('fromChildrenMenu', __menu);
});

exports.getType = getType;
exports.isString = isString;
exports.isRegExp = isRegExp;
exports.isFunction = isFunction;
exports.isDate = isDate;
exports.isArray = isArray;
exports.isWindow = isWindow;
exports.isObject = isObject;
exports.isPlainObject = isPlainObject;
exports.mix = mix;
exports.delHtmlTag = delHtmlTag;
exports.equals = equals;
exports.log = log;
exports.tpl = tpl;
exports.getStyle = getStyle;
exports.toFixed = toFixed;
exports.formatDate = formatDate;
exports.capitalize = capitalize;
exports.uppercase = uppercase;
exports.lowercase = lowercase;
exports.pluralize = pluralize;
exports.currency = currency;
exports.number = number;
exports.os = os;
exports.doAction = doAction;
exports.addAction = addAction;
exports.removeAction = removeAction;
exports.actionCount = actionCount;
exports.fire = fire;
exports.getStorage = getStorage;
exports.setStorage = setStorage;
exports.getState = getState;
exports.setState = setState;
exports.getSetting = getSetting;
exports.setSetting = setSetting;
exports.addBack = addBack;
exports.removeBack = removeBack;
exports.addMsgBack = addMsgBack;
exports.removeMsgBack = removeMsgBack;
exports.canHistoryBack = canHistoryBack;
exports.setPreBack = setPreBack;
exports.back = back;
exports.alertClose = alertClose;
exports.confirmClose = confirmClose;
exports.toastClose = toastClose;
exports.pages = pages;
exports.addPage = addPage;
exports.onload = onload$1;
exports.mounted = mounted$1;