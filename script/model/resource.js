import * as rpg from '../control/rpg.js'
import * as engine from '../control/engine.js'
import * as biome from '../control/biome.js'
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

var all=new Map([//0 is basic (implied)
  [biome.plains,[new Plains(),new Luxury('wine'),new Focus('tobacco'),
              new Food('spices'),new Material('horses'),new Technology('powder')]],
  [biome.forest,[new Forest(),new Luxury('dyes'),new Focus('silk'),
              new Food('fruit'),new Material('ivory'),new Technology('aluminum')]],
  [biome.desert,[false,new Luxury('silver'),new Luxury('gold'),
              new Focus('incense'),new Food('salt'),new Material('oil'),new Technology('uranium')]],
  [biome.mountain,[new Mountain(),new Luxury('gems'),new Focus('marble'),new Material('stone'),
                new Technology('iron')]],
  [biome.water,[new Water(),new Luxury('cotton'),new Focus('amber'),new Food('sugar'),
            new Technology('coal')]],
  [biome.ice,[false,new Luxury('fur'),new Focus('jade')]],
  [biome.sea,[new Sea()/*,new Focus('pearls')*/]],
])


export function inherit(cell){return all.get(cell.biome)[0]}//TODO use

export function spawn(cell){return rpg.pick(all.get(cell.biome).slice(1))}
