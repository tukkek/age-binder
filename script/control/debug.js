import * as resource from '../model/resource.js'

const PARAMETERS=new URL(window.location).searchParams

class Test{
  run(){
    return
  }
}

export var profile=PARAMETERS.has('profile')
export var test=PARAMETERS.has('test')&&new Test()
export var saved=PARAMETERS.has('saved')
export var on=profile||test||saved||PARAMETERS.has('debug')

export function tick(){
  return
}
