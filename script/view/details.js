import * as engine from '../control/engine.js'

const VIEW=document.querySelector('#details')
const RANGE=['Very low','Low',false,'High','Very high']
const WEATHER=['Very cold','Cold',false,'Hot','Very hot']
const TECHNOLOGY=['Average','Barely advanced','Advanced','Very advanced','Extremely advanced']
const SUMMARY=VIEW.querySelector('template#summary').content.children[0]
const DETAILS=VIEW.querySelector('template#details').content.children[0]
const EXPANDED='expanded'
const HEADER=VIEW.querySelector('.header')
const HIDDEN='hidden'

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
  if(all.length==0) return []
  all=Array.from(new Set(all))
  all.sort()
  return all
}

function replace(template){
  let d=Array.from(VIEW.children).filter(c=>c.tagName=='DIV')[1]
  if(d) d.remove()
  template=template.cloneNode(true)
  VIEW.appendChild(template)
  return template
}

export function summarize(hex){
  if(!hex||VIEW.classList.contains(EXPANDED)) return
  VIEW.classList.remove(HIDDEN)
  let parent=replace(SUMMARY)
  HEADER.textContent=hex.name
  let body=[]
  let o=hex.owner
  if(o) body.push(`${o.name}.`)
  let features=[]
  for(let a of hex.area){
    let r=a.resource
    if(r) features.push(r.name.toLowerCase())
    let h=a.holding
    if(h) features.push(h.title)
  }
  if(features.length>0){
    features.sort()
    body.push(encase(features.join('; '))+'.')
  }
  parent.querySelector('.body').textContent=body.join(' ')
  parent.querySelector('.footer').classList.toggle(HIDDEN,!o)
}

function add(text,type,parent){
  let d=document.createElement('div')
  d.classList.add(type)
  d.textContent=text
  parent.appendChild(d)
  return d
}

function space(parent){add('','space',parent)}

function link(element,action){
  element.classList.add('link')
  element.onclick=action
}

function report(section,data,parent){
  space(parent)
  add(section,'section',parent)
  for(let d of data) d=add(d,'detail',parent)
}

function census(hex,extractor){
  let data=Map.groupBy(hex.area,extractor)
  data.delete(false)
  if(data.size==0) return ['None.']
  let keys=Array.from(data.keys())
  let total=keys.map((c)=>data.get(c).length).reduce((a,b)=>a+b,0)
  return keys.map(c=>`${c} (${Math.floor(100*data.get(c).length/total)}%)`)
}

function encase(text){return text[0].toUpperCase()+text.slice(1)}

function trace(family){
  let details=replace(DETAILS)
  let alive=false
  for(let cell of engine.world.area){
    let h=cell.holding
    if(h) for(let p of h.people.filter(p=>p.name[1]==family)){
      space(details)
      link(add(p.name.join(' '),'section',details),()=>talk(p))
      link(add(h.title,'detail',details),()=>enter(h,cell.hex))
      add(p.title,'detail',details)
      alive=true
    }
  }
  if(alive) return
  space(details)
  add('No notable living members.','detail',details)
}

function talk(person,holding,hex){
  HEADER.textContent=`${person.name.join(' ')} ${person.sex}`
  let details=replace(DETAILS)
  space(details)
  let family=person.name[1]
  link(add(`${family} family`,'detail',details),()=>trace(family))
  add(`Age: ${person.age}`,'detail',details)
  report('Position',[],details)
  link(add(`${holding.title}`,'detail',details),()=>enter(holding,hex))
  add(person.title,'detail',details)
}

function enter(holding,hex){
  HEADER.textContent=holding.title
  let details=replace(DETAILS)
  space(details)
  add(`Since ${holding.founded}.`,'detail',details)
  link(add(hex.name,'detail',details),()=>detail(hex,true))
  space(details)
  let people=holding.people
  if(people.length>0){
    report('Notables',[],details)
    for(let p of people.sort((a,b)=>a.level-b.level).reverse()){
      link(add(p.name.join(' '),'detail',details),()=>talk(p,holding,hex))
      add(p.title,'detail',details)
    }
  }
}

function speak(realm){
  HEADER.textContent=`${realm.people} language`
  let details=replace(DETAILS)
  let l=realm.language
  report('Female names',Array.from(new Array(5),()=>`${l.female} ${l.family}`),details)
  report('Male names',Array.from(new Array(5),()=>`${l.male} ${l.family}`),details)
  report('Nouns',Array.from(new Array(5),()=>`${l.province}`),details)
}

function explore(realm){
  HEADER.textContent=realm.name
  let details=replace(DETAILS)
  space(details)
  add(`Since ${realm.founded}`,'detail',details)
  space(details)
  add(`People: ${realm.people}`,'detail',details)
  add(`Culture: ${realm.culture}`,'detail',details)
  link(add('Language','detail',details),()=>speak(realm))
  let families=realm.families
  if(families.length>0){
    report('Families',[],details)
    families.sort()
    for(let f of families)
      link(add(f,'detail',details),()=>trace(f))
  }
}

export function detail(hex,force=false){
  if(VIEW.classList.contains(EXPANDED)&&!force) return
  VIEW.classList.add(EXPANDED)
  HEADER.textContent=hex.name
  let details=replace(DETAILS)
  let o=hex.owner
  let a=hex.area
  if(o){
    space(details)
    link(add(o.name,'detail',details),()=>explore(o))
    let sections=[['Culture',(a)=>a.culture],
                  ['People',(a)=>a.people],]
    for(let s of sections) report(s[0],census(hex,s[1]),details)
    let t=describe((o.technology-1)/5,TECHNOLOGY)+'.'
    report('Technology',[t],details)
    let holdings=a.filter(a=>a.holding).map(a=>a.holding)
    if(holdings.length>0){
      report('Holdings',[],details)
      for(let h of holdings) link(add(h.title,'detail',details),()=>enter(h,hex))
    }
    let resources=a.filter(a=>a.resource&&a.owner).map(a=>a.resource.name)
    if(resources.length>0) report('Resources',resources,details)
  }
  let geography=[extract(a.map(cell=>cell.biome).map(b=>encase(b))),
                  describe(scan(hex,(cell)=>cell.weather),WEATHER),
                  describe(scan(hex,(cell)=>cell.elevation)),]
  report('Geography',geography.filter(g=>g),details)
  let waters=collect(a.filter(cell=>!cell.sea&&cell.water).map(cell=>cell.water)).map(w=>encase(w))
  if(waters.length>0) report('Waters',waters,details)
}

function dodge(){if(!VIEW.classList.contains(EXPANDED)) VIEW.classList.toggle('right')}

function close(event=false){
  if(event) event.stopPropagation()
  VIEW.classList.remove(EXPANDED)
  VIEW.classList.add(HIDDEN)
}

export function setup(){
  VIEW.onmouseover=dodge
  VIEW.querySelector('a.close').onclick=close
  window.addEventListener('keyup',(event)=>{if(event.key=='Escape') close()})
}
