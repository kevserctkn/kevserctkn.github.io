(function(){
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){
    const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target)}}),{threshold:.09});
    document.querySelectorAll('.section-header,.project-card,.blog-card,.gallery-item,.about-grid,.profile-card').forEach(el=>{el.classList.add('fwa-reveal');observer.observe(el)});
  }
})();