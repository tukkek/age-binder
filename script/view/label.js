import * as engine from '../control/engine.js'
import * as debug from '../control/debug.js'

const VIEW=document.querySelector('#label')
const ELEMENTS=VIEW.querySelectorAll('span')
const NAME=ELEMENTS[0]

function rename(){
  let w=engine.world
  w.name=window.prompt('World name?',w.name)
  NAME.textContent=w.name
}

export function setup(){
  NAME.onclick=rename
  NAME.textContent=engine.world.name
  VIEW.classList.remove('hidden')
}

export function update(){
  let w=engine.world
  ELEMENTS[1].textContent=w.year.toLocaleString()
  ELEMENTS[2].textContent=w.age.toLocaleString()
  if(!debug.profile) return
  let p=engine.pulse
  p=(p[1]-p[0])/1000
  ELEMENTS[3].textContent=` (${p.toFixed(1)}s)`
}
