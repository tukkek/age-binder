import * as summary from './summary.js'
import * as image from './image.js'
import * as engine from '../control/engine.js'
import * as point from '../model/point.js'

const CANVAS=document.querySelector('canvas#map')
const VIEW=CANVAS.getContext('2d')
const SEA=[0,0,255]
const GROUND=[64,192,64]
const MOUNTAIN=[128,128,128]
const WATER=[0,128,255]
const FOREST=[0,128,0]
const DESERT=[192,192,0]
const ICE=[256,256,256]
const ICONS=document.querySelector('#icons')
const ICON=ICONS.querySelector('template#icon').content.children[0]

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
  }
  
  draw(){
    VIEW.lineWidth=1
    VIEW.strokeStyle='black'
    VIEW.beginPath()
    VIEW.arc(this.x,this.y,hexsize,0,2*Math.PI,false)
    VIEW.setLineDash([1,2])
    VIEW.stroke()
  }
  
  enter(x,y){
    return this.x-hexsize<=x&&x<this.x+hexsize+1&&
      this.y-hexsize<=y&&y<this.y+hexsize+1
  }
  
  attach(icon,gallery){
    this.icon=ICON.cloneNode(true)
    this.icon.src=gallery.prefix+icon
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

function follow(event){summary.show(enter(event.clientX,event.clientY))}

function overlay(cell){
  let r=cell.resource
  if(!r) return
  let hex=enter(cell.x,cell.y)
  if(hex&&!hex.icon) hex.attach(r.image,image.resources)
}

export function draw(){
  let w=engine.world
  for(let h of hexes) if(h.icon){
    h.icon.remove()
    h.icon=false
  }
  for(let x=0;x<w.width;x++)
    for(let y=0;y<w.height;y++){
      let cell=w.grid[x][y]
      let color=GROUND
      if(cell.sea) color=SEA
      else if(cell.ice&&((x+y)%3!=0)) color=ICE
      else if(cell.water) color=WATER
      else if(cell.mountain) color=MOUNTAIN
      else if(cell.forest) color=FOREST
      else if(cell.desert) color=DESERT
      paint(x,y,color)
      overlay(cell)
    }
  VIEW.putImageData(data,0,0)
  for(let h of hexes) h.draw()
}

export function setup(){
  let world=engine.world
  let w=world.width
  let h=world.height
  CANVAS.setAttribute('width',w)
  CANVAS.setAttribute('height',h)
  let step=hexsize*2-5
  for(let y=0;y<h+step;y+=step) for(let x=0;x<w;x+=hexsize*2){
    let other=y/(step)%2
    hexes.push(new Hex(x-(other?hexsize:0),y))
  }
  document.body.onmousemove=follow
  data=VIEW.getImageData(0,0,w,h)
  CANVAS.classList.remove('hidden')
  draw()
} 
