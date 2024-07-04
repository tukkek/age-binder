class Gallery{
  constructor(prefix){
    this.prefix=`./image/${prefix}/`
  }
  
  draw(image){return `${this.prefix}${image}`}
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

class Holdings extends Gallery{
  constructor(){
    super('holding')
  }
  
  draw(image){return `${super.draw(image)}.webp`}
}

export var resources=new Resources()
export var holdings=new Holdings()
