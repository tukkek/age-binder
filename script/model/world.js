import * as point from '../control/point.js'
import * as rpg from '../control/rpg.js'
import * as brahma from '../control/director/brahma.js'
import * as shiva from '../control/director/shiva.js'

const AGE=100_000//years

class Cell{
  constructor(x,y){
    this.elevation=0
    this.river=false
    this.x=x
    this.y=y
  }
  
  get sea(){return this.elevation<=.2}
  
  get point(){return new point.Point(this.x,this.y)}
  
  get mountain(){return this.elevation>=.6}
}

export class World{
  constructor(width,height){
    this.grid=Array.from(new Array(width),()=>new Array(height))
    this.age=-rpg.high(50,100)
    this.height=height
    this.width=width
    this.year=1
    for(let p of point.iterate([0,this.width],[0,this.height]))
      this.grid[p.x][p.y]=new Cell(p.x,p.y)
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
