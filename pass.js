'use strict';

const SERVICE=location.hostname==='127.0.0.1'?'http://127.0.0.1:5173':'https://sticki-con-redemption-danhues.danhues.chatgpt.site';

const PASS_KEY='sticki-issued-pass-v1';

let passCode='',pass=null,online=false,version=0,visitor=crypto.randomUUID(),pending=Promise.resolve();

const $=id=>document.getElementById(id);

try{passCode=localStorage.getItem(PASS_KEY)||'';visitor=localStorage.getItem('sticki-browser-id')||visitor;localStorage.setItem('sticki-browser-id',visitor);}catch{$('storage-note').hidden=false;}

let device='';

try{device=localStorage.getItem('sticki-device-token-v1')||crypto.randomUUID();localStorage.setItem('sticki-device-token-v1',device);}catch{device=crypto.randomUUID();}

let registration=null;

function ensurePass(){if(passCode)return Promise.resolve();if(registration)return registration;registration=request('register',{device}).then(result=>{passCode=result.code;pass=result;online=true;try{localStorage.setItem(PASS_KEY,passCode);}catch{}notice('Your personal pass is ready. Progress saves automatically.');render();}).catch(error=>{online=false;notice('Unable to create your pass. Tap reconnect to try again.',true);render();throw error;}).finally(()=>{registration=null;});return registration;}

async function connect(){try{await ensurePass();await refresh();}catch{}}

async function request(path,body){const response=await fetch(SERVICE+'/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body),cache:'no-store',keepalive:true,signal:AbortSignal.timeout(12000)});const data=await response.json();if(!response.ok)throw new Error(data.error||'Unable to connect.');return data;}

function notice(text,error=false){$('pass-connection').textContent=text;$('pass-connection').classList.toggle('error',error);}

function track(link){const body={id:crypto.randomUUID(),visitor,link,code:passCode||undefined};request('click',body).catch(()=>{});}

async function refresh(code=passCode,qr=false){

 if(!code)return false;

 const seq=++version;online=false;render();notice('Checking your pass…');

 try{const result=await request('pass',{code,qr});if(seq!==version)return false;passCode=code;pass=result;online=true;try{localStorage.setItem(PASS_KEY,code);}catch{$('storage-note').hidden=false;}if(result.qr){$('pass-qr').src=result.qr;$('pass-qr').hidden=false;}notice('Your pass is connected. Progress and previous claims are saved.');return true;}

 catch(error){if(seq===version){online=false;notice(error.name==='TimeoutError'?'Connection timed out. Try again before claiming rewards.':error.message||'Unable to connect. Please retry.',true);}return false;}

 finally{if(seq===version)render();}

}

for(const group of groups)for(const platform of platforms){

 const id=group.id+'-'+platform.id;

 const url=platform.id==='youtube'?`https://www.youtube.com/@${group.youtube}`:platform.id==='instagram'?`https://www.instagram.com/${group.handle}/`:`https://www.tiktok.com/@${group.handle}`;

 const link=document.createElement('a');link.className='social-link '+platform.id;link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.dataset.id=id;link.setAttribute('aria-label',`${platform.name}, @${group.handle}, opens in a new tab`);

 link.innerHTML=`<span class="platform-icon" aria-hidden="true"><svg viewBox="0 0 24 24">${platform.icon}</svg></span><span class="link-text"><strong>${platform.name}</strong><small>@${group.handle}</small></span><span class="link-state"><span class="state-text">+1 spin</span><span class="arrow" aria-hidden="true">↗</span></span>`;

 function record(){track(id);const seq=version;pending=pending.then(async()=>{try{await ensurePass();const code=passCode;const result=await request('visit',{code,link:id});if(passCode===code&&seq===version){pass=result;online=true;notice('Progress saved.');render();}}catch{if(seq===version){online=false;notice('This visit could not be saved. Reopen the link when connected.',true);render();}}});}

 link.addEventListener('click',record);link.addEventListener('auxclick',event=>{if(event.button===1)record();});$(''+group.id+'-links').append(link);

}

document.querySelectorAll('[data-track]').forEach(link=>{link.addEventListener('click',()=>track(link.dataset.track));link.addEventListener('auxclick',event=>{if(event.button===1)track(link.dataset.track);});});

const heroTitle=document.querySelector('.hero h1'),heroText=document.querySelector('.hero p'),originalTitle=heroTitle.innerHTML,originalText=heroText.innerHTML;
function render(){const visited=new Set(pass?.visited||[]),count=visited.size,claimed=pass?.claimedSpins||0,available=count-claimed,redeemed=count===6&&claimed===6&&pass?.claimedBracelet&&pass?.claimedDiscount;

 $('retry-pass').hidden=online;

 $('progress-label').textContent=`${count} out of 6 collected`;$('percent').textContent=Math.round(count/6*100)+'%';$('progress').setAttribute('aria-valuenow',count);$('progress-fill').style.width=count/6*100+'%';$('spins').textContent=available;

 $('bracelet-status').textContent=pass?.claimedBracelet?'✓ Bracelet claimed':count>=1?'✓ Bracelet unlocked!':'♡ Bracelet after your first page';

 $('progress-message').textContent=redeemed?'All rewards claimed. Thanks for joining the fun!':!pass?'Preparing your personal reward pass…':!online?'Reconnect to check your saved rewards.':count===6?'Full set! Show your pass to the Sticki team.':`${available} spins available · ${claimed} already claimed. ${6-count} more pages to your 10% kiosk discount.`;

 const button=$('show-pass');button.disabled=!passCode;button.textContent=redeemed?'View redeemed pass':!online&&passCode?'Reconnect & check my pass':'Show my reward pass';

 for(const group of groups)$(group.id+'-count').textContent=[...visited].filter(id=>id.startsWith(group.id+'-')).length+' / 3';

 document.querySelectorAll('.social-link').forEach(link=>{const done=visited.has(link.dataset.id);link.classList.toggle('visited',done);link.querySelector('.state-text').textContent=done?'Collected':redeemed?'Visit':'+1 spin';link.querySelector('.arrow').textContent=done?'✓':'↗';});

 $('pass-total').textContent=!online?'Checking pass…':`${available} new ${available===1?'spin':'spins'}`;

 $('pass-bracelet').textContent=!online?'Please wait for the live status.':pass?.claimedBracelet?'Bracelet already claimed.':count>=1?'+ Your free Sticki bracelet!':'Open your first social page to unlock a bracelet + spin.';

 const complete=count===6&&claimed===6&&!!pass?.claimedBracelet;
 $('completion').hidden=!complete;document.querySelector('section.pass').hidden=complete;document.querySelectorAll('.social-group,.how,.booth-note,.activation').forEach(el=>el.hidden=complete);
 heroTitle.innerHTML=complete?'Thanks for<br><span>your support!</span>':originalTitle;heroText.innerHTML=complete?'You visited every page. You’re part of the Sticki crew!':originalText;
 $('completion-discount').textContent=pass?.claimedDiscount?'Your 10% kiosk discount has been claimed.':'Grab a 10% discount at the shop!';
 $('completion-rewards').textContent=pass?.claimedDiscount?'Thanks for being part of the Sticki crew!':'Show your QR at the kiosk to use your discount.';
 $('completion-pass').textContent=pass?.claimedDiscount?'View my pass':'Show my 10% discount QR';
 $('completion-pass').disabled=!passCode;
 $('reward-title').textContent=complete?(pass?.claimedDiscount?'Thanks for your support!':'A little thank-you!'):'You’re on a roll!';
 $('reward-help').textContent=complete?'Show this QR to the Sticki team at checkout.':'The Sticki team will help you collect your rewards.';
 if(complete){$('pass-total').textContent=!online?'Checking discount…':pass?.claimedDiscount?'Discount claimed':'10% OFF';$('pass-bracelet').textContent=!online?'Please wait for the live status.':pass?.claimedDiscount?'Thanks for shopping with us!':'Your kiosk purchase';}
 $('completion').classList.toggle('discount-ready',complete&&!pass?.claimedDiscount);
 $('reward-dialog').classList.toggle('discount-ready',complete&&!pass?.claimedDiscount);
 $('display-pass-code').textContent=passCode;document.querySelector('.pass').classList.toggle('redeemed',redeemed);

}

$('retry-pass').addEventListener('click',connect);

const dialog=$('reward-dialog');async function showRewards(){await pending;if(await refresh(passCode,true))dialog.showModal();}for(const id of ['show-pass','completion-pass'])$(id).addEventListener('click',showRewards);

for(const id of ['close-pass','done-pass'])$(id).addEventListener('click',()=>dialog.close());

window.addEventListener('focus',()=>{if(passCode)pending.then(()=>refresh());});

window.addEventListener('storage',event=>{if(event.key===PASS_KEY){version++;pass=null;passCode=event.newValue||'';online=false;render();connect();}});

render();connect();

