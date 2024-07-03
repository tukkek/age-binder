import * as director from './director.js'
import * as rpg from '../rpg.js'
import * as color from '../../model/color.js'
import * as point from '../../model/point.js'
import * as biome from '../../model/biome.js'

export class Realm{
  static pool=[]
  
  constructor(color,people,culture){
    this.name=color+' Empire'
    this.culture=culture
    this.people=people
    this.color=color
    this.area=[]
  }
  
  expand(cell,takeover=false){
    if(cell.sea) return false
    if(cell.owner){
      if(!takeover) return false
      if(cell.owner==this) return false
      let a=cell.owner.area
      a.splice(a.indexOf(cell),1)
    }
    cell.owner=this
    this.area.push(cell)
    return true
  }
  
  colonize(cell){
    if(cell.owner==this){
      cell.food+=1
      return true
    }
    return this.expand(cell)
  }
  
  convert(cell){}//TODO
  
  conquer(cell){
    //TODO
    if(!this.expand(cell,true)) return false
    return true
  }
  
  die(){
    if(this.area.length>0) return false
    instance.log(`The ${realm.name} has vanished`)
    return true
  }
  
  turn(){
    let w=instance.world
    let valid=[[0,w.width],[0,w.height]]
    for(let a of this.area){
      a.produce()
      let neighbors=a.point.expand()
                      .filter(p=>p.validate(valid[0],valid[1]))
                      .map(p=>w.grid[p.x][p.y])
      if(a.food>=1&&this.colonize(neighbors.reduce((a,b)=>a.food<b.food?a:b)))
        a.food-=1
    }
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
  
  play(){
    this.world.year+=1
    this.spawn()
    this.realms=this.realms.filter(r=>!r.die())
    for(let r of this.realms) r.turn()
  }
}

export var instance=new Shiva()
