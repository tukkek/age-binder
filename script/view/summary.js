import * as engine from '../control/engine.js'

const VIEW=document.querySelector('#summary')
const DETAIL=VIEW.querySelector('template#detail').content.children[0]
const RESOURCES='resources'
const ELEVATION='elevation'
const DETAILS=new Map([ELEVATION,RESOURCES].map(detail=>[detail,false]))
const RANGE=['very low','low','average','high','very high']

var showing=false

function describe(detail,value,range=RANGE){
  let i=Math.floor(value/.2)
  if(i>4) i=4
  else if(i<0) i=0
  DETAILS.get(detail).textContent=range[i]
}

function scan(hex,extractor){
  let data=hex.area.map(extractor)
  data.sort()
  return data[Math.floor(data.length/2)]
}

export function show(hex){
  setup()
  if(showing==hex) return false
  showing=hex
  describe(ELEVATION,scan(hex,cell=>cell.elevation))
  let resources=hex.area.map(cell=>cell.resource)
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
