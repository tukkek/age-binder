import * as rpg from './rpg.js'

export class Point{
  constructor(x=0,y=0){
    this.x=x
    this.y=y
  }
  
  distance(point){
    let x=Math.abs(point.x-this.x)
    let y=Math.abs(point.y-this.y)
    return Math.max(x,y)
  }
  
  validate(rangex,rangey){
    return rangex[0]<=this.x&&this.x<rangex[1]&&
            rangey[0]<=this.y&&this.y<rangey[1]
  }
  
  clone(){return new Point(this.x,this.y)}
  
  equals(point){return point.x==this.x&&point.y==this.y}
  
  expand(radius=1){
    let r=radius
    return area([this.x-r,this.x+r+1],[this.y-r,this.y+r+1]).filter(p=>!p.equals(this))
  }
}

export function* iterate(xrange,yrange){
  for(let x=xrange[0];x<xrange[1];x++) 
    for(let y=yrange[0];y<yrange[1];y++) 
      yield new Point(x,y)
}

export function random(xrange,yrange){
  let x=rpg.roll(xrange[0],xrange[1])
  let y=rpg.roll(yrange[0],yrange[1])
  return new Point(x,y)
}

export function area(xrange,yrange){return Array.from(iterate(xrange,yrange))}
