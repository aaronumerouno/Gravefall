/* ===== ART: pixel art. Scenes are drawn on a 160x75 canvas (BG[sceneId]). Sprites are letter grids (SP, SPF) colored by PAL, one letter per pixel; mirror:1 means the grid is the left half. Add one BG per scene and one SPF per enemy. ===== */
const PAL={k:'#0a0b0e',d:'#1b1f26',s:'#3a4048',m:'#5b636e',l:'#8f8b80',b:'#b08d4a',r:'#a8352b',o:'#e0792b',y:'#ffd9a0',g:'#7d9a5a',t:'#caa98c',T:'#c19a7b',h:'#3b2a22',n:'#4a5330',N:'#6b7a42',w:'#d9d2c0'};
let X;
const fr=(a,b,w,h,c)=>{X.fillStyle=c;X.fillRect(a,b,w,h);};
const disc=(cx,cy,r,c)=>{X.fillStyle=c;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)X.fillRect(cx+x,cy+y,1,1);};
const glow=(cx,cy,r,c)=>{X.globalAlpha=.12;for(let i=r;i>0;i-=3)disc(cx,cy,i,c);X.globalAlpha=1;};
const stars=(n,seed,w=160,h=45,c='#d9d2c0')=>{let v=seed;for(let i=0;i<n;i++){v=(v*9301+49297)%233280;const a=v/233280;v=(v*9301+49297)%233280;const b=v/233280;X.globalAlpha=.3+b*.7;fr(a*w|0,b*h|0,1,1,c);}X.globalAlpha=1;};
const hall=back=>{fr(0,0,160,75,'#0e1014');for(let y=0;y<75;y++){const xl=y<27?Math.floor(50*y/27):y<47?50:Math.floor(50*(74-y)/27);fr(0,y,xl,1,'#262c35');fr(160-xl,y,xl,1,'#262c35');fr(xl,y,160-2*xl,1,y<27?'#1b1f26':y<47?back:'#15181d');}};
const gantry=()=>{fr(0,0,160,75,'#0e1014');fr(0,40,160,35,'#2a1210');X.globalAlpha=.5;fr(0,52,160,23,'#a8352b');X.globalAlpha=1;fr(0,37,160,2,'#3a4048');fr(0,41,160,1,'#3a4048');
 [15,50,85,120,150].forEach(x=>fr(x,22,2,16,'#3a4048'));fr(62,28,4,9,'#0a0b0e');disc(64,26,2,'#0a0b0e');fr(100,26,4,11,'#0a0b0e');disc(102,24,2,'#0a0b0e');fr(104,26,8,1,'#a8352b');};
const BG={
 intro:()=>{fr(0,0,160,75,'#08090c');stars(40,7);disc(125,48,28,'#262a31');disc(115,40,3,'#1d2025');disc(135,54,5,'#1d2025');
  for(let x=0;x<160;x++){const h=Math.floor(50+8*Math.sin(x/17)+x/12);fr(x,h,1,75-h,'#1b1f26');fr(x,h+9,1,75-h-9,'#12151a');}
  fr(62,48,15,11,'#3a4048');fr(66,50,8,9,'#0e1014');fr(70,54,1,1,'#a8352b');glow(30,47,16,'#e0792b');},
 c1:()=>{hall('#1a1214');glow(80,15,24,'#a8352b');fr(79,14,3,2,'#a8352b');fr(58,28,10,2,'#0e1014');fr(62,30,1,9,'#7d9a5a');fr(98,30,1,12,'#7d9a5a');},
 relay:()=>{hall('#13161b');disc(80,37,9,'#b08d4a');disc(80,37,7,'#3a4048');disc(80,37,4,'#14161a');fr(79,10,3,2,'#b08d4a');glow(80,10,20,'#b08d4a');},
 brute:()=>{hall('#1a1214');glow(80,12,28,'#a8352b');for(let y=28;y<42;y+=2){fr(59,y,1,1,'#8f8b80');fr(101,y,1,1,'#8f8b80');}},
 medbay:()=>{hall('#10161a');fr(57,40,15,5,'#262c35');fr(88,40,15,5,'#262c35');fr(76,33,8,2,'#7d9a5a');fr(79,30,2,8,'#7d9a5a');glow(80,33,18,'#7d9a5a');},
 ambush:gantry,gunner:gantry,
 armory:()=>{fr(0,0,160,75,'#0e1014');fr(0,60,160,15,'#12151a');fr(10,42,62,15,'#1b1f26');fr(24,34,30,9,'#262c35');fr(50,37,32,2,'#262c35');
  [20,36,52,68].forEach(x=>{disc(x,59,4,'#3a4048');disc(x,59,2,'#0e1014');});fr(112,28,17,32,'#262c35');fr(120,31,2,2,'#7d9a5a');glow(121,32,14,'#7d9a5a');},
 gate:()=>{hall('#2b1a12');fr(74,27,12,20,'#e0792b');glow(80,37,32,'#e0792b');},
 boss:()=>{fr(0,0,160,75,'#0e1014');fr(0,59,160,16,'#15181d');fr(0,15,50,3,'#262c35');fr(110,15,50,3,'#262c35');fr(0,23,45,3,'#262c35');fr(115,23,45,3,'#262c35');
  glow(80,32,40,'#e0792b');disc(80,32,16,'#6b4a2a');disc(80,32,13,'#e0792b');disc(80,32,6,'#ffd9a0');},
 victory:()=>{fr(0,0,160,75,'#08090c');stars(25,11);glow(65,37,50,'#ffd9a0');disc(65,37,11,'#fff4dc');fr(108,50,22,6,'#0a0b0e');fr(120,48,8,2,'#0a0b0e');fr(128,51,6,3,'#b08d4a');},
 dead:()=>{fr(0,0,160,75,'#08090c');stars(20,5);glow(80,57,20,'#a8352b');fr(62,30,36,28,'#15181d');fr(66,36,28,1,'#3a4048');fr(66,42,28,1,'#3a4048');fr(66,48,18,1,'#3a4048');}
};
const SP={
 hero:['.....ssss.......','....smmmms......','....smbbbs......','....smmmms......','.....sttss......','..ssmmmmmmss...w','.ssmmmmmmmmss.wl','.smmddddddmmswl.','.smmddbbddmmsl..','.smmddddddmmsl..','.smmmddddmmmsl..','..ssmmmmmmss....','..ssdkkkkdss....','...sdddddds.....','...smm..mms.....','...smm..mms.....','...sdd..dds.....','...sdd..dds.....','..ssdd..ddss....','..sskk..kkss....'],
 quill:['sssssss','sddhhhh','sdhhhhh','sdhhhtt','sdhhttt','sdbtktt','sdbtttt','sdhtttt','sdddtrr','sddnnnn','sdnnnnn','sdnnnnn','sdnnnnn','sssssss'],
 bran:['sssssss','sddNNNN','sdNNNNN','sdnnnnn','sdnTTTT','sdnTkTT','sdnTTTT','sdnThhh','sddThhh','sddnnnn','sdnnnnn','sdnnnnn','sdnnnnn','sssssss']
};
const HC_T=['kkddmmddddmm','kddmmddddmmd','kddmddrrddmd','kddmmddddmmd'],HC_L=['..kdddd.....','..kdddd.....'];
const KG_T=['.ksddmmddd','.ksddmmodd','.ksddmmddd','.kkddddddd'],KG_L=['..kdddsddd','..kddddddd'];
const SPF={
 'Skitterling':{rows:['.....g......','......g.....','......kkkkkk','.....kdddddd','....kddrdddd','...kdddddddd','g..kddsddddd','.g.gkkdddddd','g..g.kkkkkkk','g..g..g.....'],o:{mirror:1,scale:1.5}},
 'Hullcrusher':{rows:['....kkkkkkkk','...kdddddddd','...kddoddddd','...kddssssss','.kkkkkkddddd',...HC_T,...HC_T,'kkdddddddddd','.kkddddddddd','..kdddssdddd','..kdddddkkkk',...HC_L,...HC_L,'..kmmmm.....','.kkkkkk.....'],o:{mirror:1,scale:1.5}},
 'Rustjack gunner':{rows:SP.hero,o:{flip:1,pal:{s:'#6b2a22',m:'#4a2420',b:'#d9533f',d:'#1f1210',w:'#a8352b',l:'#a8352b'}}},
 'Major Kraag':{rows:['..o.......','..oo......','...okkkkkk','....kddddd','....kdoddd','....kddddd','..kkkkddss','.kssdddddd',...KG_T,...KG_T,'..kdddsddd','..kddddddd','..kddsdddd','..kddd....',...KG_L,...KG_L,'..kddd....','..kkkk....'],o:{mirror:1,scale:1.5}}
};
SPF['Colonel Vex']={rows:SPF['Major Kraag'].rows,o:{...SPF['Major Kraag'].o,pal:{o:'#7d9a5a',s:'#2f4a2a'}}};
SPF['Hive Stalker']={rows:SPF['Skitterling'].rows,o:{...SPF['Skitterling'].o,pal:{g:'#7a4fa0'}}};
SPF['Hive Warden']={rows:SPF['Hullcrusher'].rows,o:{...SPF['Hullcrusher'].o,pal:{o:'#9b6fb0',s:'#342440'}}};
SPF['The Hive Sovereign']={rows:SPF['Major Kraag'].rows,o:{...SPF['Major Kraag'].o,pal:{o:'#c08fe0',s:'#241a30'}}};
function sprite(id,rows,o){o=o||{};const R=o.mirror?rows.map(r=>r+[...r].reverse().join('')):rows,w=Math.max(...R.map(r=>r.length)),c=$(id),P={...PAL,...(o.pal||{})};
 c.width=w;c.height=R.length;const x=c.getContext('2d');
 R.forEach((r,y)=>[...r].forEach((ch,i)=>{if(ch!=='.'&&P[ch]){x.fillStyle=P[ch];x.fillRect(o.flip?w-1-i:i,y,1,1);}}));c.style.width=(w/160*100*(o.scale||1))+'%';}
const pos=(i,o)=>Object.assign($(i).style,o);
function renderArt(){const id=state.scene,f=state.fight,fs=f&&SPF[f.art||f.name];
 $('art').innerHTML='<canvas id="abg" width="160" height="75"></canvas>'+['ahero','afoe','aq','ab'].map(i=>`<canvas id="${i}"></canvas>`).join('');
 X=$('abg').getContext('2d');(BG[SCENES[id].bg||id]||BG.gate)();
 if(id==='dead')$('ahero').remove();else{sprite('ahero',SP.hero);pos('ahero',{left:'8%',bottom:'9%'});}
 if(fs){sprite('afoe',fs.rows,fs.o);$('afoe').className='foefig';pos('afoe',{right:'8%',bottom:'9%'});}else $('afoe').remove();
 sprite('aq',SP.quill,{mirror:1});pos('aq',{left:'2%',top:'4%'});sprite('ab',SP.bran,{mirror:1});pos('ab',{left:'12%',top:'4%'});}
function flashFoe(kind,r){const el=$('afoe');if(el&&r.pass&&kind!=='guard'){el.classList.remove('hit');void el.offsetWidth;el.classList.add('hit');}}
const PF=['....ssssssss','..ssmmmmmmmm','.ssmmmbbbbbb','.smmmmbbbbbb','.smmmmmmmmmm','.smddddddddd','.smhhhhhhhhh','.smTkkTTTTTT','.smTTTTTTTTT','.smTTTTTTThh','.smTTTTTTThh','.smTTTTTTTTT','.smThhhhhhhh','.smThhhhhhhh','..sThhhwwwww','..sThhhhhhhh','..sdhhhhhhhh','..ssdhhhhhhh','.ssmmdddddddd','ssmmmmddddbb','smmmmmmdddbb','smmmmmmmdddd'];
function drawPortrait(){const c=$('pf');sprite('pf',PF,{mirror:1});c.style.width='';const x=c.getContext('2d');
 [[18,7,'#d9533f'],[19,7,'#ffd9a0'],[20,6,'#c96a5a'],[19,6,'#c96a5a'],[18,8,'#c96a5a'],[18,9,'#c96a5a'],[17,10,'#c96a5a']].forEach(([a,b,col])=>{x.fillStyle=col;x.fillRect(a,b,1,1);});}
const mqDark=matchMedia('(prefers-color-scheme:dark)');
function drawBg(){const c=$('bgart'),w=Math.ceil(innerWidth/5),h=Math.ceil(innerHeight/5);c.width=w;c.height=h;X=c.getContext('2d');
 const dark=document.documentElement.dataset.theme!=='light'&&(document.documentElement.dataset.theme==='dark'||mqDark.matches);
 stars(Math.floor(w*h/90),3,w,h,dark?'#d9d2c0':'#555248');disc(w-16,14,8,dark?'#2a2d33':'#9b9580');disc(w-19,12,2,dark?'#22252b':'#7a5c1f');}

