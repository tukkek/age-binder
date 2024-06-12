import * as rpg from '../control/rpg.js'
import * as engine from '../control/engine.js'
import * as image from '../view/image.js'

const YIELD=10

class Resource{
  constructor(name,image=false){
    this.name=name
    this.image=image
  }
  
  use(cell){throw 'unimplemented'}
}

class Plains extends Resource{
  constructor(){
    super('basic plains')
  }
  
  use(cell){
    cell.food+=.5
    cell.trade+=.5
  }
}

class Forest extends Resource{
  constructor(){
    super('basic forest')
  }
  
  use(cell){cell.food+=1}
}

class Mountain extends Resource{
  constructor(){
    super('basic mountain')
  }
  
  use(cell){cell.arms+=1}
}

class Water extends Resource{
  constructor(){
    super('basic water')
  }
  
  use(cell){cell.food+=1}
}

class Sea extends Resource{
  constructor(){
    super('basic sea')
  }
  
  use(cell){cell.food+=1}
}

class Luxury extends Resource{
  constructor(name){
    super(name,image.resources.luxury)
  }
  
  use(cell){cell.trade+=YIELD}
}

class Focus extends Resource{
  constructor(name){
    super(name,image.resources.focus)
  }
  
  use(cell){cell.worship+=YIELD}
}

class Food extends Resource{
  constructor(name){
    super(name,image.resources.food)
  }
  
  use(cell){cell.food+=YIELD}
}

class Material extends Resource{
  constructor(name){
    super(name,image.resources.material)
  }
  
  use(cell){cell.arms+=YIELD}
}

class Technology extends Resource{
  constructor(name){
    super(name,image.resources.technology)
  }
  
  use(cell){cell.science+=YIELD}
}

const PLAINS='plains'
const FOREST='forest'
const DESERT='desert'
const MOUNTAIN='mountain'
const WATER='water'
const ICE='ice'
const SEA='sea'

var all=new Map([//0 is basic (implied)
  [PLAINS,[new Plains(),new Luxury('wine'),new Focus('tobacco'),
              new Food('spices'),new Material('horses'),new Technology('powder')]],
  [FOREST,[new Forest(),new Luxury('dyes'),new Focus('silk'),
              new Food('fruit'),new Material('ivory'),new Technology('aluminum')]],
  [DESERT,[false,new Luxury('silver'),new Luxury('gold'),
              new Focus('incense'),new Food('salt'),new Material('oil'),new Technology('uranium')]],
  [MOUNTAIN,[new Mountain(),new Luxury('gems'),new Focus('marble'),new Material('stone'),
                new Technology('iron')]],
  [WATER,[new Water(),new Luxury('cotton'),new Focus('amber'),new Food('sugar'),
            new Technology('coal')]],
  [ICE,[false,new Luxury('fur'),new Focus('jade')]],
  [SEA,[new Sea()/*,new Focus('pearls')*/]],
])

function locate(cell){
  if(cell.sea) return SEA
  if(cell.ice) return ICE
  if(cell.water) return WATER
  if(cell.mountain) return MOUNTAIN
  if(cell.desert) return DESERT
  if(cell.forest) return FOREST
  return PLAINS
}

export function inherit(cell){return all.get(locate(cell))[0]}//TODO use

export function spawn(cell){return rpg.pick(all.get(locate(cell)).slice(1))}//TODO use

/*export function test(cell){
  cell=engine.world.grid[0][0]
  for(let t of all.keys()){
    let log=[t]
    for(let resource of all.get(t)){
      if(!resource) continue
      cell.food=0
      cell.trade=0
      cell.arms=0
      cell.worship=0
      cell.science=0
      resource.use(cell)
      let gained=[]
      if(cell.food>0) gained.push(`+${cell.food} food`)
      if(cell.trade>0) gained.push(`+${cell.trade} trade`)
      if(cell.arms>0) gained.push(`+${cell.arms} arms`)
      if(cell.worship>0) gained.push(`+${cell.worship} worship`)
      if(cell.science>0) gained.push(`+${cell.science} science`)
      log.push(`${resource.name} (${gained.join(", ")})`)
    }
    console.log(log)
  }
}*/
