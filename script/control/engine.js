//TODO import * as character from '../model/character.js'
import * as map from '../view/map.js'
import * as worldm from '../model/world.js'

export var world=new worldm.World(window.innerWidth,window.innerHeight)

function tick(){
  world.live()
  map.draw()
  setTimeout(tick,100)
}

export function setup(){
  map.setup()
  tick()
}
