import * as debug from '../control/debug.js'
import * as rpg from '../control/rpg.js'
import * as shiva from '../control/director/shiva.js'
import * as color from '../model/color.js'
import * as worship from '../model/worship.js'
import * as name from '../model/name.js'

const VIEW=document.querySelector('#setup')
const TEXT=VIEW.querySelector('input')
const LISTS=VIEW.querySelector('.lists')
const LIST=LISTS.querySelector('template#list').content.children[0]

var callback=false

function show(hide=false){VIEW.parentNode.classList.toggle('hidden',hide)}

function promise(callbackp){
  callback=callbackp
  if(debug.on) callbackp(name.get())
}

export async function get(){return new Promise(promise)}

function generate(){
  if(!TEXT.value) randomize()
  show(false)
  let lists=Array.from(LISTS.querySelectorAll('.list'))
  let values=lists.map(l=>l.querySelector('textarea').value.split('\n'))
  for(let i=0;i<lists.length;i++)
    if(lists[i].querySelector('input[type=checkbox]').checked)
      rpg.shuffle(values[i])
  let nvalues=Math.min(...values.map(l=>l.length))
  let p=shiva.Realm.pool
  for(let i=0;i<nvalues;i++) p.push(new shiva.Realm(...values.map(values=>values[i])))
  callback(TEXT.value)
}

function randomize(){TEXT.value=name.scenario.get()}

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
  await name.setup()
  if(debug.on) return
  list('Colors',color.presets)
  list('Peoples',name.presets)
  list('Cultures',worship.presets)
  show()
  TEXT.onkeypress=event=>{if(event.key=='Enter') generate()}
  TEXT.focus()
  VIEW.querySelector('.name button').onclick=randomize
  VIEW.querySelector('.generate').onclick=generate
}
