import * as engine from '../control/engine.js'

const VIEW=document.querySelector('#summary')
const POLITICS=VIEW.querySelector('.geopolitics')
const GEOGRAPHY=VIEW.querySelector('.geography')
const RANGE=['very low','low',false,'high','very high']
const WEATHERRANGE=['very cold','cold',false,'hot','very hot']

var showing=false

function describe(value,range=RANGE){
  let i=Math.floor(value/.2)
  if(i>4) return range[4]
  if(i<0) return range[0]
  return range[i]
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
  if(all.length==0) return false
  all=Array.from(new Set(all))
  all.sort()
  return all.join('; ')
}

function print(details,target){
  details=details.filter(d=>d).join('; ').trim()
  target.textContent=details.length==0?'':details[0].toUpperCase()+details.slice(1)+'.'
}

export function show(hex){
  if(!hex) return
  VIEW.classList.remove('hidden')
  if(showing==hex) return false
  showing=hex
  let o=hex.owner
  let a=hex.area
  let politics=[o?o.name:'unclaimed',]
  politics.push(...a.map(cell=>cell.resource&&cell.resource.name).filter(r=>r))
  print(politics,POLITICS)
  let geography=[extract(a.map(cell=>cell.biome)),
                  describe(scan(hex,(cell)=>cell.weather),WEATHERRANGE),
                  describe(scan(hex,(cell)=>cell.elevation)),
                  collect(a.map(cell=>!cell.sea&&cell.water)),]
  print(geography,GEOGRAPHY)
}

export function setup(){VIEW.onmouseover=()=>VIEW.classList.toggle('right')}
