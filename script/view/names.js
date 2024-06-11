import * as name from '../control/name.js'
import * as debug from '../control/debug.js'

const VIEW=document.querySelector('#names')
const NAME=VIEW.querySelector('template#name').content.childNodes[0]
const TEXT=VIEW.querySelector('input')
const AMOUNT=5*5

var callback=false

function show(hide=false){VIEW.parentNode.classList.toggle('hidden',hide)}

function promise(callbackp){
  callback=callbackp
  if(debug.debug) callbackp(name.get())
}

export async function get(){return new Promise(promise)}

function choose(name){
  show(false)
  callback(name)
}

function type(){
  let name=TEXT.value
  if(name) choose(name)
}

export async function setup(){
  await name.setup()
  if(debug.debug) return
  let names=new Set()
  while(names.size<AMOUNT) names.add(name.get())
  let children=VIEW.children
  for(let n of names){
    let view=NAME.cloneNode(true)
    view.textContent=n
    view.onclick=()=>choose(n)
    VIEW.insertBefore(view,children[children.length-1])
  }
  show()
  TEXT.onkeypress=event=>{if(event.key=='Enter') type()}
  VIEW.querySelector('button').onclick=type
  TEXT.focus()
}
