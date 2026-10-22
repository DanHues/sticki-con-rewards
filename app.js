'use strict';
const CAMPAIGN = 'sticki-comic-con-2026-v1';
const platforms = [
  {id:'youtube', name:'YouTube', icon:'<path d="M23 7s-.2-1.6-.9-2.3C21.2 3.8 20.2 3.8 19.7 3.7 16.4 3.5 12 3.5 12 3.5s-4.4 0-7.7.2c-.5.1-1.5.1-2.4 1C1.2 5.4 1 7 1 7s-.3 1.9-.3 3.8v1.8C.7 14.5 1 16.4 1 16.4s.2 1.6.9 2.3c.9.9 2.1.9 2.7 1 2 .2 7.4.2 7.4.2s4.4 0 7.7-.3c.5 0 1.5 0 2.4-.9.7-.7.9-2.3.9-2.3s.3-1.9.3-3.8v-1.8C23.3 8.9 23 7 23 7ZM9.7 15.1V8.4l6.4 3.4-6.4 3.3Z"/>'},
  {id:'instagram',name:'Instagram',icon:'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>'},
  {id:'tiktok',name:'TikTok',icon:'<path d="M16 2c.4 2.5 1.8 4 4 4.3v3.5a9 9 0 0 1-4-1.2V16a6 6 0 1 1-5-5.9v3.6a2.5 2.5 0 1 0 1.5 2.3V2Z"/>'}
];
const groups = [{id:'rolls',handle:'stickirolls',youtube:'StickiRolls'},{id:'crew',handle:'stickicrew',youtube:'stickicrew'}];
const ids = groups.flatMap(group => platforms.map(platform => `${group.id}-${platform.id}`));
let visited = new Set();
function readProgress(){try{const data=JSON.parse(localStorage.getItem(CAMPAIGN)||'[]');return new Set(Array.isArray(data)?data.filter(id=>ids.includes(id)):[])}catch{return new Set()}}
visited=readProgress();
try{localStorage.setItem(CAMPAIGN,JSON.stringify([...visited]));}catch{document.getElementById('storage-note').hidden=false;}
for(const group of groups){
  for(const platform of platforms){
    const id=`${group.id}-${platform.id}`;
    const url=platform.id==='youtube'?`https://www.youtube.com/@${group.youtube}`:platform.id==='instagram'?`https://www.instagram.com/${group.handle}/`:`https://www.tiktok.com/@${group.handle}`;
    const link=document.createElement('a');
    link.className=`social-link ${platform.id}`;link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.dataset.id=id;
    link.setAttribute('aria-label',`${platform.name}, @${group.handle}, opens in a new tab`);
    link.innerHTML=`<span class="platform-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${platform.icon}</svg></span><span class="link-text"><strong>${platform.name}</strong><small>@${group.handle}</small></span><span class="link-state"><span class="state-text">+1 spin</span><span class="arrow" aria-hidden="true">↗</span></span>`;
    const record=()=>{visited=new Set([...readProgress(),...visited,id]);try{localStorage.setItem(CAMPAIGN,JSON.stringify([...visited]));}catch{document.getElementById('storage-note').hidden=false;}render();};
    link.addEventListener('click',record);
    link.addEventListener('auxclick',event=>{if(event.button===1)record();});
    document.getElementById(`${group.id}-links`).append(link);
  }
}
function render(){
  const count=visited.size;
  document.getElementById('progress-label').textContent=`${count} out of ${ids.length} collected`;
  document.getElementById('percent').textContent=`${Math.round(count/ids.length*100)}%`;
  document.getElementById('progress').setAttribute('aria-valuenow',count);
  document.getElementById('progress-fill').style.width=`${count/ids.length*100}%`;
  document.getElementById('spins').textContent=count;
  document.getElementById('bracelet-status').textContent=count===ids.length?'✓ Bracelet unlocked!':'♡ Bracelet at 6';
  document.getElementById('progress-message').textContent=count===0?'Your first reward is one tap away!':count===ids.length?'Full set! Your bracelet is ready to collect at the booth.':`${ids.length-count} more ${ids.length-count===1?'page':'pages'} to your free bracelet. Keep rolling!`;
  const button=document.getElementById('show-pass');button.disabled=count===0;
  button.innerHTML=count===0?'Collect a link to unlock your pass <span>↗</span>':'Show my reward pass <span>↗</span>';
  for(const group of groups)document.getElementById(`${group.id}-count`).textContent=`${[...visited].filter(id=>id.startsWith(group.id+'-')).length} / 3`;
  document.querySelectorAll('.social-link').forEach(link=>{const done=visited.has(link.dataset.id);link.classList.toggle('visited',done);link.querySelector('.state-text').textContent=done?'Collected':'+1 spin';link.querySelector('.arrow').textContent=done?'✓':'↗';});
  document.getElementById('pass-total').textContent=`${count} free ${count===1?'spin':'spins'}`;
  document.getElementById('pass-bracelet').textContent=count===ids.length?'+ Your free Sticki bracelet!':`${ids.length-count} more links to unlock your free bracelet.`;
}
const dialog=document.getElementById('reward-dialog');
document.getElementById('show-pass').addEventListener('click',()=>dialog.showModal());
for(const id of ['close-pass','done-pass'])document.getElementById(id).addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const rect=dialog.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)dialog.close();}});
window.addEventListener('storage',event=>{if(event.key===CAMPAIGN||event.key===null){visited=readProgress();render();}});
render();
