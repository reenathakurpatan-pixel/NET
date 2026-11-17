(function(){
  const s=window.SYLLABUS;if(!s)return;
  const grid=document.getElementById('category-grid'),list=document.getElementById('unit-list');
  grid.innerHTML=s.groups.map((g,i)=>'<article class="category-card"><span class="category-number">DOMAIN 0'+(i+1)+' · '+g.range+'</span><h3>'+g.name+'</h3><p>'+g.description+'</p><a href="#unit-'+String(g.unitIndexes[0]+1).padStart(2,'0')+'">Explore category ↗</a></article>').join('');
  list.innerHTML=s.units.map(u=>'<details class="unit-card" id="'+u.id+'"><summary class="unit-summary"><span class="unit-no">'+String(u.number).padStart(2,'0')+'</span><span class="unit-heading"><strong>'+u.title+'</strong><span>'+s.groups.find(g=>g.id===u.group).name+' · '+u.subunits.length+' subunits · '+u.subunits.reduce((total,sub)=>total+sub.nodes.length,0)+' topics</span></span><span class="unit-arrow">›</span></summary><div class="subunit-grid">'+u.subunits.map(sub=>'<details class="subunit" id="'+sub.id+'"><summary><span>'+String(sub.number).padStart(2,'0')+'</span>'+sub.title+'</summary><div class="topic-heading">TOPICS · '+sub.nodes.length+'</div><ol class="node-list">'+sub.nodes.map(n=>'<li id="'+n.id+'"><b>'+String(n.number).padStart(2,'0')+'.</b> '+n.title+'</li>').join('')+'</ol></details>').join('')+'</div></details>').join('');
  const subunitCount=s.units.reduce((n,u)=>n+u.subunits.length,0);const topicCount=s.units.reduce((n,u)=>n+u.subunits.reduce((m,sub)=>m+sub.nodes.length,0),0);document.getElementById('unit-count').textContent=s.units.length+' units · '+subunitCount+' subunits · '+topicCount+' specific topics';
  const expand=document.getElementById('expand-all');let opened=false;
  expand.addEventListener('click',()=>{opened=!opened;list.querySelectorAll(':scope > .unit-card').forEach(d=>d.open=opened);expand.textContent=opened?'Collapse all units':'Expand all units'});
  function revealHash(){
    if(!location.hash)return;
    let id;try{id=decodeURIComponent(location.hash.slice(1))}catch(e){id=location.hash.slice(1)}
    const target=document.getElementById(id);if(!target)return;
    if(target.tagName==='DETAILS')target.open=true;
    let parent=target.parentElement;
    while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement}
    requestAnimationFrame(()=>target.scrollIntoView({behavior:'smooth',block:'start'}));
  }
  window.addEventListener('hashchange',revealHash);
  const input=document.getElementById('site-search'),results=document.getElementById('search-results'),index=[];
  s.units.forEach(u=>{
    index.push({title:'Unit '+u.number+': '+u.title,detail:s.groups.find(g=>g.id===u.group).name,href:'#'+u.id});
    u.subunits.forEach(sub=>{
      index.push({title:sub.title,detail:'Unit '+u.number+' · Subunit',href:'#'+sub.id});
      sub.nodes.forEach(n=>index.push({title:n.title,detail:'Unit '+u.number+' · '+sub.title,href:'#'+n.id}));
    });
  });
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    if(!q){results.classList.remove('show');results.innerHTML='';return}
    const found=index.filter(x=>x.title.toLowerCase().includes(q)||x.detail.toLowerCase().includes(q)).slice(0,15);
    results.innerHTML=found.length?found.map(x=>'<a class="search-result" href="'+x.href+'">'+x.title+'<small>'+x.detail+'</small></a>').join(''):'<div class="empty-result">No matching syllabus topics found.</div>';
    results.classList.add('show');
  });
  results.addEventListener('click',e=>{const a=e.target.closest('a');if(a){results.classList.remove('show');setTimeout(revealHash,0)}});
  document.addEventListener('click',e=>{if(!e.target.closest('.header-search'))results.classList.remove('show')});
  revealHash();
})();