import * as details from './details.js'
import * as engine from '../control/engine.js'
import * as point from '../model/point.js'
import * as color from '../model/color.js'

const CANVAS=document.querySelector('canvas#map')
const VIEW=CANVAS.getContext('2d')
const SEA=[0,0,255]
const GROUND=[96,192,64]
const MOUNTAIN=[128,128,128]
const WATER=[0,128,255]
const FOREST=[0,128,0]
const DESERT=[192,192,0]
const ICE=[256,256,256]
const ICONS=document.querySelector('#icons')
const ICON=ICONS.querySelector('template#icon').content.children[0]
const UNNAMED='Wilderness'

class Hex{//im too dumb to do hexes... T_T
  constructor(x,y){
    this.point=new point.Point(x,y)
    let w=engine.world
    this.area=point.area([x-hexsize,x+hexsize+1],
                          [y-hexsize,y+hexsize+1])
                            .filter(p=>p.validate([0,w.width],[0,w.height]))
                            .filter(p=>p.distance(this.point)<=hexsize)
                            .map(p=>w.grid[p.x][p.y])
    this.icon=false
    this.x=x
    this.y=y
    this.owner=false
    this.name=UNNAMED
  }
  
  own(){
    let owners=Map.groupBy(this.area.filter(a=>a.owner),(a)=>a.owner)
    if(owners.size==0){
      this.owner=false
      return false
    }
    let realms=Array.from(owners.keys())
    let r=realms.reduce((a,b)=>owners.get(a).length>owners.get(b).length?a:b)
    this.owner=r
    if(this.name==UNNAMED) this.name=`${r.language.noun} province`
    return r
  }
  
  overlay(){
    let i=this.icon
    if(i) i.remove()
    let cell=false
    for(let a of this.area){
      if(a.holding){
        cell=a
        break
      }
      if(a.resource&&a.owner) cell=a
    }
    if(!cell) return
    this.attach((cell.holding&&cell.holding.image)||
                (cell.resource&&cell.resource.image))
  }
  
  draw(){
    let o=this.own()
    if(!o) return
    VIEW.lineWidth=2
    VIEW.strokeStyle=o?color.gems.get(o.color):'black'
    VIEW.beginPath()
    VIEW.arc(this.x,this.y,hexsize,0,2*Math.PI,false)
    VIEW.stroke()
    this.overlay()
  }
  
  enter(x,y){
    return this.x-hexsize<=x&&x<this.x+hexsize+1&&
      this.y-hexsize<=y&&y<this.y+hexsize+1
  }
  
  attach(icon){
    this.icon=ICON.cloneNode(true)
    this.icon.src=icon
    let s=this.icon.style
    s.left=(this.x-hexsize/2)+'px'
    s.top=(this.y-hexsize/2)+'px'
    s.width=hexsize/1+'px'
    s.height=hexsize/1+'px'
    ICONS.appendChild(this.icon)
  }
}

export var hexcount=300
export var hexsize=Math.floor(Math.sqrt((window.innerWidth*window.innerHeight)/hexcount/Math.PI))

var width=-1
var hexes=[]
var data=[]

function paint(x,y,color){
  let i=(y*engine.world.width+x)*4
  data.data[i+0]=color[0]
  data.data[i+1]=color[1]
  data.data[i+2]=color[2]
  data.data[i+3]=255
}

function validate(x,y){
  let w=engine.world
  return 0<=x&&x<w.width&&0<=y&&y<w.height
}

export function enter(x,y){return hexes.find(h=>h.enter(x,y))}

function follow(event){details.summarize(enter(event.clientX,event.clientY))}

function detail(event){details.detail(enter(event.clientX,event.clientY))}

export function draw(full=true){
  let w=engine.world
  if(full) for(let x=0;x<w.width;x++) 
    for(let y=0;y<w.height;y++){
      let cell=w.grid[x][y]
      let color=GROUND
      if(cell.sea) color=SEA
      else if(cell.water) color=WATER
      else if(cell.mountain) color=MOUNTAIN
      else if(cell.forest) color=FOREST
      else if(cell.desert) color=cell.ice?ICE:DESERT
      paint(x,y,color)
    }
  VIEW.putImageData(data,0,0)
  for(let h of hexes) h.draw()
}

export function setup(){
  details.setup()
  let world=engine.world
  let w=world.width
  let h=world.height
  CANVAS.setAttribute('width',w)
  CANVAS.setAttribute('height',h)
  let step=hexsize*2-5
  for(let y=0;y+step<h;y+=step) for(let x=0;x<w+step;x+=hexsize*2){
    let align=y/(step)%2?hexsize:0
    hexes.push(new Hex(x-align,y))
  }
  document.body.onmousemove=follow
  document.body.onclick=detail
  data=VIEW.getImageData(0,0,w,h)
  CANVAS.classList.remove('hidden')
  draw()
} 
