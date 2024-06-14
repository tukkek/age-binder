import * as engine from '../control/engine.js'

const VIEW=document.querySelector('#summary')
const DETAIL=VIEW.querySelector('template#detail').content.children[0]
const RESOURCES='resources'
const ELEVATION='elevation'
const BIOME='biome'
const WATERS='waters'
const WEATHER='weather'
const DETAILS=new Map([BIOME,ELEVATION,RESOURCES,WATERS,WEATHER].map(detail=>[detail,false]))
const RANGE=['very low','low','average','high','very high']
const WEATHERRANGE=['very cold','cold','temperate','hot','very hot']

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

function extract(array){
  let common=[false,0]
  let count=new Map()
  for(let a of array){
    let c=count.get(a)||0
    c+=1
    count.set(a,c)
    if(c>common[1]) common=[a,c]
  }
  return common[0]
}

function collect(all){
  all=all.filter(a=>a)
  if(all.length==0) return 'none'
  all=Array.from(new Set(all))
  all.sort()
  return all.join(', ')
}

export function show(hex){
  VIEW.classList.remove('hidden')
  if(showing==hex) return false
  showing=hex
  let a=hex.area
  describe(ELEVATION,scan(hex,cell=>cell.elevation))
  describe(WEATHER,scan(hex,cell=>cell.weather),WEATHERRANGE)
  let descriptions=new Map()
  descriptions.set(BIOME,extract(a.map(cell=>cell.biome)))
  let resources=a.map(cell=>cell.resource&&cell.resource.name)
  descriptions.set(RESOURCES,collect(resources))
  let waters=collect(a.map(cell=>cell.sea?'open sea':cell.water))
  descriptions.set(WATERS,waters)
  for(let d of descriptions.keys())
    DETAILS.get(d).textContent=descriptions.get(d)
}

export function setup(){
  VIEW.onmouseover=()=>VIEW.classList.toggle('right')
  for(let d of DETAILS.keys()){
    let view=DETAIL.cloneNode(true)
    let name=d[0].toUpperCase()+d.slice(1)
    let spans=view.querySelectorAll('span')
    spans[0].textContent=name
    DETAILS.set(d,spans[1])
    VIEW.appendChild(view)
  }
}
