//TODO import * as character from '../model/character.js'
import * as map from '../view/map.js'
import * as worldm from '../model/world.js'
import * as debug from './debug.js'

export var world=new worldm.World(window.innerWidth,window.innerHeight)

export function setup(){
  map.setup()
  setInterval(()=>world.live(),100)
  if(!debug.profile) setInterval(()=>map.draw(),500)
}
