/**
 * 首字母大写
 * 'abc' => 'Abc'
 * @param {any} value
 * @returns
 */
function capitalize(value) {
  if (!value && value !== 0) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

/**
 * 大写
 * 'abc' => 'ABC'
 * @param {any} value
 * @returns
 */
function uppercase(value) {
  return (value || value === 0) ? value.toString().toUpperCase() : ''
}

/**
 * 小写
 * 'AbC' => 'abc'
 * @param {any} value
 * @returns
 */
function lowercase(value) {
  return (value || value === 0) ? value.toString().toLowerCase() : ''
}
// http://www.css88.com/doc/lodash/#_debouncefunc-wait0-options

var _pluralize = require('pluralize')

/**
 * 单词复数
 * @param {String} value 待处理的单词
 * @param {Number} count 次数
 * @param {Boolean} inclusive 包含次数
 */
function pluralize(value, count, inclusive) {
  return _pluralize(value, count, inclusive)
}

var accounting = require('accounting')
accounting.settings = {
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
}

function currency(value, opts) {
  return accounting.formatMoney(value, opts || {})
}

function number(value, opts) {
  return accounting.formatNumber(value, opts || {})
}

export {
  capitalize,
  uppercase,
  lowercase,
  pluralize,
  currency,
  number
}
