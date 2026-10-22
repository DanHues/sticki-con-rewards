'use strict';
const CAMPAIGN = 'sticki-comic-con-2026-v1';
const platforms = [
  {id:'youtube', name:'YouTube', icon:'<path d="M23 7s-.2-1.6-.9-2.3C21.2 3.8 20.2 3.8 19.7 3.7 16.4 3.5 12 3.5 12 3.5s-4.4 0-7.7.2c-.5.1-1.5.1-2.4 1C1.2 5.4 1 7 1 7s-.3 1.9-.3 3.8v1.8C.7 14.5 1 16.4 1 16.4s.2 1.6.9 2.3c.9.9 2.1.9 2.7 1 2 .2 7.4.2 7.4.2s4.4 0 7.7-.3c.5 0 1.5 0 2.4-.9.7-.7.9-2.3.9-2.3s.3-1.9.3-3.8v-1.8C23.3 8.9 23 7 23 7ZM9.7 15.1V8.4l6.4 3.4-6.4 3.3Z"/>'},
  {id:'instagram',name:'Instagram',icon:'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2"/>'},
  {id:'tiktok',name:'TikTok',icon:'<path d="M16 2c.4 2.5 1.8 4 4 4.3v3.5a9 9 0 0 1-4-1.2V16a6 6 0 1 1-5-5.9v3.6a2.5 2.5 0 1 0 1.5 2.3V2Z"/>'}
];
const groups = [{id:'rolls',handle:'stickirolls',youtube:'StickiRolls'},{id:'crew',handle:'stickicrew',youtube:'stickicrew'}];
const ids = groups.flatMap(group => platforms.map(platform => `${group.id}-${platform.id}`));
