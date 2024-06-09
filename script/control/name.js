//TODO present a list of names at startup and use name as RNG seed
import * as rpg from './rpg.js'

let adjectives=false
let nouns=false

async function load(file){
  let j=await fetch(`./corpora/data/words/${file}.json`)
  j=await j.json()
  return j[file]
}

export async function setup(){
  adjectives=await load('adjs')
  nouns=await load('nouns')
}

export function get(){
  let name=`${rpg.pick(adjectives)} ${rpg.pick(nouns)}`
  return name[0].toUpperCase()+name.slice(1)
}
