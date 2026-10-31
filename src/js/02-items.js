/* ===== ITEMS: 4 equipment slots (melee, gun, body, legs) plus consumables (use). Add entries here;
   add ids to DROPS to let monsters drop them. Body/legs armor may carry a stat bonus (stat:{might,guile,resolve}). ===== */
const CAT_LABEL={melee:'Melee weapon',gun:'Ranged weapon',body:'Body armor',legs:'Leg armor',use:'Consumable'};
const ITEMS={
 chainblade:{n:'Ironwolf Cutter',slot:'melee',atk:6,acc:1},
 cleaver:{n:'Salvaged Pipe Wrench',slot:'melee',atk:4,acc:0,tier:'weak'},
 shiv:{n:'Trench Shiv',slot:'melee',atk:5,acc:1,tier:'weak'},
 maul:{n:'Thunderclap Sledge',slot:'melee',atk:10,acc:0,tier:'strong'},
 spike:{n:'Void Spike',slot:'melee',atk:9,acc:2,tier:'strong'},
 pistol:{n:'Salvaged Repeater',slot:'gun',atk:5,acc:1,tier:'weak'},
 plasma:{n:'Sunspear Lancer',slot:'gun',atk:13,acc:-1,tier:'strong'},
 carapace:{n:'Ironwolf Flak Vest',slot:'body',dr:2},
 scrap:{n:'Bolted Hull Plating',slot:'body',dr:1,tier:'weak'},
 bodyMight:{n:'Brute-Forged Breastplate',slot:'body',dr:1,stat:{might:1},tier:'weak'},
 bodyGuile:{n:'Shadowweave Vest',slot:'body',dr:1,stat:{guile:1},tier:'weak'},
 bodyResolve:{n:'Stalwart Harness',slot:'body',dr:1,stat:{resolve:1},tier:'weak'},
 bodyMix:{n:'Hybrid Combat Rig',slot:'body',dr:1,stat:{guile:1,resolve:1},tier:'weak'},
 bulwark:{n:'Anvil-Class Siege Plate',slot:'body',dr:4,tier:'strong'},
 bodyMightS:{n:'Juggernaut Plate',slot:'body',dr:3,stat:{might:2},tier:'strong'},
 bodyGuileS:{n:'Phantom Weave Plate',slot:'body',dr:3,stat:{guile:2},tier:'strong'},
 bodyResolveS:{n:'Bastion Plate',slot:'body',dr:3,stat:{resolve:2},tier:'strong'},
 bodyMixS:{n:'Warbound Plate',slot:'body',dr:3,stat:{might:1,guile:1,resolve:1},tier:'strong'},
 legplate:{n:'Salvaged Legplate',slot:'legs',dr:1,tier:'weak'},
 legsMight:{n:'Stormtrooper Greaves',slot:'legs',dr:1,stat:{might:1},tier:'weak'},
 legsGuile:{n:'Silent Treads',slot:'legs',dr:1,stat:{guile:1},tier:'weak'},
 legsResolve:{n:'Anchor Greaves',slot:'legs',dr:1,stat:{resolve:1},tier:'weak'},
 legsMix:{n:'Scavenger Leg Guards',slot:'legs',dr:1,stat:{might:1,resolve:1},tier:'weak'},
 ablative:{n:'Ablative Plating',slot:'legs',dr:3,tier:'strong'},
 legsMightS:{n:'Siegebreaker Greaves',slot:'legs',dr:2,stat:{might:2},tier:'strong'},
 legsGuileS:{n:'Nightfall Treads',slot:'legs',dr:2,stat:{guile:2},tier:'strong'},
 legsResolveS:{n:'Unbreakable Greaves',slot:'legs',dr:2,stat:{resolve:2},tier:'strong'},
 legsMixS:{n:'Warden’s Leg Plate',slot:'legs',dr:2,stat:{might:1,guile:1,resolve:1},tier:'strong'},
 stim:{n:'Rattlesnake Stim',slot:'use',heal:6,tier:'weak'},
 bandage:{n:'Field Bandage',slot:'use',heal:4,tier:'weak'},
 medikit:{n:'Lazarus Trauma Kit',slot:'use',heal:12,tier:'strong'},
 nanite:{n:'Nanite Canister',slot:'use',heal:9,tier:'strong'},
 hiveblade:{n:'Hivebreaker Gauntlet',slot:'melee',atk:11,acc:1,tier:'strong'},
 elixir:{n:'Sovereign’s Elixir',slot:'use',heal:15,tier:'strong'}
};
const DROPS={
 small:['cleaver','shiv','pistol','scrap','bodyMight','bodyGuile','bodyResolve','bodyMix','legplate','legsMight','legsGuile','legsResolve','legsMix','stim','bandage'],
 big:['maul','spike','plasma','bulwark','bodyMightS','bodyGuileS','bodyResolveS','bodyMixS','ablative','legsMightS','legsGuileS','legsResolveS','legsMixS','medikit','nanite','hiveblade','elixir']
};
