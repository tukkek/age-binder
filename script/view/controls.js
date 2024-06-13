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

function click(control,force=false){
  if(control==selected) return
  if(selected==STEP&&!force) return
  if(selected) selected.classList.remove(SELECTED)
  selected=control
  selected.classList.add(SELECTED)
}

function toggle(){
  if(selected==PLAY) click(PAUSE)
  else if(selected==PAUSE) click(PLAY)
}

export function setup(){
  let show=[VIEW]
  if(debug.on) show.push(SAVE)
  for(let s of show) s.classList.remove('hidden')
  for(let c of CONTROLS.slice(0,3)) c.onclick=event=>click(c)
  window.onkeypress=event=>{if(event.key==' ') toggle()}
  SAVE.onclick=save.store
} 

export function play(){
  if(selected==STEP){
    setTimeout(()=>click(PAUSE,true),3000)
    return PLAY
  }
  return selected==PLAY
}
