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
    let o=cell.owner
    if(o){
      if(!takeover) return false
      if(o==this) return false
      let a=o.area
      a.splice(a.indexOf(cell),1)
      if(o.dead){
        let log=`The ${o.name} have been subjugated by the ${this.name}`
        instance.log(log)
      }
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
    if(!this.expand(cell)) return false
    cell.culture=this.culture
    cell.people=this.people
    return true
  }
  
  convert(cell){}//TODO
  
  conquer(cell){
    if(cell.owner==this){
      cell.arms+=1
      return true
    }
    if(!cell.owner) return false
    if(cell.arms>0){
      cell.arms-=1
      return false
    }
    if(!this.expand(cell,true)) return false
    cell.culture=this.culture
    cell.people=this.people
    return true
  }
  
  get dead(){return this.area.length==0}
  
  sail(cell){
    let w=instance.world
    let f=Math.floor(cell.food)
    let range=[[Math.max(0,cell.x-f),Math.min(cell.x+f,w.width-1)],
                [Math.max(0,cell.y-f),Math.min(cell.y+f,w.height-1)]]
    let p=cell.point
    let to=Array.from(new Array(2),()=>point.random(range[0],range[1]))
            .reduce((a,b)=>a.distance(p)<b.distance(p)?a:b)
    if(this.expand(w.grid[to.x][to.y])) cell.food=0
  }
  
  turn(){
    if(this.area.length==0) return
    let w=instance.world
    let valid=[[0,w.width],[0,w.height]]
    let fat=this.area[0]
    for(let a of this.area){
      a.produce()
      let neighbors=a.point.expand()
                      .filter(p=>p.validate(valid[0],valid[1]))
                      .map(p=>w.grid[p.x][p.y])
      for(let n of rpg.shuffle(neighbors)){
        if(a.food>=1&&a.food>n.food&&this.colonize(n)) a.food-=1
        if(a.arms>=1&&a.arms>n.arms&&this.conquer(n)) a.arms-=1
      }
      if(a.food>fat.food) fat=a
    }
    this.sail(fat)
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
    this.realms=this.realms.filter(r=>!r.dead)
    for(let r of this.realms) r.turn()
  }
}

export var instance=new Shiva()
