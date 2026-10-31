/* ===== SCENES: story is data. choice={text,goto,fx} or {text,check:{stat,dc},win:{msg,goto,fx},lose:{...}}
   fight scenes: fight:{name,hp,dc,dmg,drop:'small'|'big'|null,say:[taunts]}, then:'nextScene' ===== */
const SCENES={
 alloc:{title:'Choose Your Soldier',text:[
  'Before the airlock cycles, Captain Ironside checks his gear one last time. Every soldier fights differently: some lead with muscle, some with cunning, some with nerve. Spend your points, Captain — how do you fight?'],choices:[]},
 loadout:{title:'Opening Kit',text:[
  'Quartermaster’s last call before the drop. “One weapon up front, Captain, the other you will have to find,” Brannigan says. “And pick an armor that matches how you fight,” he adds.'],choices:[]},
 intro:{title:'The Breach',text:[
  'The carrier <em>Gravefall</em> drifts above a dead moon, her reactor screaming toward meltdown. Ironwolf Company’s Third Platoon died on the approach. Captain Ironside alone reached the airlock. “Captain Ironside, report,” Lieutenant Quill says over the comm from the gunship <em>Wrenhawk</em>. “Still breathing, Lieutenant,” Ironside growls. “Tell Corporal Brannigan to start the clock,” he adds.',
  '“Eleven minutes to core breach, Captain,” Corporal Brannigan says, his gravel voice cutting in. “The airlock is welded shut, and something on the other side is scratching to get out,” he adds.'],
  choices:[
   {text:'Smash through the bulkhead',check:{stat:'might',dc:14},win:{msg:'Steel buckles and the door falls inward.',goto:'c1',fx:{flag:'forced_entry'}},lose:{msg:'The door holds. Your shoulder does not.',goto:'c1',fx:{hp:-4,flag:'forced_entry'}}},
   {text:'Wait for Brannigan to crack the lock',check:{stat:'resolve',dc:11},win:{msg:'The lock clicks open. Brannigan grunts, pleased.',goto:'c1',fx:{flag:'picked_lock'}},lose:{msg:'The lock fires a shock into your gauntlet before it opens.',goto:'c1',fx:{hp:-3,flag:'picked_lock'}}}]},
 c1:{title:'The Scraping Dark',text:s=>[
  (s.flags.forced_entry
   ?'The corridor beyond is slick with black ichor, and the bang of the bulkhead has already woken something. Skitterlings pour from the ceiling vents, all legs and wet clicking. “Contact!” Ironside roars, and Quill answers, “They heard that, Captain — give them hell.”'
   :'The corridor beyond is slick with black ichor. Skitterlings pour from the ceiling vents, all legs and wet clicking. “Contact!” Ironside roars, and Quill answers, “Give them hell, Captain.”'),
  '“Captain, suit sensors make these things Skitterlings — bred stock, not sentient on their own,” Brannigan says, reading off a scrolling report between bursts of static. “Fleet intel says the swarms answer to humanoid commanders, armored things like Major Kraag. Whatever hive spawned them, our charts call it Gravemoor, out past the Rim,” he adds. “Doesn’t matter today,” Ironside growls. “Today they are just in our way.”',
  'The lead skitterling rears up. “Fresh meat,” the skitterling hisses in a stolen human voice. “Major Kraag will wear your dog tags,” it adds.'],
  fight:{name:'Skitterling',ref:'the skitterling',pr:'it',pos:'its',hp:9,dc:10,def:0,acc:6,dmg:4,drop:'small',say:['The skitterling lunges, clicking.','“Dog tags! Dog tags!” the skitterling hisses.','Claws scrape your vest as the skitterling shrieks.','The skitterling circles, legs clicking against the deck.','“Major Kraag feeds well tonight,” the skitterling hisses.','The skitterling’s jaw opens wider than it should.'],
  envAction:{label:'Rupture the steam pipe',stat:'might',dc:13,type:'damage',amount:4,text:{
   success:'You wrench the valve open and scalding steam engulfs {foe}. “Eat that!” Ironside snarls.',
   crit:'The pipe bursts all at once, and the blast cooks {foe} where it stands. “Burn!” Ironside roars.',
   fail:'The valve will not budge, and {foe} closes the gap before you can try again. “Blast it!” Ironside grunts.',
   fumble:'The pipe bursts in your hands instead, and scalding steam catches you. “Argh!” Ironside cries.'}}},then:'relay'},
 relay:{title:'The Dead Relay',text:[
  '“Door ahead is a blast seal,” Brannigan says. “Reactor control is on the other side. I can crack it, comrade, but I need you to hold still and keep the vermin off my line,” he adds.',
  'Ironside presses his palm to the cold metal. Somewhere behind it, a heavy body shifts. “Corporal,” Ironside mutters, “tell me that is just the pipes.” Static. “Brannigan?” Ironside calls.'],
  choices:[
   {text:'Cover Brannigan’s hack and wait it out',check:{stat:'resolve',dc:11},win:{msg:'The seal grinds open on a clear path.',goto:'brute'},lose:{msg:'Something slams the door from the far side. You take the blast.',goto:'brute',fx:{hp:-4}}},
   {text:'Hack the console yourself',check:{stat:'guile',dc:12},win:{msg:'Sparks, a hiss, and the seal opens.',goto:'brute'},lose:{msg:'The console arcs through your gauntlet.',goto:'brute',fx:{hp:-5}}},
   {text:'Rip the seal off its hinges',check:{stat:'might',dc:14},win:{msg:'Metal shrieks and gives way.',goto:'brute'},lose:{msg:'You tear something in your back.',goto:'brute',fx:{hp:-6}}}]},
 brute:{title:'The Hullcrusher',text:[
  'The seal opens on a Hullcrusher, a mountain of fused muscle and welded plating, chained to the wall by its own hunger. It snaps the chains as Ironside steps inside. “Lieutenant, tell me you see this,” Ironside says. “I see it,” Quill answers. “Pray it bleeds,” she adds.',
  '“Little soldier!” the Hullcrusher bellows. “I have eaten better than you!” it adds.'],
  fight:{name:'Hullcrusher',ref:'the Hullcrusher',pr:'it',pos:'its',hp:16,dc:12,def:1,acc:8,dmg:7,drop:'big',say:['The Hullcrusher swings a fist the size of a hatch.','“Crunch! Crunch!” the Hullcrusher bellows.','The deck shakes under the Hullcrusher’s tread.','The Hullcrusher’s chains rattle as it advances.','“More!” the Hullcrusher roars, spitting rust and blood.','The Hullcrusher plants its feet and does not yield ground.'],
  envAction:{label:'Loop the broken chain as a guard',stat:'guile',dc:12,type:'armor',amount:2,text:{
   success:'You wrap the Hullcrusher’s own broken chain across your arm as a makeshift guard. “Smart,” Quill says over the comm.',
   crit:'The chain locks into place perfectly, turning your whole forearm into a shield. “Better than issue gear,” Brannigan mutters.',
   fail:'The chain slips through your fingers before you can set it. “Blast it!” Ironside grunts as the Hullcrusher closes in.',
   fumble:'The chain tangles around your own legs instead, and you stumble. “Argh!” Ironside cries.'}}},then:'medbay'},
 medbay:{title:'The Silent Infirmary',text:[
  'Ironside staggers into a ruined infirmary and drops to one knee. “Captain, you are bleeding through your vest,” Quill says softly. “There are supplies in the lockers, if the dead left any. Choose fast,” she adds.',
  '“We have time,” Ironside says, and Brannigan mutters, “Seven minutes, comrade. Not quite.”'],
  choices:[
   {text:'Patch yourself up properly',check:{stat:'resolve',dc:9},win:{msg:'Your hands stay steady. The wounds close.',goto:'ambush',fx:{hp:10}},lose:{msg:'Pain blurs your vision, but you get the worst of it sealed.',goto:'ambush',fx:{hp:3}}},
   {text:'Search the lockers for supplies',check:{stat:'guile',dc:12},win:{msg:'Something useful at the back of a locker.',goto:'ambush',fx:{give:'small'}},lose:{msg:'A trap lashes out of the dark.',goto:'ambush',fx:{hp:-3}}},
   {text:'Press on, no time to waste',goto:'ambush'}]},
 ambush:{title:'The Gunnery Deck',text:[
  'A long gantry stretches over the gunnery deck, and the bodies of the dead crew line the rails. Then one of them lifts a rifle. “Contact, high!” Ironside shouts. A Rustjack gunner steps out of the dark, weapon already smoking. “For Major Kraag,” the gunner says. “For the Major,” it repeats.',
  '“Captain, there are more of them than I can count,” Brannigan says, his voice crackling.'],
  choices:[
   {text:'Take cover and fire back',check:{stat:'resolve',dc:11},win:{msg:'You hold your nerve and the volley goes wide.',goto:'gunner'},lose:{msg:'Rounds chew through your cover.',goto:'gunner',fx:{hp:-5}}},
   {text:'Charge across the gantry',check:{stat:'might',dc:14},win:{msg:'You barrel through the fire and slam into them.',goto:'gunner'},lose:{msg:'A round finds the gap in your armor.',goto:'gunner',fx:{hp:-7}}}]},
 gunner:{title:'Rustjack Gunner',text:[
  'The gunner drops its rifle and draws a serrated blade. “You should have stayed dead,” the gunner rasps. Quill is praying softly over the comm.'],
  fight:{name:'Rustjack gunner',ref:'the Rustjack gunner',pr:'it',pos:'its',hp:11,dc:11,def:1,acc:7,dmg:5,drop:'small',say:['A wet laugh rattles from the gunner’s chest.','“The Major sees you,” the gunner rasps.','The gunner’s blade scrapes your vest.','The gunner reloads a blade it does not need.','“Kraag remembers every face,” the gunner rasps.','The gunner spits something black onto the deck.'],
  envAction:{label:'Patch up behind the dead crew’s cover',stat:'resolve',dc:10,type:'heal',amount:6,text:{
   success:'You duck behind a fallen crewman’s gear and bind the worst of your wounds. “Stay with me, Captain,” Quill says, relieved.',
   crit:'Your hands are steady, and the wound closes clean. “That will hold,” Ironside mutters.',
   fail:'There is no time to finish before {foe} is on you again. “No time,” Ironside hisses.',
   fumble:'You jostle the wound trying to bind it, and it opens wider. “Argh!” Ironside cries.'}}},then:'armory'},
 armory:{title:'The Dead Armory',text:[
  'Past the gunnery deck, a hangar holds the gutted siege tank <em>Old Bessie</em> and a sealed locker with a green light still burning. “Fleet reserve stores,” Brannigan says. “That is a Sunspear Lancer, Captain. Unstable, hungry, but it puts anything down. There is also a Lazarus kit beside it,” he adds.',
  'Ironside cannot carry both. “Choose,” Quill says. “And hurry,” she adds.'],
  choices:[{text:'Take the Sunspear Lancer',goto:'gate',fx:{give:'plasma',flag:'took_lancer'}},{text:'Take the Lazarus trauma kit',goto:'gate',fx:{give:'medikit',flag:'took_kit'}}]},
 gate:{title:'The Reactor Gate',text:[
  'The corridor ends at the reactor gate. “I smell a soldier,” Major Kraag calls through the door, his voice like grinding iron. “Come in, little one. I have been waiting since your ship was a speck in my sky,” he adds.',
  '“That is him,” Brannigan says quietly. “Major Kraag. He will kill you, Captain,” he adds. “Then he will have to try,” Ironside says, checking his blade.'],
  choices:[
   {text:'Slip in through the side vent',check:{stat:'guile',dc:13},win:{msg:'You drop behind him unseen. Your instincts sharpen.',goto:'boss',fx:{stat:{guile:1},flag:'stealth'}},lose:{msg:'The vent rattles. He turns, grinning, and your confidence slips.',goto:'boss',fx:{stat:{guile:-1},flag:'stealth'}}},
   {text:'Walk in and announce yourself',check:{stat:'resolve',dc:10},win:{msg:'Your voice does not shake. He pauses, almost impressed. Your resolve hardens.',goto:'boss',fx:{stat:{resolve:1},flag:'bold'}},lose:{msg:'A flicker of fear crosses your face. He notices, and your nerve wavers.',goto:'boss',fx:{stat:{resolve:-1},flag:'bold'}}}]},
 boss:{title:'Major Kraag',text:s=>[
  s.flags.stealth
   ?'Major Kraag stands before the screaming reactor, three meters of scarred iron and borrowed flesh, head cocked at a sound he cannot place. “Something is wrong,” he mutters, and then he finds you with his eyes. “There you are, little ghost,” Major Kraag snarls. “Clever. It will not save you,” he adds.'
   :s.flags.bold
   ?'Major Kraag stands before the screaming reactor, three meters of scarred iron and borrowed flesh. He already turned at the sound of your voice at the gate. “No ghost, then. A soldier who walks in the front door,” Major Kraag says, almost admiring. “I will enjoy this,” he adds.'
   :'Major Kraag stands before the screaming reactor, three meters of scarred iron and borrowed flesh. He raises a blade as long as Ironside is tall. “Your platoon died begging, Captain,” Major Kraag snarls. “Will you?” he adds.',
  '“Not today,” Ironside says, and Quill’s voice breaks. “Captain, the core has ninety seconds. Finish this,” she says.'],
  fight:{name:'Major Kraag',ref:'Major Kraag',pr:'he',pos:'his',hp:26,dc:13,def:5,acc:13,dmg:11,drop:null,say:['“Die loudly!” Major Kraag snarls.','Kraag’s blade splits the deck beside you.','“I will wear your armor,” Major Kraag growls.','Kraag laughs, a sound like grinding iron.','“Your platoon screamed louder,” Major Kraag says.','The deck buckles under Kraag’s advance.'],
  envAction:{label:'Vent scalding coolant across the hall',stat:'guile',dc:14,type:'damage',amount:6,text:{
   success:'You hit the emergency vent and scalding coolant sweeps across Major Kraag. “Choke on it!” Ironside shouts.',
   crit:'The vent blows wide open, and the full blast catches Kraag head-on. “That had to hurt!” Brannigan calls.',
   fail:'The valve is rusted shut, and Kraag is already closing the distance. “Blast it!” Ironside snarls.',
   fumble:'The vent blows back toward you instead, and the scalding coolant catches your own arm. “Argh!” Ironside cries.'}}},then:'victory'},
 victory:{title:'Victory',end:1,text:s=>[
  'Kraag falls, and the reactor’s scream breaks into silence. Ironside slams the override and brings the core down by hand, one shaking breath at a time. “Core stable,” Brannigan reports, disbelief in his voice. “Gravefall is not going anywhere today, Captain.”',
  'The <em>Wrenhawk</em> docks at Gravefall’s forward bay, clamps locking home with a shudder Ironside feels through the deck. Quill and Brannigan cross over and find him still standing in the reactor hall. “We held her,” Ironside says. Quill laughs through tears. “You held her, Captain. All of her,” she says.'+
   (s.flags.stealth?' “Still can’t believe he never heard you coming,” Brannigan says. “I will take it,” Ironside says.'
    :s.flags.bold?' “You walked right up to him, Captain,” Quill says, half scolding, half in awe. “Worked, didn’t it,” Ironside says.'
    :'')+
   (s.flags.took_lancer?' The Lancer still hums warm in Ironside’s grip. “Good shooting,” Brannigan says.'
    :s.flags.took_kit?' Quill checks the Trauma Kit in Ironside’s pack, relieved it is still there. “Keep that close, Captain,” she says.'
    :''),
  'They share what little the galley still has — cold rations and a toast to Third Platoon — before the comm crackles with new orders. “Colonel Vex is still out there, on the dead moon,” Brannigan says. “Then we are not done,” Ironside says, already moving for the Wrenhawk.',
  'Chapter 1 of the Gravefall Saga ends here, but the war for the dead moon has only begun.']},
 dead:{title:'Fallen',end:1,text:[
  'The dark takes Ironside. Quill’s voice fades to static, and Brannigan says only, “Goodbye, Captain.” Ironside’s name joins the long list on the memorial wall of Ironwolf Company.']}
};

