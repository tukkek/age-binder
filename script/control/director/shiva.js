import * as director from './director.js'
import * as rpg from '../rpg.js'
import * as color from '../../model/color.js'
import * as point from '../../model/point.js'

export class Realm{
  static pool=[]
  
  constructor(color,people,culture){
    this.name=color+' Empire'
    this.culture=culture
    this.people=people
    this.color=color
    this.area=[]
  }
  
  colonize(cell){
    if(cell.sea||cell.owner) return false
    cell.owner=this
    this.area.push(cell)
    return true
  }
  
  convert(cell){}//TODO
  
  conquer(cell){
    if(cell.sea) return false
    if(cell.owner){
      let a=cell.owner.area
      a.splice(a.indexOf(cell),1)
    }
    cell.owner=this
    this.area.push(cell)
    return true
  }
  
  get dead(){return this.area.length==0}
  
  turn(){
    if(this.dead){
      instance.log(`The ${realm.name} has vanished...`)
      return false
    }
    //TODO
    return true
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
    let p=false
    let w=this.world
    while(!p||!realm.conquer(w.grid[p.x][p.y]))
      p=point.random([0,w.width-1],[0,w.height-1])
    this.realms.push(realm)
    this.log(`The ${realm.name} is born!`)
  }
  
  play(){
    this.world.year+=1
    this.spawn()
    let dead=false
    for(let r of this.realms)
      if(!r.turn()) dead=true
    if(dead) this.realms=this.realms.filter(r=>!r.dead)
  }
}

export var instance=new Shiva()
