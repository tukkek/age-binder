import * as director from './director.js'
import * as point from '../point.js'
import * as rpg from '../rpg.js'

class Brahma extends director.Director{
  constructor(){
    super()
    this.peaks=[]
    this.rivers=[]
  }
  
  deform(pointp,amount){
    if(amount==0) return
    let w=this.world
    let p=pointp
    let x=[Math.max(0,p.x-100),Math.min(p.x+100+1,w.width)]
    let y=[Math.max(0,p.y-100),Math.min(p.y+100+1,w.height)]
    for(let cell of point.iterate(x,y)){
      cell=w.grid[cell.x][cell.y]
      cell.elevation+=amount/(p.distance(cell.point)/10+1)
    }
  }
  
  rise(){
    let peaks=this.peaks
    let w=this.world
    let width=w.width
    let height=w.height
    while(rpg.chance(2)) peaks.push(point.random([0,width],[0,height]))
    for(let p of peaks) this.deform(p,rpg.roll(0,2)/100)
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
  }
  
  flood(){
    let rivers=this.rivers
    let w=this.world
    if(rpg.chance(2)){
      let mountains=w.area.filter(cell=>cell.mountain)
      if(mountains.length==0) return
      rivers.push(rpg.pick(mountains))
    }
    let height=w.height
    let width=w.width
    let g=w.grid
    for(let i=0;i<rivers.length;i++) for(let j=0;j<1000;j++){
      let r=rivers[i]
      if(r.sea) break
      let neighbors=r.point.expand()
        .filter(p=>p.validate([0,width],[0,height]))
        .map(p=>g[p.x][p.y])
        .filter(cell=>!cell.river)
      if(neighbors.length==0) break
      r.river=true
//       for(let cell of r.point.expand().map(p=>g[p.x][p.y]))
//         cell.river=true
      rivers[i]=rpg.shuffle(neighbors)
                  .reduce((a,b)=>a.elevation<b.elevation?a:b)
    }
  }
  
  play(){
    let w=this.world
    w.age+=1
    w.year=1
    super.play()
    this.rise()
    this.flood()
  }
}

export var instance=new Brahma()
