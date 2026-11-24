
(function(){
 'use strict';
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const hero=document.querySelector('.remix-hero');
 const photo=hero&&hero.querySelector('.wix-lavender-card');
 let scrollPending=false;
 function onScroll(){
  if(photo&&!reduced&&window.innerWidth>900){
   const offset=Math.max(-26,Math.min(26,window.scrollY*.045));
   photo.style.transform='translate3d(0,'+offset+'px,0) rotate('+(3-window.scrollY*.006)+'deg) scale('+(1+Math.min(window.scrollY/3500,.045))+')';
  }
  scrollPending=false;
 }
 window.addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(onScroll)}},{passive:true});
 window.addEventListener('resize',onScroll,{passive:true});onScroll();
 if(reduced)return;
 const headline=hero&&hero.querySelector('.wix-headline');
 if(headline&&!headline.querySelector('[data-editable]')&&!headline.querySelector('input')){
  // Preserve inline markup and editor behavior: animate the whole heading, not its editable text nodes.
  headline.classList.add('motion-reveal');
 }
 const targets=document.querySelectorAll('.section-header,.project-card,.blog-card,.gallery-card,.gallery-item,.about-grid,.profile-card,.remix-break,.expertise-rail');
 if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('motion-visible');observer.unobserve(entry.target)}
   })
  },{threshold:.08,rootMargin:'0px 0px -35px 0px'});
  targets.forEach((el,i)=>{
   el.classList.add('motion-reveal');
   if(el.matches('.project-card,.blog-card,.gallery-card,.gallery-item'))el.classList.add(i%2?'motion-slide-right':'motion-slide-left');
   observer.observe(el);
  });
  if(headline)observer.observe(headline);
 }else{
  targets.forEach(el=>el.classList.add('motion-visible'));
  if(headline)headline.classList.add('motion-visible');
 }
 if(window.matchMedia('(hover:hover) and (pointer:fine)').matches){
  const glow=document.createElement('div');glow.className='motion-glow';glow.setAttribute('aria-hidden','true');document.body.appendChild(glow);
  let pointerPending=false,x=0,y=0;
  window.addEventListener('pointermove',e=>{
   x=e.clientX;y=e.clientY;
   if(!pointerPending){pointerPending=true;requestAnimationFrame(()=>{glow.style.left=x+'px';glow.style.top=y+'px';glow.classList.add('motion-active');pointerPending=false})}
  },{passive:true});
  document.addEventListener('mouseleave',()=>glow.classList.remove('motion-active'));
 }
 const curtain=document.createElement('div');curtain.className='motion-page-curtain';curtain.setAttribute('aria-hidden','true');document.body.appendChild(curtain);
 document.addEventListener('click',e=>{
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  const a=e.target.closest('a[href]');
  if(!a||a.hasAttribute('download')||a.target&&a.target!=='_self')return;
  if(a.closest('.admin-toolbar,.admin-panel,[contenteditable="true"]'))return;
  const url=new URL(a.href,location.href);
  if(url.origin!==location.origin||url.pathname===location.pathname||!url.pathname.endsWith('.html'))return;
  e.preventDefault();curtain.classList.add('motion-enter');
  window.setTimeout(()=>{location.href=url.href},400);
 });
 window.addEventListener('pageshow',()=>curtain.classList.remove('motion-enter'));
})();
