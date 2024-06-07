import * as point from '../control/point.js'
import * as rpg from '../control/rpg.js'
import * as brahma from '../control/director/brahma.js'
import * as shiva from '../control/director/shiva.js'

const AGE=100_000//years

class Cell{
  constructor(x,y){
    this.elevation=0
    this.x=x
    this.y=y
  }
  
  get flooded(){return this.elevation<=.2}
  
  get point(){return new point.Point(this.x,this.y)}
}

export class World{
  constructor(width,height){
    this.grid=Array.from(new Array(width),()=>new Array(height))
    this.age=-rpg.max(1,100)
    this.height=height
    this.width=width
    this.year=1
    for(let p of point.iterate([0,this.width],[0,this.height]))
      this.grid[p.x][p.y]=new Cell(p.x,p.y)
  }
  
  *iterate(){
    for(let p of point.iterate([0,this.width],[0,this.height])) 
      yield this.grid[p.x][p.y]
  }
  
  live(){
    if(this.age<1){
      brahma.instance.play()
      return
    }
    let director=rpg.chance(AGE)?brahma.instance:shiva.instance
    director.play()
  }
  
  area(){return Array.from(this.iterate())}
}
