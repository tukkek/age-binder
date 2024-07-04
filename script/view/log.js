import * as engine from '../control/engine.js'
import * as debug from '../control/debug.js'

const VIEW=document.querySelector('#log')
const ELEMENTS=VIEW.querySelectorAll('span')
const LOG=ELEMENTS[0]

class Page{
  constructor(message){
    this.message=message
    let w=engine.world
    this.year=w.year
    this.age=w.age
  }
  
  toString(){
    let date=[this.year,this.age].map(d=>d.toLocaleString())
    return `${this.message} - year ${date[0]}, age ${date[1]}.`
  }
}

export var entries=[]

function expand(){
  let log=entries.slice(1).map(e=>e.toString()).join('\n')
  window.alert(log)
}

export function setup(){
  enter(engine.world.name)
  ELEMENTS[0].onclick=expand
  VIEW.classList.remove('hidden')
  update()
}

export function update(){
  LOG.textContent=entries[entries.length-1].message
  let w=engine.world
  ELEMENTS[1].textContent=w.year.toLocaleString()
  ELEMENTS[2].textContent=w.age.toLocaleString()
  if(!debug.on) return
  let p=engine.pulse
  p=(p[1]-p[0])/1000
  ELEMENTS[3].textContent=` (${p.toFixed(1)}s)`
}

export function enter(message){
  entries.push(new Page(message))
  console.log(message)
}
