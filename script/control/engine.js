//TODO import * as character from '../model/character.js'
import * as map from '../view/map.js'
import * as log from '../view/log.js'
import * as setupm from '../view/setup.js'
import * as controls from '../view/controls.js'
import * as worldm from '../model/world.js'
import * as name from '../model/name.js'
import * as worship from '../model/worship.js'
import * as debug from './debug.js'
import * as save from './save.js'
import * as rpg from './rpg.js'

export var pulse=new Array(2).fill(new Date().getTime())
export var world=false

var lastupdate=[-9000,-9000]
var redraw=true

function update(force=false){
  if(!controls.play()&&!force) return
  let w=world
  let y=w.year
  let a=w.age
  if(!(a>lastupdate[0]||y>lastupdate[1])&&!force) return
  lastupdate=[w.age,w.year]
  log.update()
  if(debug.profile&&!(a==1&&y==1)) return
  if(debug.on&&a<1) return
  map.draw(redraw)
  redraw=false
}

function tick(){
  if(!controls.play()) return
  if(world.live()) redraw=true
  let logs=log.entries
  let l=logs[logs.length-1]
  if(l.year==world.year&&l.age==world.age){
    controls.step()
    update(true)
  }
  if(!debug.on) return
  pulse=[pulse[1],new Date().getTime()]
  if(world.age>-50) debug.tick()
}

export async function setup(){
  await name.setup()
  worship.setup()
  await setupm.setup()
  await setupm.open()
  if(debug.saved){
    world=await save.restore()
    rpg.seed(world.name.toLowerCase())
  }else{
    let n=setupm.name()
    rpg.seed(n.toLowerCase())
    let size=[window.innerWidth,window.innerHeight]
    world=new worldm.World(n,size[0],size[1])
  }
  log.setup()
  map.setup()
  controls.setup()
  if(debug.test){
    debug.test.run()
    return
  }
  setInterval(tick,debug.on?1:100)
  setInterval(update,1000)
}
