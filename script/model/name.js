import * as rpg from '../control/rpg.js'

const COUNTRIES=['bangladesh','brazil','china',
                  'india','indonesia','mexico',
                  'nigeria','pakistan','russia',
                  'us','japan','germany','norway',
                  'iceland','finland','france',
                  'italy','greece']
const FANTASY=new Map([
  ['human',['us','france']],
  ['lacerta',['japan','indonesia']],//lizard-folk
  ['dwarf',['germany','norway']],
  ['elf',['iceland','finland']],
  ['halfling',['brazil','mexico']],
  ['tiefling',['pakistan','nigeria']],
  ['aasimar',['italy','greece']],
  ['orc',['pakistan','nigeria','germany','norway']],
])

class Language{
  constructor(names=false){
    this.names=new Map([['male',[]],['female',[]],['family',[]]])
    if(!names) return
    this.names.get('family').push(...this.split(names.family))
    this.names.get('female').push(...this.split(names.female))
    this.names.get('male').push(...this.split(names.male))
  }
  
  split(names){return names.map(n=>n.toLowerCase().split('.'))}
  
  roll(names){return names[rpg.low(0,names.length-1)]}
  
  generate(names){
    names=this.names.get(names)
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
  
  get male(){return this.generate('male')}
  
  get female(){return this.generate('female')}
  
  get family(){return this.generate('family')}
  
  merge(language){
    for(let key of ['male','female','family'])
      this.names.get(key).push(...language.names.get(key))
  }
}

export var countries=new Map()//country:language
export var fantasy=new Map()//country:language

export async function setup(){
  for(let c of COUNTRIES){
    let names=await fetch(`name/${c}.json`)
    names=await names.json()
    countries.set(c,new Language(names))
  }
  for(let f of FANTASY.keys()){
    let l=new Language()
    fantasy.set(f,l)
    for(let country of FANTASY.get(f))
      l.merge(countries.get(country))
  }
  return Promise.resolve()
}
