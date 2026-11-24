(()=>{
  'use strict';
  const spreads=[...document.querySelectorAll('.book-spread')];
  const pages=[...document.querySelectorAll('.book-spread .book-page')];
  const stage=document.querySelector('.book-stage');
  const pageContainer=document.querySelector('.book-pages');
  const prev=document.getElementById('book-prev');
  const next=document.getElementById('book-next');
  const count=document.getElementById('book-count');
  if(!spreads.length||!stage||!pageContainer||!prev||!next||!count)return;

  const mobile=()=>window.matchMedia('(max-width:700px)').matches;
  const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  let position=0, turning=false, ignoreClickUntil=0, startX=null, startY=null;
  const total=()=>mobile()?pages.length:spreads.length;

  function show(n){
    if(n<0||n>=total())return;
    position=n;
    spreads.forEach(s=>{
      s.classList.remove('is-active','turn-next','turn-prev');
      s.setAttribute('aria-hidden','true');
    });
    pages.forEach(p=>{
      p.classList.remove('mobile-active');
      p.tabIndex=-1;
    });
    let active;
    if(mobile()){
      active=pages[n];
      active.classList.add('mobile-active');
    }else{
      active=spreads[n];
    }
    const spread=mobile()?active.closest('.book-spread'):active;
    spread.classList.add('is-active');
    spread.setAttribute('aria-hidden','false');
    (mobile()?[active]:[...spread.querySelectorAll('.book-page')]).forEach(p=>p.tabIndex=0);
    prev.disabled=n===0;
    next.disabled=n===total()-1;
    count.textContent=(n+1)+' / '+total();
  }

  function turn(direction){
    if(turning)return;
    const target=position+direction;
    if(target<0||target>=total())return;
    if(reducedMotion()){
      show(target);
      return;
    }
    turning=true;
    const oldPage=mobile()?pages[position]:spreads[position].querySelector(direction>0?'.book-page:last-child':'.book-page:first-child');
    const newPage=mobile()?pages[target]:spreads[target].querySelector(direction>0?'.book-page:first-child':'.book-page:last-child');
    const sheet=document.createElement('div');
    sheet.className='book-turn-sheet '+(direction>0?'forward':'reverse');
    sheet.setAttribute('aria-hidden','true');
    const front=document.createElement('div');
    front.className='book-turn-face front';
    front.appendChild(oldPage.cloneNode(true));
    const back=document.createElement('div');
    back.className='book-turn-face back';
    back.appendChild(newPage.cloneNode(true));
    sheet.append(front,back);
    pageContainer.classList.add('is-flipping');
    pageContainer.appendChild(sheet);
    // At the halfway point, the turning page hides the switch between spreads.
    const mid=window.setTimeout(()=>show(target),265);
    const finish=()=>{
      clearTimeout(mid);
      show(target);
      sheet.remove();
      pageContainer.classList.remove('is-flipping');
      turning=false;
    };
    const timeout=window.setTimeout(finish,620);
    sheet.addEventListener('transitionend',e=>{
      if(e.target!==sheet||e.propertyName!=='transform')return;
      clearTimeout(timeout);
      finish();
    },{once:true});
    requestAnimationFrame(()=>requestAnimationFrame(()=>sheet.classList.add('is-turning')));
  }

  prev.addEventListener('click',()=>turn(-1));
  next.addEventListener('click',()=>turn(1));

  stage.addEventListener('click',e=>{
    if(Date.now()<ignoreClickUntil||turning)return;
    if(e.target.closest('a,button,input,textarea,select,pre,code,[contenteditable="true"]'))return;
    const page=e.target.closest('.book-spread.is-active .book-page');
    if(!page)return;
    if(window.getSelection()?.toString().trim())return;
    let direction;
    if(mobile()){
      const rect=stage.getBoundingClientRect();
      direction=e.clientX<rect.left+rect.width/2?-1:1;
    }else{
      direction=page===page.closest('.book-spread').querySelector('.book-page:first-child')?-1:1;
    }
    turn(direction);
  });

  stage.addEventListener('keydown',e=>{
    if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('book-page')){
      e.preventDefault();
      const direction=mobile()?1:(e.target===e.target.closest('.book-spread').querySelector('.book-page:first-child')?-1:1);
      turn(direction);
    }
  });
  document.addEventListener('keydown',e=>{
    if(e.altKey||e.ctrlKey||e.metaKey)return;
    const el=document.activeElement;
    if(el?.matches('input,textarea,select,[contenteditable="true"]'))return;
    if(e.key==='ArrowRight')turn(1);
    if(e.key==='ArrowLeft')turn(-1);
  });
  stage.addEventListener('touchstart',e=>{
    startX=e.changedTouches[0]?.clientX??null;
    startY=e.changedTouches[0]?.clientY??null;
  },{passive:true});
  stage.addEventListener('touchend',e=>{
    if(startX===null)return;
    const dx=e.changedTouches[0].clientX-startX;
    const dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dx)>65&&Math.abs(dx)>Math.abs(dy)*1.2){
      ignoreClickUntil=Date.now()+700;
      turn(dx<0?1:-1);
    }
    startX=startY=null;
  },{passive:true});
  let wasMobile=mobile();
  window.addEventListener('resize',()=>{
    if(wasMobile!==mobile()&&!turning){
      wasMobile=mobile();
      show(0);
    }
  });
  show(0);
})();
