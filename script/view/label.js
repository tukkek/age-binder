import * as engine from '../control/engine.js'
import * as debug from '../control/debug.js'

const VIEW=document.querySelector('#label')
const ELEMENTS=VIEW.querySelectorAll('span')
const NAME=ELEMENTS[0]


function rename(){
  NAME.textContent=window.prompt('World name?',NAME.textContent)
}

export function setup(){NAME.onclick=rename}

export function update(){
  let w=engine.world
  ELEMENTS[1].textContent=w.year
  ELEMENTS[2].textContent=w.age
  if(!debug.debug) return
  let p=engine.pulse
  ELEMENTS[3].textContent=` (${p[1]-p[0]}ms)`
}
