//TODO import * as character from '../model/character.js'
import * as map from '../view/map.js'
import * as label from '../view/label.js'
import * as names from '../view/names.js'
import * as controls from '../view/controls.js'
import * as worldm from '../model/world.js'
import * as debug from './debug.js'
import * as rpg from './rpg.js'

export var pulse=new Array(2).fill(new Date().getTime())
export var world=false

var lastupdate=[-9000,-9000]

function update(){
  if(!controls.play()) return
  let w=world
  let y=w.year
  let a=w.age
  if(!(a>lastupdate[0]||y>lastupdate[1])) return
  lastupdate=[w.age,w.year]
  label.update()
  if(debug.profile&&!(a==1&&y==1)) return
  if(debug.on&&a<1) return
  map.draw()
}

function tick(){
  if(!controls.play()) return
  world.live()
  if(!debug.on) return
  pulse=[pulse[1],new Date().getTime()]
  if(world.age>-50) debug.tick()
}

export async function setup(){
  await names.setup()
  let n=await names.get()
  rpg.seed(n.toLowerCase())
  let size=[window.innerWidth,window.innerHeight]
  world=new worldm.World(n,size[0],size[1])
  map.setup()
  label.setup()
  controls.setup()
  if(debug.test){
    debug.test.run()
    return
  }
  setInterval(tick,100)
  setInterval(update,1000)
}
