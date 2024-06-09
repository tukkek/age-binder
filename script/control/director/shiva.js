import * as director from './director.js'

class Shiva extends director.Director{
  play(){
    this.world.year+=1
  }
}

export var instance=new Shiva()
