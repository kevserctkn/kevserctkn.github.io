/* Gentle page-reading animation. No falling or shifting; replays after turns. */
(()=>{
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  const pages=[...document.querySelectorAll('.book-spread .book-page')];
  if(!pages.length)return;
  for(const page of pages){
    const blocks=[...page.querySelectorAll('.chapter,h2,p,.book-code,.book-workshop,.code-workshop,.book-code-workshop,.book-figure,.book-figure-caption')]
      .filter(el=>!el.closest('button,a') && !el.parentElement?.closest('.book-workshop,.code-workshop,.book-code-workshop'));
    let index=0;
    for(const block of blocks){
      if(block.classList.contains('number') || block.dataset.readReveal)continue;
      block.dataset.readReveal='1';
      block.classList.add('reading-reveal');
      block.style.setProperty('--reading-delay',`${Math.min(index*145,620)}ms`);
      index++;
    }
  }
  let previous=new WeakMap();
  const refresh=()=>{
    for(const page of pages){
      const active=page.closest('.book-spread')?.classList.contains('is-active') && (innerWidth>700 || page.classList.contains('mobile-active'));
      const was=previous.get(page)||false;
      if(active!==was){
        previous.set(page,!!active);
        if(active && !reduce.matches){
          page.classList.remove('reading-active');
          void page.offsetWidth;
          page.classList.add('reading-active');
        }else page.classList.toggle('reading-active',!!active);
      }
    }
  };
  const observer=new MutationObserver(refresh);
  document.querySelectorAll('.book-spread,.book-page').forEach(el=>observer.observe(el,{attributes:true,attributeFilter:['class']}));
  refresh();addEventListener('resize',refresh,{passive:true});
  reduce.addEventListener?.('change',refresh);
})();
