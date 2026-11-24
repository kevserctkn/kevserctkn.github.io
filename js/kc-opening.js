(function(){
  const intro=document.getElementById('kc-opening');
  if(!intro)return;
  const skip=intro.querySelector('.kc-opening__skip');
  let done=false,timer;
  function finish(){if(done)return;done=true;clearTimeout(timer);intro.classList.add('is-closing');setTimeout(()=>{intro.hidden=true;intro.remove();},560);}
  skip.addEventListener('click',finish);
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!done)finish()});
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  timer=setTimeout(finish,reduced?500:4000);
})();
