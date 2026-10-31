/* ===== TOOLTIPS: any element with data-tip. Hover on monitors, tap to open and tap again to close on touch ===== */
const tipEl=document.createElement('div');tipEl.id='tip';document.body.append(tipEl);
let tipOn=null;const canHover=()=>matchMedia('(hover:hover)').matches;
function showTip(el){tipOn=el;tipEl.innerHTML=el.dataset.tip;tipEl.style.display='block';
 const r=el.getBoundingClientRect(),w=tipEl.offsetWidth,h=tipEl.offsetHeight;
 tipEl.style.left=Math.max(8,Math.min(innerWidth-w-8,r.left))+'px';
 tipEl.style.top=(r.bottom+h+12>innerHeight?Math.max(8,r.top-h-8):r.bottom+8)+'px';}
function hideTip(){tipOn=null;tipEl.style.display='none';}
document.addEventListener('click',e=>{if(canHover())return;const el=e.target.closest('[data-tip]');if(!el||el===tipOn)hideTip();else showTip(el);});
document.addEventListener('mouseover',e=>{const el=canHover()&&e.target.closest('[data-tip]');if(el&&el!==tipOn)showTip(el);});
document.addEventListener('mouseout',e=>{if(canHover()&&e.target.closest('[data-tip]'))hideTip();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();});
addEventListener('scroll',hideTip,{passive:true});
/* ===== DEVICE DETECTION: touch or narrow screen = mobile, otherwise desktop ===== */
const mqNarrow=matchMedia('(max-width:820px)'),mqTouch=matchMedia('(hover:none) and (pointer:coarse)');
function detectDevice(){const d=mqTouch.matches||mqNarrow.matches?'mobile':'desktop',h=document.documentElement;
 if(h.dataset.device!==d){h.dataset.device=d;$('packbox').open=$('histbox').open=$('actbox').open=d==='desktop';}}
detectDevice();mqNarrow.addEventListener('change',detectDevice);mqTouch.addEventListener('change',detectDevice);
drawBg();addEventListener('resize',drawBg);drawPortrait();
if(loadSave())show();else newGame();
buildChapters();
