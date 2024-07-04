import * as image from '../view/image.js'
import * as log from '../view/log.js'
import * as rpg from '../control/rpg.js'
import * as resource from './resource.js'

class Holding{
  constructor(name,action){
    this.image=image.holdings.draw(name)
    this.action=action
    this.name=name
    this.title=false
  }
  
  turn(cell){throw 'unimplemented'}
  
  announce(cell){log.enter(`${cell.owner.name} ${this.action} in the ${cell.hex.name}`)}
  
  baptize(title){this.title=title}
}

export class Outpost extends Holding{
  constructor(){
    super('outpost','founds an outpost')
  }
  
  turn(cell){cell.trade+=resource.gain}
  
  baptize(title){this.title=`Outpost of ${title}`}
}

export class Fort extends Holding{
  constructor(){
    super('fort','erects a fort')
  }
  
  turn(cell){cell.arms+=resource.gain}
  
  baptize(title){this.title=`Fort ${title}`}
}

export class Precinct extends Holding{
  constructor(){
    super('precint','establishes a precinct')
  }
  
  turn(cell){cell.worship+=resource.gain}
  
  baptize(title){this.title=`${title} precinct`}
}

export function build(type,chance,cell){
  if(cell.holding) return false
  let a=cell.hex.area
  chance=Math.floor(a.length/chance)
  if(!rpg.chance(chance)) return false
  if(a.indexOf(cell)<0) return false
  let holding=new type()
  holding.announce(cell)
  holding.turn(cell)
  cell.holding=holding
  holding.baptize(cell.owner.language.province)
  return true
}
