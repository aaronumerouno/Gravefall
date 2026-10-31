/* ===== LORE: [story, how it behaves when used] per item id; STAT_INFO: stat tooltips ===== */
const LORE={
 chainblade:['Standard issue to every Ironwolf officer. The edge hums when you hold it close.','Quick and reliable. Its vibrating edge finds gaps, so it is easy to land.'],
 cleaver:['Torn off a maintenance rack in the galley. Somebody carved a name into the handle.','Light and crude. It lands often but barely scratches big targets.'],
 shiv:['A boarding knife honed to a wire edge. Fits in a boot, not a sheath.','Short and quick. It finds a gap before the enemy can react.'],
 maul:['A dockhand’s sledgehammer rewired with a shock coil. The crew called it Thunderclap.','Slow to swing, then it crushes bone and plate in one blow.'],
 spike:['A railyard spike charged with a void-black current. It hums when it is close to flesh.','Punches clean through plate instead of around it.'],
 pistol:['A cobbled-together sidearm from the ship’s small-arms locker.','Light recoil, easy to bring to bear in a hurry.'],
 plasma:['Prototype railcaster from the carrier’s weapons lab. It hums with stolen sunlight.','Fires a searing bolt that hits like a shell, but the kick makes it harder to aim.'],
 carapace:['Layered ceramic plate, scarred by a dozen landings.','Steady protection that never runs out.'],
 scrap:['Hull plating bolted over your ribs by a very nervous mechanic.','Better than nothing, and it rattles when you move.'],
 bodyMight:['Reinforced across the shoulders for throwing your full weight into a blow.','Trades coverage for leverage.'],
 bodyGuile:['Stitched with sliding plates that move the way you do.','Light enough to barely notice you are wearing it.'],
 bodyResolve:['A chest rig built to keep a soldier breathing through anything.','Steadies the nerves as much as it stops a blade.'],
 bodyMix:['A scavenger’s patchwork of plate, mesh and padding.','A bit of everything, none of it wasted.'],
 bulwark:['Cut from the blast door of the siege tank Old Bessie.','Heavy, but most blows break against it.'],
 bodyMightS:['Full war-plate built for soldiers who lead with the shoulder.','Turns every swing into a sledgehammer.'],
 bodyGuileS:['Ghost-pattern plate that drinks light instead of reflecting it.','Moves like it is barely there.'],
 bodyResolveS:['A command-rank chestpiece, rated to take a direct hit and keep its wearer upright.','Makes you very hard to put down.'],
 bodyMixS:['Veteran plate rebuilt three times over, and better for it.','Balanced in every way that matters.'],
 legplate:['Greaves stripped off a dead Rustjack and refitted in a hurry.','Covers the worst of it, though the straps never quite sit right.'],
 legsMight:['Heavy greaves built to anchor a charge.','Lets you put your whole body behind a hit.'],
 legsGuile:['Soft-soled treads that leave almost no sound.','Perfect for closing a gap unseen.'],
 legsResolve:['Braced greaves that lock your stance under fire.','Keeps you standing when the deck shakes.'],
 legsMix:['Mismatched guards salvaged from three different corpses.','Awkward to look at, useful all the same.'],
 ablative:['Overlapping ceramic tiles meant to shed a glancing hit rather than stop it cold.','Sheds most of a blow, every time, without the weight of full plate.'],
 legsMightS:['Siege-rated greaves, built to plant and swing without flinching.','Turns your footing into a weapon.'],
 legsGuileS:['Treads engineered for a ghost unit that no longer exists.','You are gone before the echo catches up.'],
 legsResolveS:['Command-grade greaves rated against anything short of a direct hit.','Nothing short of a direct hit moves you.'],
 legsMixS:['A warden’s field kit, rebuilt from three fallen soldiers’ gear.','No weakness anyone has found yet.'],
 stim:['A trooper’s trick: a cheap injector that bites like a rattlesnake.','Slammed into the thigh, it mends flesh at once and leaves your hands shaking. Used up.'],
 bandage:['A field dressing from a dead medic’s kit, torn open in a hurry.','Stops the worst of the bleeding. Used up.'],
 medikit:['Lieutenant Quill’s favorite field kit. Real surgical glue, real morphine.','Closes deep wounds fast. Used up.'],
 nanite:['A sealed canister of medical nanites, cold to the touch even through a glove.','Floods a wound and knits it shut in seconds. Used up.'],
 hiveblade:['Grown rather than forged, torn from something that does not have a name yet. It still twitches.','Closes on a target like a trap and does not let go easily.'],
 elixir:['A vial of something the hive kept at its very center, warm and faintly luminous.','Mends flesh so completely it almost feels wrong. Used up.']};
const statLine=i=>i.stat?Object.entries(i.stat).map(([k,v])=>`${LABELS[k]} ${v>=0?'+':''}${v}`).join(', '):'';
const tipText=id=>{const i=ITEMS[id],[l,u]=LORE[id]||['',''];
 const t=(i.slot==='melee'||i.slot==='gun')?`${CAT_LABEL[i.slot]}. Damage ${i.atk}, accuracy ${i.acc>=0?'+':''}${i.acc}.`
  :(i.slot==='body'||i.slot==='legs')?`${CAT_LABEL[i.slot]}. Blocks ${i.dr} damage from each hit.`+(i.stat?` Also ${statLine(i)}.`:'')
  :`Consumable. Heals ${i.heal} vitality.`;
 return `<b>${i.n}</b><br>${t}<br><em>${l}</em><br>${u}`;};
const STAT_INFO={might:'Raw strength. Used to strike, smash doors and tear through enemies. Your weapon’s accuracy adds to it.',
 guile:'Cunning and stealth. Used to hack, search and slip past danger.',
 resolve:'Nerve and endurance. Used to guard, hold the line and stay steady through pain.',
 armor:'Your Defense, from armor. It reduces every hit you take, but never below 1.',
 evasion:'Equal to your Guile. It also reduces every hit you take by this amount.',
 accuracy:'Your weapon adds this to every Might roll to hit. Heavy weapons are less accurate.',
 foeEva:'How hard this enemy is to hit. Your hit roll must reach this number.',
 foeDef:'Subtracted from every hit you land. Critical hits ignore it.',
 foeAtk:'Its damage before your Defense and Evasion reduce it.',
 foeAcc:'How hard it is to guard against. Your Guard roll must reach this number.',
 damage:'Damage your equipped weapon deals on a hit. Critical hits add it again.'};
const tipSpan=(t,h)=>`<span class="tip" tabindex="0" data-tip="${h}">${t}</span>`;
const gear=s=>({melee:ITEMS[s.eq.melee]||{atk:2,acc:0},gun:ITEMS[s.eq.gun]||null,body:ITEMS[s.eq.body]||{dr:0},legs:ITEMS[s.eq.legs]||{dr:0}});
const armorDr=s=>gear(s).body.dr+gear(s).legs.dr+((s.fight&&s.fight.envDr)||0);
const gearStatBonus=(s,stat)=>{const g=gear(s);return((g.body.stat&&g.body.stat[stat])||0)+((g.legs.stat&&g.legs.stat[stat])||0);};
const envStatBonus=(s,stat)=>(s.fight&&s.fight.envBoost&&s.fight.envBoost[stat])||0;

