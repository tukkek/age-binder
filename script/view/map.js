import * as summary from './summary.js'
import * as engine from '../control/engine.js'

const CANVAS=document.querySelector('canvas#map')
const VIEW=CANVAS.getContext('2d')
const HEXSIZE=20
const SEA=[0,0,255]
const GROUND=[128,0,0]
const MOUNTAIN=[128,128,128]
const RIVER=[0,128,255]

var lastupdate=[-9000,-9000]//age,year

class Hex{//im too dumb to do hexes... T_T
  constructor(x,y){
    this.x=x
    this.y=y
  }
  
  draw(){
    VIEW.lineWidth=1
    VIEW.strokeStyle='gray'
    VIEW.beginPath()
    VIEW.arc(this.x,this.y,HEXSIZE,0,2*Math.PI,false)
    VIEW.setLineDash([1,3])
    VIEW.stroke()
  }
  
  enter(x,y){
    return this.x-HEXSIZE<=x&&x<this.x+HEXSIZE&&
      this.y-HEXSIZE<=y&&y<this.y+HEXSIZE
  }
}

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

function follow(event){summary.show(hexes.find(h=>h.enter(event.clientX,event.clientY)))}

export function draw(){
  let w=engine.world
  let now=[w.age,w.year]
  if(!(now[0]>lastupdate[0]||now[1]>lastupdate[1]))
    return
  lastupdate=now
  for(let cell of w.iterate()){
    let color=GROUND
    if(cell.sea) color=SEA
    else if(cell.river) color=RIVER
    else if(cell.mountain) color=MOUNTAIN
    paint(cell.x,cell.y,color)
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
  let step=HEXSIZE*2-5
  for(let y=0;y<h;y+=step) for(let x=0;x<w;x+=HEXSIZE*2){
    let other=y/(step)%2
    let h=new Hex(x-(other?HEXSIZE:0),y)
    hexes.push(h)
  }
  document.body.onmousemove=follow
  data=VIEW.getImageData(0,0,w,h)
  draw()
} 
