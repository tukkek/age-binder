import * as director from './director.js'
import * as color from '../../model/color.js'

export class Realm{
  static pool=[]
  
  constructor(name,people,culture){
    this.name=name+' empire'
    this.culture=culture
    this.people=people
  }
  
  get color(){return '#'+color.gems.get(name)}//TODO view
}

class Shiva extends director.Director{
  play(){
    this.world.year+=1
  }
}

export var instance=new Shiva()
