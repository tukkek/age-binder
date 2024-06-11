import * as point from '../control/point.js'
import * as rpg from '../control/rpg.js'
import * as brahma from '../control/director/brahma.js'
import * as shiva from '../control/director/shiva.js'

const AGE=100_000//years

class Cell{
  constructor(x,y,world){
    this.point=new point.Point(x,y)
    this.elevation=0
    this.fertility=0
    this.water=false//TODO overview: show all types
    this.x=x
    this.y=y
    let longitude=y/world.height
    let l=longitude
    this.ice=!(.2<=l&&l<.8)
    this.weather=Math.abs(1-(Math.abs(l-.5)/.5))//0=poles 1=tropic
  }
  
  get sea(){return this.elevation<=.2}
  
  get mountain(){return this.elevation>=.6}
  
  get wet(){return this.fertility>=.8}
  
  get dry(){return this.fertility<=.2}
  
  get land(){return !(this.sea||this.water)}
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
  }
  
  *iterate(){
    let w=this.width
    let h=this.height
    for(let x=0;x<w;x++) for(let y=0;y<h;y++) 
      yield this.grid[x][y]
  }
  
  live(){
    if(this.age<1){
      brahma.instance.play()
      return
    }
    let director=rpg.chance(AGE)?brahma.instance:shiva.instance
    director.play()
  }
  
  get area(){return Array.from(this.iterate())}
}

class Waters{
  constructor(){
    this.river='river'
    this.oasis='oasis'
    this.shore='shore'
  }
}

export var waters=new Waters()
