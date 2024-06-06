import * as rpg from '../control/rpg.js'

const PHYSICAL=['Fool']
const EMOTIONAL=['Magician','Priestess','Empress','Emperor','Hierophant','Lovers','Chariot']
const MENTAL=['Strength','Hermit','Fortune','Justice','Hanged','Death','Temperance']
const SPIRITUAL=['Devil','Tower','Star','Moon','Sun','Judgement','World']
const ARCANA=[PHYSICAL,EMOTIONAL,MENTAL,SPIRITUAL]
const AIR=['Energy','Peace','Sorrow','Rest','Loss',
            'Change','Uncertainty','Conflict','Despair','Desolation',
            'Control','Action','Reason','Intuition']
const EARTH=['Wealth','Unity','Gain','Order','Adaptation',
              'Well-being','Delay','Skill','Prudence','Prosperity',
              'Growth','Construction','Nurture','Conception']
const VERTICAL=[AIR,EARTH]
const FIRE=['Potency','Dominion','Enterprise','Completion','Endeavour',
            'Victory','Valour','Speed','Preparation','Oppression',
            'Transformation','Aspiration','Reflection','Innovation']
const WATER=['Beauty','Love','Joy','Satiety','Regret',
              'Satisfaction','Imagination','Instability','Content','Success',
              'Evolution','Creativity','Contemplation','Inspiration']
const HORIZONTAL=[FIRE,WATER]
const SETS=[AIR,WATER,EARTH,FIRE,ARCANA.flatMap(cards=>cards)]
const GROUPS=new Map([
  [PHYSICAL,'Physical'],
  [EMOTIONAL,'Emotional'],
  [MENTAL,'Mental'],
  [SPIRITUAL,'Spiritual'],
  [AIR,'Air'],
  [EARTH,'Earth'],
  [FIRE,'Fire'],
  [WATER,'Water'],
])

export class Character{
  constructor(){
    this.major=rpg.pick(SETS[4])
    this.minor=[HORIZONTAL,VERTICAL].map(axis=>rpg.pick(rpg.pick(axis)))
  }
  
  get cards(){return [this.major,this.minor[0],this.minor[1]]}
  
  rank(){return this.cards.map(card=>rank(card))}
  
  group(){
    let keys=Array.from(GROUPS.keys())
    let groups=[]
    for(let c of this.cards){
      let g=keys.find(g=>g.indexOf(c)>=0)
      groups.push(GROUPS.get(g))
    }
    return groups
  }
  
  toString(){
    let groups=this.group()
    let ranks=this.rank()
    return [this.major,this.minor[0],this.minor[1]]
            .map((card,i)=>`${card} (${groups[i].toLowerCase()}, #${ranks[i]})`).join('\n')
  }
  
  //TODO conflict(character){return true||false}
}

function rank(card){
  let rank=-1
  for(let s of SETS){
    rank=s.indexOf(card)
    if(rank<0) continue
    if(s!=SETS[4]) rank+=1
    break
  }
  return rank
}
