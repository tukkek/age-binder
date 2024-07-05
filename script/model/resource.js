import * as rpg from '../control/rpg.js'
import * as engine from '../control/engine.js'
import * as biome from './biome.js'
import * as image from '../view/image.js'

class Resource{
  constructor(name,imagep){
    this.image=image.resources.draw(imagep)
    this.name=name
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
  
  use(cell){cell.trade+=gain}
}

class Focus extends Resource{
  constructor(name){
    super(name,image.resources.focus)
  }
  
  use(cell){cell.worship+=gain}
}

class Food extends Resource{
  constructor(name){
    super(name,image.resources.food)
  }
  
  use(cell){cell.food+=gain}
}

class Material extends Resource{
  constructor(name){
    super(name,image.resources.material)
  }
  
  use(cell){cell.arms+=gain}
}

class Technology extends Resource{
  constructor(name){
    super(name,image.resources.technology)
  }
  
  use(cell){cell.owner.science+=2}
}

export var gain=9

var all=new Map([//0 is basic (implied)
  [biome.plains,[new Plains(),new Luxury('Wine'),new Focus('Tobacco'),
              new Food('Spices'),new Material('Horses'),new Technology('Powder')]],
  [biome.forest,[new Forest(),new Luxury('Dyes'),new Focus('Silk'),
              new Food('Fruit'),new Material('Ivory'),new Technology('Aluminum')]],
  [biome.desert,[false,new Luxury('Silver'),new Luxury('Gold'),
              new Focus('Incense'),new Food('Salt'),new Material('Oil'),new Technology('Uranium')]],
  [biome.mountain,[new Mountain(),new Luxury('Gems'),new Focus('Marble'),new Material('Stone'),
                new Technology('Iron')]],
  [biome.water,[new Water(),new Luxury('Cotton'),new Focus('Amber'),new Food('Sugar'),
            new Technology('Coal')]],
  [biome.ice,[false,new Luxury('Fur'),new Focus('Jade')]],
  [biome.sea,[new Sea()/*,new Focus('pearls')*/]],
])

export function inherit(cell){return all.get(cell.biome)[0]}//TODO use

export function spawn(cell){return rpg.pick(all.get(cell.biome).slice(1))}

export function get(name){
  for(let k of all.keys()) for(let resource of all.get(k))
    if(resource.name==name) return resource
  return false
}
