import {
  os
} from '../h5/os.js'

const ua = navigator.userAgent

os.plus = false
os.stream = false

//  5+ Browser
let match = ua.match(/Html5Plus/i)
if (match) {
  os.name += ' h5+'
  os.plus = true
  // document.body.classList.add( $.className( 'plus' ) )
}

// 最好有流应用自己的标识
match = ua.match(/StreamApp/i)
if (match) {
  os.name += ' stream'
  os.stream = true
  // document.body.classList.add( $.className( 'plus-stream' ) )
}

export {
  os
}
