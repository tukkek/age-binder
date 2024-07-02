import * as name from './name.js'

const REAL=new Map([['muslim',['bangladesh','indonesia','nigeria','pakistan']],
                        ['catholicism',['brazil','france','germany','italy','mexico']],
                        ['lutheranism',['finland','iceland','norway']],
                        ['taoism',['china']],
                        ['orthodox',['greece','russia']],
                        ['hinduism',['india']],
                        ['shintoism',['japan']],
                        ['protestantism',['us']],])

class Preset{
  constructor(name,values=[]){
    this.values=values
    this.name=name
  }
}

export var fantasy=new Preset('Fantasy',['destruction','air','earth','fire','knowledge',
                                          'luck','magic','war','water'])
export var greek=new Preset('Greek',['perses','hermes','gaia','hephaestus','athena',
                                      'tyche','hecate','ares','poseidon'])
export var astrology=new Preset('Western zodiac',['Aries','Taurus','Gemini','Cancer','Leo',
                                                  'Virgo','Libra','Scorpio','Sagittarius',
                                                  'Capricorn','Aquarius','Pisces'])
export var zodiac=new Preset('Eastern zodiac',['rat','ox','tiger','rabbit','dragon','snake',
                                                'horse','goat','monkey','rooster','dog','pig'])
export var tarot=new Preset('Tarot (major arcana)',['The Fool','The Magician','The High Priestess',
                                                    'The Empress','The Emperor','The Hierophant',
                                                    'The Lovers','The Chariot','Strength',
                                                    'The Hermit','Wheel of Fortune','Justice',
                                                    'The Hanged Man','Death','Temperance','The Devil',
                                                    'The Tower','The Star','The Moon',
                                                    'The Sun','Judgement','The World'])
export var countries=new Preset('Religions')
export var mix=new Preset('Mix')

export function setup(){
  let real=Array.from(REAL.keys())
  for(let c of name.countries.keys())
    countries.values.push(real.find(k=>REAL.get(k).indexOf(c)>=0))
  mix.values.push(...new Set([fantasy,greek,astrology,zodiac,tarot,countries].flatMap(m=>m.values)))
}
