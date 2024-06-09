//TODO import * as character from '../model/character.js'
import * as map from '../view/map.js'
import * as label from '../view/label.js'
import * as worldm from '../model/world.js'
import * as debug from './debug.js'

export var world=new worldm.World(window.innerWidth,window.innerHeight)
export var pulse=new Array(2).fill(new Date().getTime())

var lastupdate=[world.age-1,world.year-1]

function update(){
  let w=world
  let y=w.year
  let a=w.age
  if(!(a>lastupdate[0]||y>lastupdate[1])) return
  lastupdate=[w.age,w.year]
  label.update()
  if(debug.profile) return
  if(debug.debug&&a<0) return
  map.draw()
}

function tick(){
  world.live()
  if(debug.debug) pulse=[pulse[1],new Date().getTime()]
}

export function setup(){
  map.setup()
  label.setup()
  setInterval(tick,100)
  setInterval(update,1000)
}
