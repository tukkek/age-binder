import * as director from './director.js'
import * as point from '../point.js'
import * as rpg from '../rpg.js'

class Brahma extends director.Director{
  constructor(){
    super()
    this.peaks=[]
  }
  
  deform(pointp,amount){
    let p=pointp
    let w=this.world
    let area=point.area([p.x-100,p.x+100+1],[p.y-100,p.y+100+1])
    area=area.filter(a=>a.validate([0,w.width],[0,w.height]))
    for(let cell of area.map(a=>w.grid[a.x][a.y]))
      cell.elevation+=amount/(p.distance(cell.point)/10+1)
  }
  
  rise(){
    let peaks=this.peaks
    let w=this.world
    let width=w.width
    let height=w.height
    while(rpg.chance(2)) peaks.push(point.random([0,width],[0,height]))
    for(let p of peaks) this.deform(p,.01)
    
//     for(let border of w.iterate())
//       if(a=>border.x==0||border.y==0)
//         this.deform(border.point,-.02)
        
    let xborder=width/20
    let yborder=height/20
    for(let x=0;x<xborder;x++) for(let y=0;y<height;y++)
      for(let cell of [w.grid[x][y],w.grid[width-1-x][y]]){
        cell.elevation-=.01*(xborder-x)/xborder
        if(cell.elevation<0) cell.elevation=0
      }
    for(let x=0;x<width;x++) for(let y=0;y<yborder;y++)
      for(let cell of [w.grid[x][y],w.grid[x][height-1-y]]){
        cell.elevation-=.01*(yborder-y)/yborder
        if(cell.elevation<0) cell.elevation=0
      }
        
//     if(w.age%10==0)
//       this.log(w.area().reduce((a,b)=>a.elevation>b.elevation?a:b).elevation)
  }
  
  play(){
    let w=this.world
    w.age+=1
    w.year=1
    super.play()
    this.rise()
  }
}

export var instance=new Brahma()
