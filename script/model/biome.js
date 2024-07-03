export var mountain='mountain'
export var plains='plains'
export var forest='forest'
export var desert='desert'
export var sea='open sea'
export var water='water'
export var ice='tundra'

export function get(cell){
  if(cell.sea) return sea
  if(cell.ice) return ice
  if(cell.water) return water
  if(cell.mountain) return mountain
  if(cell.desert) return desert
  if(cell.forest) return forest
  return plains
}
