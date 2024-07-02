import * as preset from '../control/preset.js'

export var gems=new Map([['Emerald','50C878'],['Ruby','e0115f'],['Amethyst','9966cc'],
                            ['Diamond','b9f2ff'],['Opal','a8c3bc'],['Sapphire','0F52BA'],
                            ['Aquamarine','7FFFD4'],['Garnet','733635'],['Topaz','FFC067'],
                            ['Agate','333a4a'],['Citrine','E4D00A'],['Tanzanite','8551ff'],
                            ['Onyx','353935'],['Tourmaline','88a5af'],['Jade','00A36C'],
                            ['Lapis','26619c'],['Peridot','B4C424'],['Alexandrite','598c74'],
                            ['Beryl','D6E3B5'],['Moonstone','3aa8c1'],['Pearl','E2DFD2'],
                            ['Turquoise','40E0D0'],['Morganite','b28fc0'],['Corundum','62686C'],]
                              .sort((a,b)=>a[0].localeCompare(b[0])))
export var presets=[new preset.Preset('Gems',Array.from(gems.keys()))]
