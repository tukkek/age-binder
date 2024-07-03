import * as resource from '../model/resource.js'
import * as world from '../model/world.js'
import * as engine from './engine.js'

const TYPE={type:'application/json'}

class SavedCell{
  constructor(cell){
    this.cell=cell
  }
  
  transfer(cell){
    let a=this.cell
    let b=cell
    b.elevation=a.elevation
    b.fertility=a.fertility
    b.water=a.water
    b.worship=a.worship
    b.trade=a.trade
    b.food=a.food
    b.arms=a.arms
    let r=a.resource
    if(r) b.resource=resource.get(r.name)
  }
}

class SavedWorld{
  constructor(world){
    this.world=world
  }
  
  save(){
    for(let a of this.world.area) a.owner=false
    return JSON.stringify(this.world)
  }
  
  transfer(world){
    let a=this.world
    let b=world
    b.year=0
    b.age=1
    for(let cell of a.grid.flatMap(row=>row)){
      let to=b.grid[cell.x][cell.y]
      new SavedCell(cell).transfer(to)
    }
  }
}

export async function restore(){
  let s=await fetch('saved.json')
  s=await s.json()
  let w=new world.World(s.name,s.width,s.height)
  new SavedWorld(s).transfer(w)
  return w
}

export function store(){
  let w=new SavedWorld(engine.world)
  let b=URL.createObjectURL(new Blob([w.save()],TYPE))
  let e=document.createElement('a')
  e.download='saved.json'
  e.href=b
  e.click()
  URL.revokeObjectURL(b)
}
