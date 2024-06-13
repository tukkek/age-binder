import * as engine from '../control/engine.js'

const VIEW=document.querySelector('#summary')
const DETAIL=VIEW.querySelector('template#detail').content.children[0]
const RESOURCES='resources'
const DETAILS=new Map([RESOURCES].map(detail=>[detail,false]))

var showing=false

export function show(hex){//TODO
  setup()
  if(showing==hex) return false
  showing=hex
  let resources=hex.area.map(a=>engine.world.grid[a.x][a.y].resource)
                  .filter(r=>r).map(r=>r.name)
  if(resources.length>0){
    resources=Array.from(new Set(resources))
    resources.sort()
    resources=resources.join(', ')
  }else resources='none'
  DETAILS.get(RESOURCES).textContent=resources
}

export function setup(){
  if(showing) return
  let classes=VIEW.classList
  classes.remove('hidden')
  VIEW.onmouseover=()=>classes.toggle('right')
  for(let d of DETAILS.keys()){
    let view=DETAIL.cloneNode(true)
    let name=d[0].toUpperCase()+d.slice(1)
    let spans=view.querySelectorAll('span')
    spans[0].textContent=name
    DETAILS.set(d,spans[1])
    VIEW.appendChild(view)
  }
}
