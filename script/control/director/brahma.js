import * as director from './director.js'
import * as point from '../point.js'
import * as rpg from '../rpg.js'

const BASELINE=1000*700
const SPIKES=(window.innerWidth*window.innerHeight)/2/BASELINE
const TREMORS=[0,1,2].map(t=>t/100)
  
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
    let spikes=Math.floor(SPIKES)
    if(rpg.random(SPIKES-spikes)) spikes+=1
    for(let i=0;i<spikes;i++) 
      peaks.push(point.random([0,width],[0,height]))
    for(let p of peaks) this.deform(p,rpg.pick(TREMORS))
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
    while(rpg.chance(2)){
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
      rivers[i]=rpg.shuffle(neighbors)
                  .reduce((a,b)=>a.elevation<b.elevation?a:b)
    }
  }
  
  //returns 0% at poles, 100% at tropic
  weather(position){return Math.abs(1-(Math.abs(position-.5)/.5))}
  
  rain(){
    let CLOUDS=20//TODO
    let RAIN=3/(CLOUDS*CLOUDS)
    let w=this.world
    let width=w.width
    let height=w.height
    for(let x=0;x<width;x++) for(let y=0;y<height;y++){
      let cell=w.grid[x][y]
      if(!cell.land) continue
      let f=0
      let tox=Math.min(x+CLOUDS,width)
      let toy=Math.min(y+CLOUDS,height)
      for(let x2=Math.max(0,x-CLOUDS);x2<tox;x2++)
        for(let y2=Math.max(0,y-CLOUDS);y2<toy;y2++){
          let cell2=w.grid[x2][y2]
          if(cell2==cell) continue
          let rain=0
          if(cell2.sea) rain=5
          else if(cell2.river) rain=10
          else if(cell2.wet) rain=cell2.fertility*(1-.1)
          else continue
          f+=RAIN*rain/(cell.point.distance(cell2.point))
        }
      let weather=1+this.weather(y/height)/3
      f*=weather
      f=(2*f+.5)/3
      if(f>1) f=1
      cell.fertility=f
    }
  }
  
  play(){
    let w=this.world
    w.age+=1
    w.year=1
    this.rise()
    this.flood()
    this.rain()
  }
}

export var instance=new Brahma()
