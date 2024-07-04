import * as engine from '../control/engine.js'
import * as debug from '../control/debug.js'
import * as save from '../control/save.js'

const VIEW=document.querySelector('#controls')
const CONTROLS=Array.from(VIEW.children)
const SELECTED='selected'
const PAUSE=CONTROLS[1]
const PLAY=CONTROLS[0]
const STEP=CONTROLS[2]
const SAVE=CONTROLS[3]

var selected=PLAY

function click(control){
  if(control==selected) return
  if(selected) selected.classList.remove(SELECTED)
  selected=control
  selected.classList.add(SELECTED)
}

function toggle(){
  if(selected==PLAY) click(PAUSE)
  else if(selected==PAUSE) click(PLAY)
}

function press(event){
  let k=event.key
  if(k==' ') toggle()
  else if(k=='ArrowRight') click(STEP)
}

export function setup(){
  let show=[VIEW]
  if(debug.on) show.push(SAVE)
  for(let s of show) s.classList.remove('hidden')
  for(let c of CONTROLS.slice(0,3)) c.onclick=event=>click(c)
  window.onkeyup=press
  SAVE.onclick=save.store
} 

export function play(){return selected==PLAY||selected==STEP}

export function step(){if(selected==STEP) click(PAUSE)}
