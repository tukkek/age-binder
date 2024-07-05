import * as director from './director.js'
import * as rpg from '../rpg.js'
import * as color from '../../model/color.js'
import * as point from '../../model/point.js'
import * as biome from '../../model/biome.js'
import * as name from '../../model/name.js'
import * as holding from '../../model/holding.js'

const PRECINCT=.001
const OUTPOST=.0002
const FORT=.0001

class Person{
  constructor(family,cell){
    this.point=cell.point.clone()
    this.age=rpg.low(0,100)
    this.level=0
    let male=rpg.chance(2)
    this.sex=male?'♂':'♀'
    let l=cell.owner.language
    this.name=[male?l.male:l.female,family]
  }

  get cell(){return instance.world.grid[this.point.x][this.point.y]}
  
  get holding(){return this.cell.holding}
  
  get title(){return this.holding.rank(this)}
  
  get hex(){return this.cell.hex}
  
  live(){
    if(rpg.chance(100)){
      instance.log(`${this.name.join(' ')} dies in ${this.hex.name} ${this.holding.name}`)
      return false
    }
    this.age+=1
    if(this.level<4&&rpg.chance(30)){
      this.level+=1
      this.announce()
    }
    return true
  }
  
  announce(){
    let t=this.title.toLowerCase()
    let h=this.hex.name.split(' ')[0]
    instance.log(`${this.name.join(' ')} becomes ${t} at ${h} ${this.holding.name}`)
  }
}

export class Realm{
  static pool=[]
  
  constructor(color,people,culture){
    this.name=color+' Empire'
    this.culture=culture
    this.people=people
    this.color=color
    this.area=[]
    this.language=name.speak(people)
    this.science=0
    this.families=[]
  }
  
  expand(cell,takeover=false){
    if(cell.sea) return false
    let o=cell.owner
    let h=cell.hex
    if(h&&h.area.indexOf(cell)<0) h=false
    if(o){
      if(!takeover) return false
      if(o==this) return false
      let a=o.area
      a.splice(a.indexOf(cell),1)
      if(o.dead){
        let log=`The ${o.name} have been subjugated by the ${this.name}`
        instance.log(log)
      }
    }else if(cell.resource&&h) 
      instance.log(`The ${this.name} finds ${cell.resource.name.toLowerCase()} in the ${h.name}`)
    cell.owner=this
    this.area.push(cell)
    return true
  }
  
  colonize(cell){
    if(cell.owner==this){
      cell.food+=1
      return true
    }
    if(!this.expand(cell)) return false
    cell.culture=this.culture
    cell.people=this.people
    return true
  }
  
  convert(cell){
    if(cell.owner==this){
      cell.worship+=1
      if(holding.build(holding.Precinct,cell.worship*PRECINCT,cell)) cell.worship=0
      return true
    }
    if(cell.worship>0){
      cell.worship-=1
      return false
    }
    if(!this.expand(cell,true)) return false
    cell.culture=this.culture
    return true
  }
  
  conquer(cell){
    if(cell.owner==this){
      cell.arms+=1
      if(holding.build(holding.Fort,cell.arms*FORT,cell)) cell.arms=0
      return true
    }
    if(cell.arms>0){
      cell.arms-=1
      return false
    }
    if(!this.expand(cell,true)) return false
    cell.culture=this.culture
    cell.people=this.people
    cell.worship=0
    cell.trade/=2
    cell.food/=2
    return true
  }
  
  get dead(){return this.area.length==0}
  
  sail(cell){
    let w=instance.world
    let t=Math.floor(cell.trade)
    if(t<=0) return
    if(holding.build(holding.Outpost,cell.trade*OUTPOST,cell)){
      this.trade=0
      return
    }
    let range=[[Math.max(0,cell.x-t),Math.min(cell.x+t,w.width-1)],
                [Math.max(0,cell.y-t),Math.min(cell.y+t,w.height-1)]]
    let to=point.random(range[0],range[1])
    to=w.grid[to.x][to.y]
    if(this.expand(to)) cell.trade=0
  }
  
  turn(){
    if(this.area.length==0) return
    let w=instance.world
    let valid=[[0,w.width],[0,w.height]]
    for(let a of this.area){
      a.produce()
      let neighbors=a.point.expand(2)
                      .filter(p=>p.validate(valid[0],valid[1]))
                      .map(p=>w.grid[p.x][p.y])
      for(let n of rpg.shuffle(neighbors)){
        if(a.food>=1&&a.food>n.food&&this.colonize(n)) a.food-=1
        if(a.worship>=1&&a.worship>n.worship&&this.convert(n)) a.worship-=1
        if(a.arms>=1&&a.arms>n.arms&&this.conquer(n)) a.arms-=1
      }
      this.sail(a)
    }
  }
  
  get technology(){return 1+this.science/500}
  
  birth(cell){
    let families=this.families
    let family=false
    if(rpg.chance(families.length+1)){
      family=this.language.family
      families.push(family)
    }else family=rpg.pick(families)
    let p=new Person(family,cell)
    p.announce()
    return p
  }
}

class Shiva extends director.Director{
  constructor(){
    super()
    this.realms=[]
  }
  
  spawn(){
    let pool=Realm.pool
    if(pool.length==0) return
    if(!rpg.chance(100)) return
    let realm=pool.shift()
    let w=this.world
    let cell=false
    while(!cell||!cell.eat()||!realm.expand(cell,true)){
      let p=point.random([0,w.width-1],[0,w.height-1])
      cell=w.grid[p.x][p.y]
    }
    this.realms.push(realm)
    this.log(`The ${realm.name} is born`)
  }
  
  seed(){
    let seeds=1
    while(rpg.chance(2)) seeds+=1
    while(this.realms.length<seeds&&Realm.pool.length>0)
      this.spawn()
  }
  
  play(){
    let w=this.world
    if(w.age==1&&w.year==1) this.seed()
    else this.spawn()
    w.year+=1
    this.realms=rpg.shuffle(this.realms.filter(r=>!r.dead))
    for(let r of this.realms) r.turn()
  }
}

export var instance=new Shiva()
