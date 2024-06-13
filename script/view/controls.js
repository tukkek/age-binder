const CONTROLS=document.querySelectorAll('#controls>div')
const SELECTED='selected'
const PAUSE=CONTROLS[1]
const PLAY=CONTROLS[0]
const STEP=CONTROLS[2]

var selected=PLAY

function click(control,force=false){
  if(control==selected) return
  if(selected==STEP&&!force) return
  if(selected) selected.classList.remove(SELECTED)
  selected=control
  selected.classList.add(SELECTED)
}

export function setup(){for(let c of CONTROLS) c.onclick=event=>click(c)} 

export function play(){
  if(selected==STEP){
    setTimeout(()=>click(PAUSE,true),3000)
    return PLAY
  }
  return selected==PLAY
}
