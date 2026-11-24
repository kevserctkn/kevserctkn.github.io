(()=>{
const demoCSS=`<div class="cards"><div class="card">HTML</div><div class="card">CSS</div></div>`;
const baseCSS=`body{font-family:system-ui;margin:15px;color:#47304f}.cards{display:grid;gap:12px}.card{padding:15px;border-radius:10px;background:#efe2f3}`;
document.querySelectorAll('.book-code').forEach((pre,index)=>{
 const page=pre.closest('.book-page'); if(!page)return;
 const original=pre.textContent.trim();
 const isCSS=original.startsWith('.cards')||original.includes('@media');
 const lang=isCSS?'CSS':'HTML';
 const wrap=document.createElement('div');wrap.className='book-workshop';
 const head=document.createElement('div');head.className='book-workshop__head';head.innerHTML='<span>✦ Kod Atölyesi</span><span class="book-workshop__tag">'+lang+'</span>';
 const input=document.createElement('textarea');input.value=original;input.setAttribute('aria-label',lang+' kodunu düzenle');input.spellcheck=false;
 const actions=document.createElement('div');actions.className='book-workshop__actions';
 const makeButton=(label,fn,secondary=false)=>{const b=document.createElement('button');b.type='button';b.textContent=label;if(secondary)b.className='secondary';b.addEventListener('click',fn);actions.append(b);return b};
 const resultLabel=document.createElement('div');resultLabel.className='book-workshop__result';resultLabel.textContent='Canlı sonuç';
 const preview=document.createElement('iframe');preview.title='Kod örneğinin güvenli önizlemesi';preview.setAttribute('sandbox','');preview.setAttribute('referrerpolicy','no-referrer');
 const run=()=>{const val=input.value;preview.srcdoc=isCSS?'<!doctype html><meta charset="utf-8"><style>'+baseCSS+'\n'+val+'</style>'+demoCSS:'<!doctype html><meta charset="utf-8"><style>'+baseCSS+'</style>'+val;};
 makeButton('▶ Çalıştır',run);
 makeButton('↺ Sıfırla',()=>{input.value=original;run()},true);
 const copy=makeButton('⧉ Kopyala',async()=>{try{await navigator.clipboard.writeText(input.value);copy.textContent='✓ Kopyalandı';setTimeout(()=>copy.textContent='⧉ Kopyala',1200)}catch(e){input.select();document.execCommand('copy')}},true);
 const toggle=makeButton('▾ Sonucu göster',()=>{const open=wrap.classList.toggle('preview-open');toggle.textContent=open?'▴ Sonucu gizle':'▾ Sonucu göster';},true);toggle.classList.add('book-workshop__preview-toggle');
 wrap.append(head,input,actions,resultLabel,preview);
 const note=document.createElement('p');note.className='book-workshop__note';note.textContent='Kodları değiştirip Çalıştır’a bas. Önizleme güvenlik için ayrı bir alanda açılır.';wrap.append(note);
 pre.replaceWith(wrap);run();
});
})();