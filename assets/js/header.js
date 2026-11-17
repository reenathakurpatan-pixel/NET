(function(){
  const host=document.getElementById('site-header');
  if(!host||!window.SYLLABUS)return;
  const s=window.SYLLABUS;
  const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const mobileView=window.matchMedia('(max-width: 760px)').matches;
  const categories=s.groups.map((g,gi)=>{
    const units=s.units.filter(u=>u.group===g.id).map(u=>{
      const subs=u.subunits.map(sub=>{
        const nodes=sub.nodes.map(n=>'<li><a class="nav-node" href="#'+esc(n.id)+'"><span>'+String(n.number).padStart(2,'0')+'</span>'+esc(n.title)+'</a></li>').join('');
        return '<details class="nav-subunit"><summary><span>'+String(sub.number).padStart(2,'0')+'</span><strong>'+esc(sub.title)+'</strong><small>'+sub.nodes.length+' topics</small></summary><ol class="nav-node-list">'+nodes+'</ol></details>';
      }).join('');
      return '<details class="nav-unit"><summary><span class="nav-unit-no">U'+String(u.number).padStart(2,'0')+'</span><span class="nav-unit-copy"><strong>'+esc(u.title)+'</strong><small>'+u.subunits.length+' subunits · '+u.subunits.reduce((a,x)=>a+x.nodes.length,0)+' topics</small></span><span class="nav-chevron" aria-hidden="true">⌄</span></summary><div class="nav-subunits">'+subs+'</div></details>';
    }).join('');
    return '<details class="nav-category" data-category="'+esc(g.id)+'"'+(mobileView?'':' open')+'><summary class="nav-category-heading"><span>0'+(gi+1)+'</span><div><h3>'+esc(g.name)+'</h3><small>'+esc(g.range)+' · '+g.units.length+' units</small></div><b class="nav-category-chevron" aria-hidden="true">⌄</b></summary><div class="nav-unit-list">'+units+'</div></details>';
  }).join('');
  host.innerHTML='<header class="site-header"><div class="header-inner"><a class="brand" href="#home"><span class="brand-mark">LS</span><span><span class="brand-name">LIFE SCIENCE ACADEMY</span><span class="brand-tag">ONE PLATFORM · MULTIPLE EXAMINATIONS</span></span></a><div class="header-search"><span class="search-symbol">⌕</span><input id="site-search" type="search" placeholder="Search units, subunits, topics…" autocomplete="off" aria-label="Search syllabus"><div class="search-results" id="search-results"></div></div><div class="header-actions"><a class="nav-link" href="#approach">Our approach</a><div class="mega-wrap" id="mega-wrap"><button class="mega-trigger" id="mega-trigger" type="button" aria-expanded="false" aria-controls="syllabus-mega-panel">Explore syllabus <span aria-hidden="true">▾</span></button><div class="mega-panel" id="syllabus-mega-panel" aria-label="Complete syllabus navigation"><div class="mega-topbar"><div><p class="mega-title">COMPLETE SYLLABUS</p><span class="mega-count">3 categories · 14 units · 108 subunits · 863 specific topics</span></div><div class="mega-tools"><input id="nav-tree-search" type="search" placeholder="Find in syllabus…" aria-label="Find in complete syllabus"><button type="button" id="nav-expand-all">Expand all</button></div></div><div class="nav-category-grid">'+categories+'</div><p class="nav-empty" id="nav-empty" hidden>No matching syllabus topics.</p></div></div><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">◐ Dark mode</button><button class="menu-toggle" id="menu-toggle" type="button" aria-controls="syllabus-mega-panel" aria-expanded="false">Menu</button></div></div></header>';
  const trigger=document.getElementById('mega-trigger'),wrap=document.getElementById('mega-wrap'),panel=document.getElementById('syllabus-mega-panel'),mobile=document.getElementById('menu-toggle');
  function setOpen(open){wrap.classList.toggle('open',open);document.body.classList.toggle('menu-open',open&&mobileView);trigger.setAttribute('aria-expanded',String(open));mobile.setAttribute('aria-expanded',String(open));mobile.textContent=open?'Close':'Menu';}
  trigger.addEventListener('click',()=>setOpen(!wrap.classList.contains('open')));
  mobile.addEventListener('click',()=>setOpen(!wrap.classList.contains('open')));
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)&&!mobile.contains(e.target))setOpen(false)});
  panel.addEventListener('keydown',e=>{if(e.key==='Escape'){setOpen(false);mobileView?mobile.focus():trigger.focus()}});
  panel.querySelectorAll('.nav-node').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
  panel.querySelectorAll('.nav-category').forEach(cat=>cat.addEventListener('toggle',()=>{if(mobileView&&cat.open)panel.querySelectorAll('.nav-category').forEach(other=>{if(other!==cat)other.open=false})}));
  const expand=document.getElementById('nav-expand-all');
  let allExpanded=false;
  expand.addEventListener('click',()=>{allExpanded=!allExpanded;panel.querySelectorAll('details.nav-unit,details.nav-subunit').forEach(d=>d.open=allExpanded);expand.textContent=allExpanded?'Collapse all':'Expand all'});
  const filter=document.getElementById('nav-tree-search'),empty=document.getElementById('nav-empty');
  filter.addEventListener('input',()=>{
    const q=filter.value.trim().toLowerCase();let total=0;
    panel.querySelectorAll('.nav-category').forEach(cat=>{
      let catMatch=cat.querySelector('.nav-category-heading').textContent.toLowerCase().includes(q),catHas=false;
      cat.querySelectorAll('.nav-unit').forEach(unit=>{
        const unitMatch=unit.querySelector(':scope > summary').textContent.toLowerCase().includes(q);let unitHas=false;
        unit.querySelectorAll('.nav-subunit').forEach(sub=>{
          const subMatch=sub.querySelector(':scope > summary').textContent.toLowerCase().includes(q);let subHas=false;
          sub.querySelectorAll('.nav-node').forEach(node=>{const match=!q||node.textContent.toLowerCase().includes(q)||subMatch||unitMatch||catMatch;node.closest('li').hidden=!match;if(match){subHas=true;total++}});
          const show=!q||subMatch||unitMatch||catMatch||subHas;sub.hidden=!show;if(q&&show)sub.open=true;else if(!q)sub.open=false;
          if(show)unitHas=true;
        });
        const show=!q||unitMatch||catMatch||unitHas;unit.hidden=!show;if(q&&show)unit.open=true;else if(!q)unit.open=false;
        if(show)catHas=true;
      });
      const show=!q||catMatch||catHas;cat.hidden=!show;if(q&&show)cat.open=true;else if(!q&&!mobileView)cat.open=true;else if(!q&&mobileView)cat.open=false;
    });
    empty.hidden=!q||total>0;
  });
  window.addEventListener('resize',()=>{const now=window.matchMedia('(max-width: 760px)').matches;if(!now){document.body.classList.remove('menu-open');wrap.classList.remove('open');mobile.setAttribute('aria-expanded','false');mobile.textContent='Menu'}});
  const saved=localStorage.getItem('lsa-theme');if(saved==='dark')document.documentElement.dataset.theme='dark';
  const theme=document.getElementById('theme-toggle');function label(){theme.textContent=document.documentElement.dataset.theme==='dark'?'☀ Light mode':'◐ Dark mode'}label();
  theme.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';if(dark)document.documentElement.dataset.theme='dark';else delete document.documentElement.dataset.theme;localStorage.setItem('lsa-theme',dark?'dark':'light');label()});
})();