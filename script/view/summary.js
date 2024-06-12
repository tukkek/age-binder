import * as engine from '../control/engine.js'

var showing=false

export function show(hex){//TODO
  if(showing==hex) return false
  showing=hex
  let resources=hex.area.map(a=>engine.world.grid[a.x][a.y].resource)
                  .filter(r=>r).map(r=>r.name)
  if(resources.length==0) return
  console.log(new Set(resources))
}
