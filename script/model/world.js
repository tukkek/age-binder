import * as point from './point.js'
import * as biome from './biome.js'
import * as rpg from '../control/rpg.js'
import * as brahma from '../control/director/brahma.js'
import * as shiva from '../control/director/shiva.js'

const FOOD=[biome.forest,/*this.sea||*/,biome.water,biome.plains]
const AGE=100_000//years

class Cell{
  constructor(x,y,world){
    this.point=new point.Point(x,y)
    this.elevation=0
    this.fertility=0
    this.water=false
    this.x=x
    this.y=y
    let longitude=y/world.height
    let l=longitude
    this.ice=!(.2<=l&&l<.8)
    this.weather=Math.abs(1-(Math.abs(l-.5)/.5))//0=poles 1=tropic
    this.worship=0
    this.trade=0
    this.food=0
    this.arms=0
    this.resource=false
    this.owner=false
    this.people=false
    this.culture=false
  }
  
  get sea(){return this.elevation<=.2}
  
  get mountain(){return this.elevation>=.6}
  
  get forest(){return this.fertility>=.8}
  
  get desert(){return this.fertility<=.2}
  
  get land(){return !this.sea&&!this.water}
  
  get biome(){return biome.get(this)}
  
  produce(){
    if(this.resource) this.resource.use(this)
    if(this.ice||this.desert) return
    let production=this.owner.technology
    let harvest=production*this.weather
    if(this.forest||this.sea||this.water) this.food+=harvest
    else if(this.mountain) this.arms+=production
    else if(rpg.chance(2)) this.food+=harvest
    else this.trade+=production
  }
  
  eat(){return FOOD.indexOf(this.biome)>=0}
}

export class World{
  constructor(name,width,height){
    this.grid=Array.from(new Array(width),()=>new Array(height))
    this.age=-rpg.high(50,100)
    this.height=height
    this.width=width
    this.name=name
    this.year=1
    for(let p of point.iterate([0,this.width],[0,this.height]))
      this.grid[p.x][p.y]=new Cell(p.x,p.y,this)
    this.area=Array.from(this.iterate())
  }
  
  *iterate(){
    let w=this.width
    let h=this.height
    for(let x=0;x<w;x++) for(let y=0;y<h;y++) 
      yield this.grid[x][y]
  }
  
  live(){
    if(this.age<1||rpg.chance(AGE)){
      brahma.instance.play()
      return true
    }
    shiva.instance.play()
    return false
  }
}

class Waters{
  constructor(){
    this.river='river'
    this.oasis='oasis'
    this.shore='shore'
  }
}

export var waters=new Waters()
