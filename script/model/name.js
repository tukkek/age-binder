import * as rpg from '../control/rpg.js'

const COUNTRIES=['bangladesh','brazil','china',
                  'india','indonesia','mexico',
                  'nigeria','pakistan','russia',
                  'us']
const NAMES=new Map()//country:generator

class Country{
  constructor(names){
    names.male=this.split(names.male)
    this.names=names
    names.female=this.split(names.female)
    names.family=this.split(names.family)
  }
  
  split(names){return names.map(n=>n.toLowerCase().split('.'))}
  
  roll(names){return names[rpg.low(0,names.length-1)]}
  
  generate(names){
    let n=this.roll(names)
    n[0]=this.roll(names)[0]
    let l=n.length
    for(let i=1;i<l-1;i++){
      let mid=false
      while(!mid){
        mid=this.roll(names)
        mid=mid.length>2&&rpg.pick(mid.slice(1,-1))
      }
      n[i]=mid
    }
    if(l>1){
      let last=false
      while(!last){
        last=this.roll(names)
        last=last.length>1&&last[last.length-1]
      }
      n[l-1]=last
    }
    n=n.join('').replaceAll(' ','-')
    if(n[n.length-1]=='-') return this.generate(names)
    return n[0].toUpperCase()+n.slice(1)
  }
  
  get male(){return this.generate(this.names.male)}
  
  get female(){return this.generate(this.names.female)}
  
  get family(){return this.generate(this.names.family)}
}

export async function setup(){
  for(let c of COUNTRIES){
    let names=await fetch(`name/${c}.json`)
    names=await names.json()
    NAMES.set(c,new Country(names))
    
  }
  return Promise.resolve()
}

export function get(country){return NAMES.get(c)}//TODO
