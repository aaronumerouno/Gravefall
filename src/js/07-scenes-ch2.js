/* ===== CHAPTER 2: same format as chapter 1. bg = which scene art to reuse. fight.art = which sprite to use. ===== */
Object.assign(SCENES,{
 ch2_start:{title:'Crash Landing',bg:'intro',text:[
  'The <em>Wrenhawk</em> undocks from Gravefall’s bay and burns hard for the dead moon below, one engine already running hot. “Captain, we lost the port thruster,” Quill says, her hands white on the controls. “Brace for a hard landing,” Brannigan adds.',
  'Below, a mining colony glows green in the dark. “That is Hollow Station,” Brannigan says. “Colonel Vex holds it, and Kraag’s fleet took orders from him.” “Then we pay him a visit,” Ironside says, checking his blade.'],
  choices:[
   {text:'Ride out the crash in the cockpit',check:{stat:'resolve',dc:11},win:{msg:'The gunship slams down hard but holds together.',goto:'ch2_tunnel',fx:{flag:'crash_brace'}},lose:{msg:'The hull buckles and throws you into the console.',goto:'ch2_tunnel',fx:{hp:-4,flag:'crash_brace'}}},
   {text:'Jump clear before impact',check:{stat:'might',dc:13},win:{msg:'You roll clear as the Wrenhawk burns behind you.',goto:'ch2_tunnel',fx:{flag:'crash_jump'}},lose:{msg:'You hit the rock hard and tumble.',goto:'ch2_tunnel',fx:{hp:-5,flag:'crash_jump'}}}]},
 ch2_tunnel:{title:'The Green Mist',bg:'c1',text:s=>[
  (s.flags.crash_jump
   ?'The mine tunnels are thick with green mist, and Ironside is still favoring the leg he landed on. Skitterlings swarm from the ore carts. “Contact, left!” Ironside roars, and Brannigan answers, “I count a dozen, Captain — go easy on that leg.”'
   :'The mine tunnels are thick with green mist. Skitterlings swarm from the ore carts. “Contact, left!” Ironside roars, and Brannigan answers, “I count a dozen, Captain.”'),
  'The brood leader clicks and shrieks. “Vex wants you alive,” the brood leader hisses. “Alive, for now,” it adds.'],
  fight:{name:'Skitterling brood',art:'Skitterling',ref:'the brood leader',pr:'it',pos:'its',hp:13,dc:11,def:0,acc:7,dmg:5,drop:'small',say:['The brood leader lunges, clicking.','“Alive for now!” the brood leader hisses.','Claws scrape your vest as the brood shrieks.','The brood leader shrieks and more claws answer from the dark.','“The Colonel wants you breathing,” the brood leader hisses.','The brood leader’s many eyes fix on you at once.'],
  envAction:{label:'Shove an ore cart into the swarm',stat:'might',dc:13,type:'damage',amount:5,text:{
   success:'You throw your weight into an ore cart and send it crashing through the brood. “Clear a path!” Ironside shouts.',
   crit:'The cart derails and tears through the swarm in one brutal pass. “Hoorah!” Brannigan calls over the comm.',
   fail:'The cart will not budge on the warped rail, and the brood is already on you. “Blast it!” Ironside grunts.',
   fumble:'The cart rolls back onto your own foot before you can get clear. “Argh!” Ironside cries.'}}},then:'ch2_lift'},
 ch2_lift:{title:'The Dead Lift',bg:'relay',text:[
  'The only way down to Hollow Station is a dead mining lift. “Power is out, Captain,” Brannigan says. “I can bridge it, but it will take a minute,” he adds.',
  'Down the shaft, something heavy is climbing. “Whatever it is, it is coming up fast,” Quill says over the comm.'],
  choices:[
   {text:'Rig the lift with Brannigan',check:{stat:'guile',dc:12},win:{msg:'The lift hums to life. Your instincts sharpen.',goto:'ch2_pit',fx:{stat:{guile:1}}},lose:{msg:'The wires spark and burn your hands. Your confidence slips.',goto:'ch2_pit',fx:{stat:{guile:-1}}}},
   {text:'Brace the lift doors by hand',check:{stat:'might',dc:13},win:{msg:'The doors groan, then hold. Your grip hardens.',goto:'ch2_pit',fx:{stat:{might:1}}},lose:{msg:'The doors slip and crush your hand. Your arm feels weaker.',goto:'ch2_pit',fx:{stat:{might:-1}}}},
   {text:'Steady your breathing and wait',check:{stat:'resolve',dc:10},win:{msg:'Your nerves settle. Your resolve hardens.',goto:'ch2_pit',fx:{stat:{resolve:1}}},lose:{msg:'The silence gnaws at you. Your nerve wavers.',goto:'ch2_pit',fx:{stat:{resolve:-1}}}}]},
 ch2_pit:{title:'The Ironback',bg:'brute',text:[
  'The lift opens on a pit where an Ironback Hullcrusher waits, its chains already broken. “Captain, it is bigger than the last one,” Brannigan says. “Then we hit it harder,” Ironside growls.',
  '“Meat!” the Ironback bellows. “Meat for the Colonel!” it adds.'],
  fight:{name:'Ironback Hullcrusher',art:'Hullcrusher',ref:'the Ironback',pr:'it',pos:'its',hp:22,dc:12,def:2,acc:8,dmg:8,drop:'big',say:['The Ironback swings a fist the size of a hatch.','“Crunch! Crunch!” the Ironback bellows.','The deck shakes under the Ironback’s tread.','The Ironback’s plating grinds as it turns.','“Meat for the Colonel!” the Ironback roars again.','The Ironback does not flinch from the blow.'],
  envAction:{label:'Wedge the broken lift chain for leverage',stat:'might',dc:13,type:'might',amount:1,text:{
   success:'You brace the broken lift chain against the wall and use it to set your stance. Your grip hardens.',
   crit:'The chain holds perfectly, and you feel the extra leverage in every swing to come. Your grip hardens further.',
   fail:'The chain gives way under your weight, and the Ironback closes in. “Blast it!” Ironside grunts.',
   fumble:'The chain snaps back and catches your arm. Your grip weakens. “Argh!” Ironside cries.'}}},then:'ch2_gate'},
 ch2_gate:{title:'The Control Hall',bg:'gate',text:[
  'Beyond the pit stands the control hall. “Colonel Vex is inside,” Quill says. “Captain, my scanners show the whole station is wired to blow,” she adds.',
  '“Then we end him quickly,” Ironside says. “Brannigan, find me that detonator,” he adds.'],
  choices:[
   {text:'Sneak through the vents',check:{stat:'guile',dc:13},win:{msg:'You drop in behind the consoles unseen. Your instincts sharpen.',goto:'ch2_boss',fx:{stat:{guile:1},flag:'stealth2'}},lose:{msg:'A grate clangs loose. Your confidence slips.',goto:'ch2_boss',fx:{stat:{guile:-1},flag:'stealth2'}}},
   {text:'Kick the door in',check:{stat:'might',dc:12},win:{msg:'The door flies off its hinges. Your grip hardens.',goto:'ch2_boss',fx:{stat:{might:1},flag:'bold2'}},lose:{msg:'The door holds and your leg buckles. Your strength wavers.',goto:'ch2_boss',fx:{stat:{might:-1},flag:'bold2'}}}]},
 ch2_boss:{title:'Colonel Vex',bg:'boss',text:s=>[
  s.flags.stealth2
   ?'Colonel Vex rises from the console, tall, green-lit and wrong, and turns a beat too late to find you already behind him. “Captain Ironside,” Colonel Vex says, a flicker of surprise in the soft voice. “You are quieter than Kraag warned me,” he adds.'
   :s.flags.bold2
   ?'Colonel Vex rises from the console, tall, green-lit and wrong, unhurried by the door crashing in. “Captain Ironside,” Colonel Vex says softly. “Kraag said you would announce yourself. I did not expect him to be right,” he adds.'
   :'Colonel Vex rises from the console, tall, green-lit and wrong. “Captain Ironside,” Colonel Vex says softly. “I have waited so long to meet you,” he adds.',
  '“You will wait forever,” Ironside says, and the station shakes. “Captain, thirty seconds,” Quill says. “Finish it,” she adds.'],
  fight:{name:'Colonel Vex',ref:'Colonel Vex',pr:'he',pos:'his',hp:34,dc:14,def:4,acc:14,dmg:10,drop:null,say:['“Kneel!” Colonel Vex snarls.','Vex’s blade carves a green scar across the deck.','“The Hollow remembers you,” Colonel Vex whispers.','Vex circles unhurried, green light trailing behind him.','“Kraag died quicker,” Colonel Vex says softly.','The air hums where Vex’s blade passes.'],
  envAction:{label:'Brace against the failing station',stat:'resolve',dc:11,type:'armor',amount:2,text:{
   success:'You plant your feet as the station shudders around you, riding out the shock instead of fighting it. “Steady, Captain,” Quill says.',
   crit:'You find your center completely, and the shaking deck barely touches you. “Rock steady,” Brannigan says, impressed.',
   fail:'The deck lurches and throws you off balance before Vex is even close. “Blast it!” Ironside grunts.',
   fumble:'You overcorrect and stumble straight into Vex’s reach. “Argh!” Ironside cries.'}}},then:'ch2_victory'},
 ch2_victory:{title:'Victory',bg:'victory',end:1,text:s=>[
  'Vex falls, and Hollow Station dies in green fire. Ironside throws himself into the lift as the moon shakes. “Captain!” Quill shouts, and Brannigan adds, “Go, go, go!”',
  'Ironside reaches the surface, scarred and alive. “One more down, comrades,” Ironside says. Quill laughs through tears. “One more, Captain,” she says.'+
   (s.flags.stealth2?' “You went through that whole station and he never saw you coming,” Brannigan says. “That is twice now,” Ironside says.'
    :s.flags.bold2?' “You keep walking straight through the front door, Captain,” Quill says. “It keeps working,” Ironside says.'
    :''),
  'Chapter 2 of the Gravefall Saga ends here, but the Colonel’s last signal points to something far older beneath the moon.']}
});

