import * as engine from '../engine.js'
import * as log from '../log.js'

export class Director{
  constructor(){
    return
  }
  
  play(){
    let w=this.world
    this.log(`Year ${w.year} of age ${w.age}...`)
  }
  
  get world(){return engine.world}
  
  log(message){log.log(message)}
}
