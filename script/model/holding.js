import * as image from '../view/image.js'
import * as log from '../view/log.js'
import * as rpg from '../control/rpg.js'
import * as engine from '../control/engine.js'

const GAIN=0

class Holding{
  constructor(name,cell){
    this.title=cell.owner.language.noun
    this.image=image.holdings.draw(name)
    this.point=cell.point.clone()
    this.name=name
    let w=engine.world
    this.founded=`${w.year}, age ${w.age}`
    this.people=[]
  }
  
  turn(){
    this.cell.food-=this.loss
    this.people=this.people.filter(p=>p.live())
    let c=this.cell
    if(rpg.chance(50)) this.people.push(c.owner.birth(c))
  }
  
  get cell(){return engine.world.grid[this.point.x][this.point.y]}
  
  announce(realm,hex){log.enter(`${realm.name} constructs a holding in the ${hex.name}`)}
  
  rank(person){throw 'unimplemented'}
  
  //TODO https://github.com/tukkek/age-binder/issues/1
  get loss(){return this.cell.hex.area.length}
}

export class Outpost extends Holding{
  constructor(cell){
    super('outpost',cell)
    this.title=`Outpost of ${this.title}`
  }
  
  announce(realm,hex){log.enter(`${realm.name} founds an outpost in the ${hex.name}`)}
  
  rank(person){return ['Citizen','Leader','Boss','Overseer','Mayor'][person.level]}
  
  turn(){
    this.cell.trade-=this.loss
    super.turn()
  }
}

export class Fort extends Holding{
  constructor(cell){
    super('fort',cell)
    this.title=`Fort ${this.title}`
  }
  
  announce(realm,hex){log.enter(`${realm.name} erects a fort in the ${hex.name}`)}
  
  rank(person){return ['Soldier','Sergeant','Captain','Major','General'][person.level]}
  
  turn(){
    this.cell.arms-=this.loss
    super.turn()
  }
}

export class Precinct extends Holding{
  constructor(cell){
    super('precinct',cell)
    this.title=`${this.title} precinct`
  }
  
  announce(realm,hex){log.enter(`${realm.name} establishes a precinct in the ${hex.name}`)}
  
  rank(person){return ['Servant','Acolyte','Dean','Bishop','Highness'][person.level]}
  
  turn(){
    this.cell.worship-=this.loss
    super.turn()
  }
}

export function build(type,chance,cell){
  if(cell.holding) return false
  let a=cell.hex.area
  chance=Math.floor(a.length/chance)
  if(chance<1) chance=1
  if(!rpg.chance(chance)) return false
  if(a.indexOf(cell)<0) return false
  let holding=new type(cell)
  holding.announce(cell.owner,cell.hex)
  cell.holding=holding
  return true
}
