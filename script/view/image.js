class Gallery{
  constructor(prefix){
    this.prefix=`./image/${prefix}/`
  }
}

class Resources extends Gallery{
  constructor(){
    super('icon')
    this.technology='S_Thunder01.png'
    this.material='E_Metal02.png'
    this.luxury='I_Diamond.png'
    this.focus='S_Holy10.png'
    this.food='I_C_Orange.png'
  }
}

export var resources=new Resources()
