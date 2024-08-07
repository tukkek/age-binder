var rng=Math.random

export function roll(min,max){return Math.floor(rng()*(max-min+1))+min}

export function pick(array){return array[roll(0,array.length-1)]}

export function high(min,max,m=Math.max){return m(roll(min,max),roll(min,max))}

export function low(min,max){return high(min,max,Math.min)}

export function chance(n){return n>=1&&roll(1,n)==n}

export function shuffle(array){
  let last=array.length-1
  for(let i=0;i<last;i++){
    let j=roll(i,last)
    let a=array[i]
    let b=array[j]
    array[i]=b
    array[j]=a
  }
  return array
}

export function random(chance){return rng()<chance}

export function seed(s){rng=new alea(s)}
