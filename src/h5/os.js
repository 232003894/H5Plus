const ua = navigator.userAgent

let os = {
  name: 'web',
  wechat: false,
  version: 0,
  android: false,
  isBadAndroid: false,
  ios: false,
  ipad: false,
  iphone: false
}

// wechat
let match = ua.match(/(MicroMessenger)\/([\d.]+)/i)
if (match) {
  os.name += ' wechat'
  os.wechat = match[2].replace(/_/g, '.')
}
// android
match = ua.match(/(Android);?[\s/]+([\d.]+)?/)
if (match) {
  os.name += ' android'
  os.android = true
  os.version = match[2]
  os.isBadAndroid = !(/Chrome\/\d/.test(window.navigator.appVersion))
}
// ipad
match = ua.match(/(iPad).*OS\s([\d_]+)/)
if (match) {
  os.name += ' iPad'
  os.ios = os.ipad = true
  os.version = match[2].replace(/_/g, '.')
}
// iphone
match = ua.match(/(iPhone\sOS)\s([\d_]+)/)
if (!os.ipad && match) {
  os.name += ' iPhone'
  os.ios = os.iphone = true
  os.version = match[2].replace(/_/g, '.')
}

export {
  os
}
