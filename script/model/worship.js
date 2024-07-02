import * as name from './name.js'
import * as preset from '../control/preset.js'

const REAL=new Map([['Islam',['Bangladesh','Indonesia','Nigeria','Pakistan']],
                        ['Catholicism',['Brazil','France','Germany','Italy','Mexico']],
                        ['Lutheranism',['Finland','Iceland','Norway']],
                        ['Taoism',['China']],
                        ['Orthodox',['Greece','Russia']],
                        ['Hinduism',['India']],
                        ['Shintoism',['Japan']],
                        ['Protestantism',['US']],])
const FANTASY=["Air","Destruction","Earth","Fire","Knowledge","Luck","Magic","War","Water"]
const GREEK=["Ares","Athena","Gaia","Hecate","Hephaestus","Hermes","Perses","Poseidon","Tyche"]
const ASTROLOGY=['Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio','Sagittarius',
                  'Capricorn','Aquarius','Pisces']
const ZODIAC=["Rat","Ox","Tiger","Rabbit","Dragon","Snake","Horse","Goat","Monkey","Rooster","Dog","Pig"]
const TAROT=['The Fool','The Magician','The High Priestess','The Empress','The Emperor',
              'The Hierophant','The Lovers','The Chariot','Strength','The Hermit',
              'Wheel of Fortune','Justice','The Hanged Man','Death','Temperance','The Devil',
              'The Tower','The Star','The Moon','The Sun','Judgement','The World']

export var fantasy=new preset.Preset('Fantasy',FANTASY)
export var greek=new preset.Preset('Greek',GREEK)
export var astrology=new preset.Preset('Zodiac (western)',ASTROLOGY)
export var zodiac=new preset.Preset('Zodiac (eastern)',ZODIAC)
export var tarot=new preset.Preset('Tarot (major arcana)',TAROT)
export var countries=new preset.Preset('Religions')
export var mix=new preset.Preset('Mix')
export var presets=[countries,fantasy,greek,astrology,zodiac,tarot,mix]

export function setup(){
  let real=Array.from(REAL.keys())
  for(let c of name.countries.keys())
    countries.values.push(real.find(k=>REAL.get(k).indexOf(c)>=0))
  mix.values.push(...new Set([fantasy,greek,astrology,zodiac,tarot,countries].flatMap(m=>m.values)))
  mix.values.sort()
}
