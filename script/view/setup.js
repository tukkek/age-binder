import * as debug from '../control/debug.js'
import * as rpg from '../control/rpg.js'
import * as shiva from '../control/director/shiva.js'
import * as color from '../model/color.js'
import * as worship from '../model/worship.js'
import * as namem from '../model/name.js'

const VIEW=document.querySelector('#setup')
const SCENARIO=VIEW.querySelector('input')
const LISTS=VIEW.querySelector('.lists')
const LIST=LISTS.querySelector('template#list').content.children[0]

var callback=false

function show(show=true){VIEW.parentNode.classList.toggle('hidden',!show)}

export async function open(){
  if(!debug.on) return new Promise((callbackp)=>callback=callbackp)
  generate()
  return Promise.resolve()
}

export function name(){return SCENARIO.value||randomize()}

function generate(){
  show(false)
  let lists=Array.from(LISTS.querySelectorAll('.list'))
  let values=lists.map(l=>l.querySelector('textarea').value.split('\n'))
  if(!debug.on)
    for(let i=0;i<lists.length;i++)
      if(lists[i].querySelector('input[type=checkbox]').checked)
        rpg.shuffle(values[i])
  let nvalues=Math.min(...values.map(l=>l.length))
  let p=shiva.Realm.pool
  for(let i=0;i<nvalues;i++) 
    p.push(new shiva.Realm(...values.map(values=>values[i])))
  if(callback) callback()
}

function randomize(){return namem.scenario.get()}

function populate(list,preset=false){
  let s=list.querySelector('select')
  let p=preset||s.options[s.selectedIndex].preset
  if(!p) return
  list.querySelector('textarea').value=p.values.join('\n')  
  s.selectedIndex=0
}

function list(header,presets=[]){
  let initial=presets[0]
  let l=LIST.cloneNode(true)
  l.querySelector('.header').textContent=header
  let s=l.querySelector('select')
  presets=Array.from(presets)
  presets.sort((a,b)=>a.name.localeCompare(b.name))
  for(let p of presets){
    let o=document.createElement('option')
    o.textContent=p.name
    o.preset=p
    s.appendChild(o)
  }
  s.onchange=()=>populate(l)
  populate(l,initial)
  LISTS.appendChild(l)
}

export async function setup(){
  await namem.setup()
  list('Colors',color.presets)
  list('Peoples',namem.presets)
  list('Cultures',worship.presets)
  if(debug.on) return
  show()
  SCENARIO.onkeypress=event=>{if(event.key=='Enter') generate()}
  SCENARIO.focus()
  VIEW.querySelector('.name button').onclick=()=>SCENARIO.value=randomize()
  VIEW.querySelector('.generate').onclick=generate
}
