import * as director from './director.js'
import * as rpg from '../rpg.js'
import * as point from '../../model/point.js'
import * as world from '../../model/world.js'
import * as resource from '../../model/resource.js'
import * as map from '../../view/map.js'

const BASELINE=1000*700
const AREA=window.innerWidth*window.innerHeight
const SPIKES=AREA/2/BASELINE
const AGES=50
const OASIS=1_000*AGES//earth ratio
const ENRICH=map.hexcount/(10/2)/AGES
const CLOUDS=20
const RAIN=3/(CLOUDS*CLOUDS)
  
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
    let tox=Math.min(p.x+100+1,w.width)
    let toy=Math.min(p.y+100+1,w.height)
    for(let x=Math.max(0,p.x-100);x<tox;x++)
      for(let y=Math.max(0,p.y-100);y<toy;y++){
        let cell=w.grid[x][y]
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
    while(rpg.chance(2)){
      let mountains=w.area.filter(cell=>cell.mountain)
      if(mountains.length==0) return
      rivers.push(rpg.pick(mountains))
    }
    let river=world.waters.river
    let height=w.height
    let width=w.width
    let g=w.grid
    for(let i=0;i<rivers.length;i++) for(let j=0;j<1000;j++){
      let r=rivers[i]
      if(r.sea) break
      let neighbors=r.point.expand()
                      .filter(p=>p.validate([0,width],[0,height]))
                      .map(p=>g[p.x][p.y])
                      .filter(cell=>cell.water!=river)
      if(neighbors.length==0) break
      r.water=world.waters.river
      rivers[i]=rpg.shuffle(neighbors)
                  .reduce((a,b)=>a.elevation<b.elevation?a:b)
    }
  }
  
  drop(cell){
    if(cell.sea) return 1
    if(cell.water) return cell.water==world.waters.shore?3:1
    if(cell.desert&&cell.ice) return -1/2
    return cell.fertility/2
  }
  
  rain(){
    let w=this.world
    let width=w.width
    let height=w.height
    for(let x=0;x<width;x++) for(let y=0;y<height;y++){
      let cell=w.grid[x][y]
      cell.raindrop=this.drop(cell)
    }
    for(let x=0;x<width;x++) for(let y=0;y<height;y++){
      let cell=w.grid[x][y]
      if(cell.desert&&rpg.chance(OASIS))
        cell.water=world.waters.oasis
      if(!cell.land) continue
      let tox=Math.min(x+CLOUDS,width)
      let toy=Math.min(y+CLOUDS,height)
      let wet=0
      for(let x2=Math.max(0,x-CLOUDS);x2<tox;x2++)
        for(let y2=Math.max(0,y-CLOUDS);y2<toy;y2++){
          let cell2=w.grid[x2][y2]
          let d=cell2.point.distance(cell.point)
          if(d>0) wet+=RAIN*cell2.raindrop/d
        }
      wet*=1+cell.weather*3/2-.5
      if(wet>1) wet=1
      else if(wet<0) wet=0
      cell.fertility=wet
    }
  }
  
  crash(){
    let shore=world.waters.shore
    let w=this.world
    let width=w.width-1
    let height=w.height-1
    let g=w.grid
    for(let x=1;x<width;x++) for(let y=1;y<height;y++){
      let cell=g[x][y]
      if(cell.sea) continue
      let r=cell.water
      if(r){
        if(r==shore) cell.water=false
        else continue
      }
      let sea=false
      for(let x2=x-1;x2<x+2&&!sea;x2++)
        for(let y2=y-1;y2<y+2&&!sea;y2++)
          if(g[x2][y2].sea) sea=true
      if(sea) cell.water=shore
    }
  }
  
  enrich(){
    if(!rpg.random(ENRICH)) return
    let w=this.world
    let p=point.random([0,w.width],[0,w.height])
    let cell=w.grid[p.x][p.y]
    cell.resource=resource.spawn(cell)
  }
  
  play(){
    let w=this.world
    w.age+=1
    w.year=1
    this.rise()
    this.flood()
    this.rain()
    this.crash()
    this.enrich()
  }
}

export var instance=new Brahma()
