import * as summary from './summary.js'

const CANVAS=document.querySelector('canvas#map')
const VIEW=CANVAS.getContext('2d')
const WIDTH=window.innerWidth
const HEIGHT=window.innerHeight
const HEXSIZE=20

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

function paint(x,y,red,green,blue){
  let i=(y*WIDTH+x)*4
  data.data[i+0]=red
  data.data[i+1]=green
  data.data[i+2]=blue
  data.data[i+3]=255
}

function validate(x,y){return 0<=x&&x<WIDTH&&0<=y&&y<HEIGHT}

function follow(event){summary.show(hexes.find(h=>h.enter(event.clientX,event.clientY)))}

export function setup(){
  CANVAS.setAttribute('width',WIDTH)
  CANVAS.setAttribute('height',HEIGHT)
  data=VIEW.getImageData(0,0,WIDTH,HEIGHT)
  VIEW.putImageData(data,0,0)
  let step=HEXSIZE*2-5
  for(let y=0;y<HEIGHT;y+=step)
    for(let x=0;x<WIDTH;x+=HEXSIZE*2){
      let other=y/(step)%2
      let h=new Hex(x-(other?HEXSIZE:0),y)
      h.draw()
      hexes.push(h)
    }
  document.body.onmousemove=follow
} 
