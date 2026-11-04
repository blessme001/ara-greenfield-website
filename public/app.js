'use strict';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
$$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const menu=$('.menu-toggle'),nav=$('#navigation');
function closeMenu(){nav?.classList.remove('open');menu?.setAttribute('aria-expanded','false')}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));nav.classList.toggle('open',open)});
nav?.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){closeMenu();menu.focus()}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu()});
const header=$('.site-header');const updateHeader=()=>header?.classList.toggle('scrolled',window.scrollY>65);window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
// Two independent videos crossfade as each approaches its end. Neither loops alone.
const films=$$('.hero-film'),toggle=$('#hero-toggle');
if(films.length){
 let current=0,playing=false,switching=false,userPaused=reduced.matches,failed=new Set(),started=false;
 const setButton=()=>{toggle.hidden=!started;toggle.textContent=userPaused?'Play motion ▷':'Pause motion Ⅱ';toggle.setAttribute('aria-label',userPaused?'Play background videos':'Pause background videos')};
 async function start(index){
  if(userPaused||document.hidden||failed.size===films.length)return;
  const next=films[index];if(failed.has(index))return start((index+1)%films.length);
  if(!next.src){next.src=next.dataset.src;next.load()}
  try{await next.play();if(userPaused||document.hidden){next.pause();return}films.forEach((v,i)=>v.classList.toggle('active',i===index));current=index;playing=true;started=true;setButton()}
  catch(e){if(e.name==='NotAllowedError'){userPaused=true;started=true;setButton()}else if(e.name!=='AbortError'){failed.add(index);if(failed.size<films.length)start((index+1)%films.length)}}
 }
 async function advance(){
  if(switching||userPaused||document.hidden)return;
  switching=true;const previous=current;let next=(current+1)%films.length;
  if(failed.has(next)){films[current].currentTime=0;switching=false;return}
  films[next].currentTime=0;await start(next);
  setTimeout(()=>{if(current!==previous){films[previous].pause();films[previous].currentTime=0}switching=false},1050);
 }
 films.forEach((v,i)=>{v.muted=true;v.addEventListener('timeupdate',()=>{if(i===current&&playing&&Number.isFinite(v.duration)&&v.duration-v.currentTime<1.15)advance()});v.addEventListener('ended',()=>{if(i===current)advance()});v.addEventListener('error',()=>{failed.add(i);if(i===current&&failed.size<films.length)start((i+1)%films.length);if(failed.size===films.length){films.forEach(v=>v.classList.remove('active'));toggle.hidden=true}})});
 toggle.addEventListener('click',()=>{userPaused=!userPaused;if(userPaused){films.forEach(v=>v.pause());playing=false}else start(current);setButton()});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){films.forEach(v=>v.pause());playing=false}else if(!userPaused)start(current)});
 reduced.addEventListener('change',()=>{userPaused=reduced.matches;if(userPaused){films.forEach(v=>{v.pause();v.classList.remove('active')});playing=false}else start(current);setButton()});
 if(!reduced.matches)start(0);else{started=true;setButton()}
}
// Reveal is enhancement-only: no initial hiding in the HTML or CSS without JS.
if(!reduced.matches&&'IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.05});
 $$('.section-heading,.partners article,.leaders article,.service-list article').forEach(el=>{if(el.getBoundingClientRect().top>window.innerHeight){el.classList.add('reveal-ready');observer.observe(el)}});
}
const filters=$$('[data-filter]'),cards=$$('[data-category]');
filters.forEach(button=>button.addEventListener('click',()=>{filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;cards.forEach(c=>{c.hidden=button.dataset.filter!=='all'&&c.dataset.category!==button.dataset.filter;if(!c.hidden)count++});$('#filter-status').textContent=`${count} products shown.`}));
const gallery=$$('[data-gallery]'),dialog=$('.lightbox');let photoIndex=0,lastFocus;
function showPhoto(index){photoIndex=(index+gallery.length)%gallery.length;const item=gallery[photoIndex];$('figure img',dialog).src=item.dataset.src;$('figure img',dialog).alt=item.dataset.caption;$('figcaption',dialog).textContent=item.dataset.caption;$('[data-count]',dialog).textContent=`${photoIndex+1} / ${gallery.length}`}
gallery.forEach((el,i)=>el.addEventListener('click',()=>{lastFocus=el;showPhoto(i);dialog.showModal();document.body.style.overflow='hidden'}));
$('.close-dialog',dialog)?.addEventListener('click',()=>dialog.close());
$('[data-prev]',dialog)?.addEventListener('click',()=>showPhoto(photoIndex-1));$('[data-next]',dialog)?.addEventListener('click',()=>showPhoto(photoIndex+1));
dialog?.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
dialog?.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showPhoto(photoIndex+1)}if(e.key==='ArrowLeft'){e.preventDefault();showPhoto(photoIndex-1)}});
dialog?.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus()});
// Enquiries use the existing Formspree endpoint. Success requires an actual OK response.
const form=$('#enquiry-form');
if(form){
 const commodity=new URLSearchParams(location.search).get('commodity');const field=form.elements.commodity;if(commodity&&[...field.options].some(o=>o.value===commodity))field.value=commodity;
 form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const button=$('button[type=submit]',form),status=$('#form-status');button.disabled=true;button.textContent='Sending…';status.textContent='';status.className='';const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),20000);
 try{const result=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'},signal:controller.signal});if(!result.ok)throw new Error('Submission failed');status.className='success';status.textContent='Thank you. Your enquiry has been sent to our team.';form.reset()}
 catch{status.className='error';status.textContent='We could not confirm delivery. Your entries are still here. Please retry or email Alfred@aragreenfieldng.com.'}
 finally{clearTimeout(timeout);button.disabled=false;button.textContent='Send enquiry ↗'}
 });
}
// Pause other editorial videos when one starts.
$$('video[controls]').forEach(v=>v.addEventListener('play',()=>$$('video[controls]').forEach(other=>{if(other!==v)other.pause()})));
