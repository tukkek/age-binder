import * as rpg from '../control/rpg.js'
import * as preset from '../control/preset.js'
import * as eloquium from '../../library/eloquium/eloquium.js'

class Scenario{
  constructor(){
    this.adjectives=false
    this.nouns=false
  }

  async load(file){
    let j=await fetch(`./corpora/data/words/${file}.json`)
    j=await j.json()
    return j[file]
  }

  async setup(){
    this.adjectives=await this.load('adjs')
    this.nouns=await this.load('nouns')
  }

  get(){
    let name=`${rpg.pick(this.adjectives)} ${rpg.pick(this.nouns)}`
    return name[0].toUpperCase()+name.slice(1)
  }
}

export var presets=[]
export var scenario=new Scenario()
export var countries=eloquium.countries
export var fantasy=eloquium.fantasy

function populate(name,map){presets.push(new preset.Preset(name,Array.from(map.keys())))}

export async function setup(){
  await scenario.setup()
  eloquium.seed(rpg)
  await eloquium.setup()
  populate('Countries',countries)
  populate('Fantasy',fantasy)
  return Promise.resolve()
}

export function speak(people){return countries.get(people)||fantasy.get(people)}
