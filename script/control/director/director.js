import * as engine from '../engine.js'
import * as log from '../log.js'

export class Director{
  constructor(){
    return
  }
  
  play(){throw 'unimplemented'}
  
  get world(){return engine.world}
  
  log(message){log.log(message)}
}
