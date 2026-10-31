/* ===== AUDIO: voice-over and sound effects. Flags: CONFIG.voice, CONFIG.sfx (also the buttons in the status panel) ===== */
/* VOICE: one narrator reads everything (story and results). Every spoken line carries the speaker's name in the text. Tweak pitch (lower = deeper) and rate (lower = slower). */
const NARRATOR={pitch:.8,rate:.88};
let narV=null;
const BAD=/junior|kid|child|boy|girl|novelty|whisper|bubbles|bad news|bells|boing|cellos|deranged|good news|hysterical|organ|trinoids|zarvox|albert|ralph|superstar|jester|wobble|fred/i;
function voiceFor(){if(narV)return narV;
 const all=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang)&&!BAD.test(v.name));if(!all.length)return null;
 const fem=/female|samantha|zira|susan|karen|moira|victoria|fiona|hazel|serena|tessa|catherine|libby|sonia|jenny|aria|ava|allison/i,
  us=v=>/en[-_]US/i.test(v.lang)?0:1,q=v=>/natural|neural|online|premium|enhanced|siri|google/i.test(v.name)?0:1,
  deep=v=>/guy|davis|christopher|eric|roger|aaron|alex|evan|tom|david|mark|steffan|brian|andrew|jason|male/i.test(v.name)?0:1,
  pool=all.filter(v=>!fem.test(v.name)).sort((a,b)=>us(a)-us(b)||q(a)-q(b)||deep(a)-deep(b));
 return narV=(pool[0]||all[0]);}
let VQ=[],vplay=false,vtok=0;
function vpush(it){VQ.push(it);if(!vplay)vnext();}
function vnext(){const it=VQ.shift();if(!it){vplay=false;return;}vplay=true;const tok=vtok;let fired=false;
 const done=()=>{if(fired||tok!==vtok)return;fired=true;vnext();};
 it.u.onend=done;it.u.onerror=done;setTimeout(done,it.text.length*150+2500);speechSynthesis.speak(it.u);}
function say(text){if(!CONFIG.voice||!('speechSynthesis' in window))return;
 (text.replace(/<[^>]+>/g,'').match(/[^.!?]+[.!?]*/g)||[]).filter(c=>/\w/.test(c)).forEach(c=>{
  const ex=/!\s*$/.test(c),qu=/\?\s*$/.test(c),el=/\.\.\.|\u2026/.test(c),u=new SpeechSynthesisUtterance(c.trim());
  u.pitch=NARRATOR.pitch*(ex||qu?1.03:1);u.rate=NARRATOR.rate*(ex?1.02:el?.9:1);u.volume=ex?1:.92;
  const vo=voiceFor();if(vo)u.voice=vo;vpush({u,text:c});});}
const stopVoice=()=>{vtok++;VQ=[];vplay=false;if('speechSynthesis' in window)speechSynthesis.cancel();};
const speakLine=t=>say(t||'');
const narrate=id=>{const sc=SCENES[id],text=typeof sc.text==='function'?sc.text(state):sc.text;text.forEach(p=>speakLine(p));};
/* SFX: synthesized with Web Audio, no files. Add an entry, then call sfx('name') anywhere, or set sfx:'name' on a scene choice. */
let AC=null;
function ac(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();}if(AC.state==='suspended')AC.resume();return AC;}
function tone(f,d,type='sine',vol=.2,t0=0,f2){const a=ac();if(!a)return;const o=a.createOscillator(),g=a.createGain(),t=a.currentTime+t0;o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d);}
function noise(d,f0,f1,vol=.3,t0=0,type='lowpass'){const a=ac();if(!a)return;const n=Math.floor(a.sampleRate*d),b=a.createBuffer(1,n,a.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;
 const s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain(),t=a.currentTime+t0;s.buffer=b;fl.type=type;fl.frequency.setValueAtTime(f0,t);fl.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);s.connect(fl).connect(g).connect(a.destination);s.start(t);}
const SFX={
 slash:()=>{noise(.18,6000,800,.35,0,'highpass');tone(180,.12,'sawtooth',.1,.02,60);},
 shoot:()=>{tone(1200,.28,'sawtooth',.18,0,120);noise(.15,4000,600,.15,0,'bandpass');},
 explosion:()=>{noise(1.1,1800,40,.7);tone(90,.9,'sine',.5,0,30);},
 smash:()=>{noise(.4,1200,80,.5);tone(120,.3,'square',.2,0,40);},
 hit:()=>{tone(140,.2,'sine',.4,0,50);noise(.12,900,200,.3);},
 clang:()=>{tone(880,.25,'triangle',.2);tone(1320,.2,'triangle',.12,.01);},
 pickup:()=>{tone(520,.1,'square',.1);tone(780,.14,'square',.1,.09);},
 equip:()=>{tone(300,.06,'square',.12);tone(600,.08,'triangle',.12,.07);noise(.05,5000,3000,.15,.07,'highpass');},
 drop:()=>{tone(110,.15,'sine',.3,0,60);},
 heal:()=>{[440,554,659].forEach((f,i)=>tone(f,.25,'sine',.12,i*.09));},
 click:()=>{noise(.03,4000,2000,.2,0,'highpass');noise(.03,4000,2000,.2,.08,'highpass');},
 chime:()=>{tone(660,.4,'sine',.15);tone(990,.5,'sine',.1,.05);},
 roll:()=>{for(let i=0;i<7;i++)noise(.025,3000,1500,.15,i*.11,'highpass');},
 crit:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.18,'triangle',.15,i*.07));},
 fumble:()=>{tone(150,.4,'sawtooth',.2,0,60);},
 death:()=>{tone(220,1.4,'sawtooth',.25,0,40);noise(1,800,60,.3);},
 victory:()=>{SFX.explosion();[392,523,659,784].forEach((f,i)=>tone(f,.4,'triangle',.15,.9+i*.18));}
};
const sfx=n=>{if(CONFIG.sfx&&SFX[n])try{SFX[n]();}catch(e){}};


function actSfx(kind,r){const ranged=kind==='aim';
 sfx(kind==='guard'?(r.pass?'clang':'hit'):r.pass?(kind==='wild'?(ranged?'explosion':'smash'):ranged?'shoot':'slash'):'hit');}
function renderOpts(){$('vtog').textContent='Voice: '+(CONFIG.voice?'On':'Off');$('stog').textContent='Effects: '+(CONFIG.sfx?'On':'Off');}
$('vtog').onclick=()=>{CONFIG.voice=!CONFIG.voice;renderOpts();if(CONFIG.voice)narrate(state.scene);else stopVoice();};
$('stog').onclick=()=>{CONFIG.sfx=!CONFIG.sfx;renderOpts();sfx('equip');};
$('vrep').onclick=()=>{stopVoice();narrate(state.scene);};
$('nsave').onclick=()=>{if(!confirm('Erase your saved progress in every chapter and start over?'))return;clearSave();for(const k in SAVES)delete SAVES[k];newGame(1);buildChapters();};
renderOpts();
