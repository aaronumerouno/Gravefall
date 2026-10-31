/* ===== CHAPTER 3: closes Act I (the alien war). bg = which scene art to reuse; new enemies reuse existing sprite rows with a new palette (see SPF). ===== */
Object.assign(SCENES,{
 ch3_start:{title:'Into the Dark Below',bg:'intro',text:[
  'Colonel Vex’s last signal traces to a fracture far beneath Hollow Station, a wound in the rock that should not be there. “Captain, I am reading something enormous down there,” Brannigan says, his voice tight. “Old. Older than the Colonel, older than the war,” he adds.',
  '“Then we go down and end it,” Ironside says. Quill eases the <em>Wrenhawk</em> over the open chasm. “Say the word, Captain,” she says.'],
  choices:[
   {text:'Rappel down the open chasm',check:{stat:'resolve',dc:11},win:{msg:'You drop through the dark and land steady.',goto:'ch3_den',fx:{flag:'chasm'}},lose:{msg:'The line jerks and you hit the deck hard.',goto:'ch3_den',fx:{hp:-4,flag:'chasm'}}},
   {text:'Force the sealed airlock nearby',check:{stat:'might',dc:14},win:{msg:'The old seal groans and gives way.',goto:'ch3_den',fx:{flag:'airlock'}},lose:{msg:'The airlock holds, and the recoil nearly breaks your wrist.',goto:'ch3_den',fx:{hp:-5,flag:'airlock'}}}]},
 ch3_den:{title:'The Writhing Dark',bg:'c1',text:[
  'Something ancient breathes beneath the dark. The walls themselves seem to shift, and a shape detaches from the rock, too many limbs, moving wrong. “Contact!” Ironside roars. “I have no reading on that thing, Captain,” Brannigan says. “None at all,” he adds.',
  'The Hive Stalker shrieks, a sound like metal tearing. “It is not alone,” Quill warns.'],
  fight:{name:'Hive Stalker',ref:'the Hive Stalker',pr:'it',pos:'its',hp:17,dc:12,def:0,acc:8,dmg:6,drop:'small',say:['The Hive Stalker lunges from the dark, too fast to track.','A sound like tearing metal rips from the Hive Stalker.','The Hive Stalker claws at you from every angle at once.','The Hive Stalker skitters along the wall, never still.','Something in the Hive Stalker’s shriek sounds almost like words.','The Hive Stalker presses the attack without pause.'],
  envAction:{label:'Collapse a weak section of wall',stat:'might',dc:13,type:'damage',amount:6,text:{
   success:'You drive your shoulder into a cracked section of wall and bring it down on the Hive Stalker. “Down!” Ironside roars.',
   crit:'The whole section gives way at once, burying the Stalker under rubble. “That did it!” Brannigan calls.',
   fail:'The wall holds, and the Stalker is already past your guard. “Blast it!” Ironside snarls.',
   fumble:'The wall gives way toward you instead, and rubble catches your shoulder. “Argh!” Ironside cries.'}}},then:'ch3_relay'},
 ch3_relay:{title:'The Humming Walls',bg:'relay',text:[
  'The passage splits three ways, each wall pulsing faintly, almost like a heartbeat. “Captain, this place is alive,” Brannigan says, disbelief in his voice. “Pick a path and pick it fast, it is listening,” he adds.'],
  choices:[
   {text:'Read the pulses and follow the quiet one',check:{stat:'guile',dc:12},win:{msg:'You find the dead patch and slip through it.',goto:'ch3_warden'},lose:{msg:'The wall shudders under your hand before you find the way.',goto:'ch3_warden',fx:{hp:-4}}},
   {text:'Push through the weakest-looking wall',check:{stat:'might',dc:14},win:{msg:'The wall caves inward in a shower of dust.',goto:'ch3_warden'},lose:{msg:'The wall holds, and something behind it hits back.',goto:'ch3_warden',fx:{hp:-6}}},
   {text:'Hold steady while Quill gets a bearing',check:{stat:'resolve',dc:11},win:{msg:'Quill calls the path, calm and certain.',goto:'ch3_warden'},lose:{msg:'The pulse rises to a shriek before Quill can be sure.',goto:'ch3_warden',fx:{hp:-5}}}]},
 ch3_warden:{title:'The Core Warden',bg:'brute',text:[
  'The passage opens on a chamber built from fused rock and hull plate alike, and something rises to fill it, armored in overlapping plates grown rather than welded. “Lieutenant, tell me that is not what I think it is,” Ironside says. “It is bigger, Captain,” Quill answers. “It is always bigger,” she adds.',
  '“Guardian of the deep!” the Hive Warden booms, a voice built from a dozen stolen ones. “None pass!” it adds.'],
  fight:{name:'Hive Warden',ref:'the Hive Warden',pr:'it',pos:'its',hp:28,dc:12,def:3,acc:8,dmg:9,drop:'big',say:['The Hive Warden’s plated fist crashes down like a hull breach.','“None pass!” the Hive Warden booms.','The deck cracks under the Hive Warden’s weight.','The Hive Warden’s plating shifts and resets itself.','“Guardian stands!” the Hive Warden booms again.','The Hive Warden does not retreat, does not tire.'],
  envAction:{label:'Read its patterns from behind the debris',stat:'guile',dc:12,type:'guile',amount:1,text:{
   success:'You duck behind a sheet of fallen hull plate and watch the Warden move. Your instincts sharpen.',
   crit:'You catch the rhythm of its attacks completely, every opening laid bare. Your instincts sharpen further.',
   fail:'The Warden turns before you can learn anything useful, and it is already on you. “Blast it!” Ironside grunts.',
   fumble:'The debris shifts under you and gives your position away early. Your confidence slips. “Argh!” Ironside cries.'}}},then:'ch3_respite'},
 ch3_respite:{title:'The Dead Nest',bg:'medbay',text:[
  'Past the Warden’s chamber lies a hollow lined with husks, old and still. “Captain, whatever lived here is long gone,” Brannigan says. “Long gone, or long since became something else,” he adds, quieter.',
  '“We have a minute, not more,” Ironside says.'],
  choices:[
   {text:'Patch yourself up properly',check:{stat:'resolve',dc:9},win:{msg:'Your hands stay steady. The wounds close.',goto:'ch3_descent',fx:{hp:10}},lose:{msg:'Pain blurs your vision, but you seal the worst of it.',goto:'ch3_descent',fx:{hp:3}}},
   {text:'Search the husks for anything useful',check:{stat:'guile',dc:12},win:{msg:'Something intact, still faintly warm.',goto:'ch3_descent',fx:{give:'small'}},lose:{msg:'One of the husks is not as dead as it looked.',goto:'ch3_descent',fx:{hp:-3}}},
   {text:'Press on, no time to waste',goto:'ch3_descent'}]},
 ch3_descent:{title:'The Last Descent',text:[
  'Below the nest, a shaft drops straight down toward a light that should not exist this deep. “That is the core, Captain,” Brannigan says. “Whatever is down there, it is close now,” he adds.',
  '“Then let’s finish it,” Ironside says, checking his blade one last time.'],
  choices:[
   {text:'Take the narrow service shaft',check:{stat:'resolve',dc:12},win:{msg:'You keep your footing on the long drop down.',goto:'ch3_relic'},lose:{msg:'You slip and ride the last ten meters on your back.',goto:'ch3_relic',fx:{hp:-5}}},
   {text:'Blast through the sealed floor',check:{stat:'might',dc:15},win:{msg:'The floor gives way clean, and you drop through.',goto:'ch3_relic'},lose:{msg:'The charge goes wrong and the blast catches you too.',goto:'ch3_relic',fx:{hp:-7}}}]},
 ch3_relic:{title:'The Relic Chamber',bg:'armory',text:[
  'A chamber of grown bone-white pillars holds two things that do not belong to the hive at all: a gauntlet fused from something that still twitches, and a vial of light sealed in old human glass. “Captain, those were not made down here,” Brannigan says. “Salvage, maybe. Or bait,” he adds.',
  'Ironside can only carry one. “Choose fast,” Quill says. “It knows we are here now,” she adds.'],
  choices:[{text:'Take the Hivebreaker Gauntlet',goto:'ch3_threshold',fx:{give:'hiveblade'}},{text:'Take the Sovereign’s Elixir',goto:'ch3_threshold',fx:{give:'elixir'}}]},
 ch3_threshold:{title:'The Sovereign’s Threshold',bg:'gate',text:[
  'The last passage opens on a vast dark chamber, and something vast stirs within it, half-seen. “It knows your name, Captain,” Brannigan says, and for the first time he sounds afraid. “It has known it since Kraag,” he adds.',
  '“Then it has had long enough to get used to it,” Ironside says.'],
  choices:[
   {text:'Slip along the chamber wall unseen',check:{stat:'guile',dc:14},win:{msg:'You reach the center before it turns.  Your instincts sharpen.',goto:'ch3_boss',fx:{stat:{guile:1},flag:'stealth3'}},lose:{msg:'Something vast shifts toward the sound of your boots. Your confidence slips.',goto:'ch3_boss',fx:{stat:{guile:-1},flag:'stealth3'}}},
   {text:'Walk straight into the dark and call it out',check:{stat:'resolve',dc:11},win:{msg:'Your voice does not waver, and the dark answers. Your resolve hardens.',goto:'ch3_boss',fx:{stat:{resolve:1},flag:'bold3'}},lose:{msg:'Your voice cracks on the last word. Your nerve wavers.',goto:'ch3_boss',fx:{stat:{resolve:-1},flag:'bold3'}}}]},
 ch3_boss:{title:'The Hive Sovereign',bg:'boss',text:s=>[
  s.flags.stealth3
   ?'The Hive Sovereign fills the chamber, a fused and ancient shape built from a thousand stolen soldiers, and it is still turning to find you when you are already close. “Quiet,” it says, in every voice it has ever worn at once. “Kraag said you were not. He was wrong about many things,” it adds.'
   :s.flags.bold3
   ?'The Hive Sovereign fills the chamber, a fused and ancient shape built from a thousand stolen soldiers, unhurried as your voice still echoes off its walls. “Loud,” it says, in every voice it has ever worn at once. “Kraag was loud too, at the end,” it adds.'
   :'The Hive Sovereign fills the chamber, a fused and ancient shape built from a thousand stolen soldiers. “Captain Ironside,” it says, in every voice it has ever worn at once. “I built the war that built you,” it adds.',
  '“Then I will finish what you started,” Ironside says. Quill’s voice is barely a whisper. “Captain, whatever happens — it ends here,” she says.'],
  fight:{name:'The Hive Sovereign',ref:'the Sovereign',pr:'it',pos:'its',hp:42,dc:15,def:4,acc:14,dmg:11,drop:null,say:['“Die as they all did,” the Sovereign says, in a hundred overlapping voices.','The Sovereign’s many limbs carve the dark around you.','“I remember every one of them,” the Sovereign whispers. “I will remember you.”','The Sovereign’s voices overlap, arguing with themselves.','“Kraag. Vex. Now you,” the Sovereign says, counting.','The dark around the Sovereign seems to lean closer.'],
  envAction:{label:'Steel yourself against the ancient dark',stat:'resolve',dc:13,type:'resolve',amount:1,text:{
   success:'You plant your boots and steady your breathing, the weight of every soldier who died getting here settling into your resolve. Your resolve hardens.',
   crit:'Something in you locks into place completely — fear has nowhere left to go. Your resolve hardens further.',
   fail:'The dark presses in before you can steady yourself, and the Sovereign is already moving. “Blast it!” Ironside grunts.',
   fumble:'For one terrible moment doubt gets through. Your resolve wavers. “Argh!” Ironside cries.'}}},then:'ch3_victory'},
 ch3_victory:{title:'Victory',bg:'victory',end:1,text:s=>[
  'The Hive Sovereign falls, and the ancient dark finally goes still. Ironside climbs back toward the light as the fracture seals itself behind him. “Captain!” Quill shouts, and Brannigan adds, “It is over. It is actually over.”',
  'Ironside reaches the <em>Wrenhawk</em>, scarred and alive, the war finally behind him. “We won it, comrades,” Ironside says. Quill laughs through tears. “We did, Captain. Every battle of it,” she says.'+
   (s.flags.stealth3?' “Three for three, Captain,” Brannigan says. “It never once saw you coming.”'
    :s.flags.bold3?' “You walked up to the biggest thing in this saga and introduced yourself,” Quill says. “Worked every time,” Ironside says.'
    :'')+
   (s.flags.chasm?' “Still cannot believe you jumped first and asked questions never,” Brannigan mutters.'
    :s.flags.airlock?' “That airlock never stood a chance against you, Captain,” Quill says, smiling.'
    :''),
  'Chapter 3 of the Gravefall Saga ends here, and with it, the war. Brannigan plots a long course home, to a world none of them have seen in years — and Quill says what none of them want to: “Something is wrong down there too, Captain. I can feel it.”']}
});

