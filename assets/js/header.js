(function(){
  const host=document.getElementById('site-header');if(!host)return;
  const s=window.SYLLABUS;
  const tree=s.groups.map((g,gi)=>{
    const units=s.units.filter(u=>u.group===g.id).map(u=>{
      const subs=u.subunits.map(sub=>'<details class="tree-subunit"><summary><span class="tree-index">'+String(sub.number).padStart(2,'0')+'</span><span>'+sub.title+'</span><small>'+sub.nodes.length+' nodes</small></summary><ol class="tree-nodes">'+sub.nodes.map(n=>'<li><a href="#'+n.id+'"><b>'+String(n.number).padStart(2,'0')+'</b> '+n.title+'</a></li>').join('')+'</ol></details>').join('');
      return '<details class="tree-unit"><summary><span class="tree-index">U'+String(u.number).padStart(2,'0')+'</span><span class="tree-label"><strong>'+u.title+'</strong><small>'+u.subunits.length+' subunits · '+u.subunits.reduce((a,x)=>a+x.nodes.length,0)+' nodes</small></span></summary><div class="tree-children">'+subs+'</div></details>';
    }).join('');
    return '<details class="tree-category" '+(gi===0?'':'')+'><summary><span class="tree-category-no">0'+(gi+1)+'</span><span class="tree-label"><strong>'+g.name+'</strong><small>'+g.range+' · '+g.units.length+' units</small></span></summary><div class="tree-children">'+units+'</div></details>';
  }).join('');
  host.innerHTML='<header class="site-header"><div class="header-inner"><a class="brand" href="#home"><span class="brand-mark">LS</span><span><span class="brand-name">LIFE SCIENCE ACADEMY</span><span class="brand-tag">ONE PLATFORM · MULTIPLE EXAMINATIONS</span></span></a><div class="header-search"><span class="search-symbol">⌕</span><input id="site-search" type="search" placeholder="Search units, subunits, topics…" autocomplete="off" aria-label="Search syllabus"><div class="search-results" id="search-results"></div></div><div class="header-actions"><a class="nav-link" href="#approach">Our approach</a><div class="mega-wrap" id="mega-wrap"><button class="mega-trigger" id="mega-trigger" type="button" aria-expanded="false">Complete syllabus ▾</button><div class="mega-panel"><div class="mega-heading"><p class="mega-title">COMPLETE SYLLABUS TREE</p><span>3 categories · 13 units · 130 subunits · 1,300 nodes</span></div><div class="syllabus-tree">'+tree+'</div></div></div><button class="theme-toggle" id="theme-toggle" type="button" aria-label="Toggle dark mode">◐ Dark mode</button><button class="menu-toggle" id="menu-toggle" type="button">Menu</button></div></div></header>';
  const trigger=document.getElementById('mega-trigger'),wrap=document.getElementById('mega-wrap');
  trigger.addEventListener('click',()=>{wrap.classList.toggle('open');trigger.setAttribute('aria-expanded',wrap.classList.contains('open'))});
  document.addEventListener('click',e=>{if(!wrap.contains(e.target)){wrap.classList.remove('open');trigger.setAttribute('aria-expanded','false')}});
  wrap.querySelectorAll('.syllabus-tree a').forEach(a=>a.addEventListener('click',()=>{wrap.classList.remove('open');trigger.setAttribute('aria-expanded','false')}));
  const saved=localStorage.getItem('lsa-theme');if(saved==='dark')document.documentElement.dataset.theme='dark';
  const theme=document.getElementById('theme-toggle');function label(){theme.textContent=document.documentElement.dataset.theme==='dark'?'☀ Light mode':'◐ Dark mode'}label();
  theme.addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';if(dark)document.documentElement.dataset.theme='dark';else delete document.documentElement.dataset.theme;localStorage.setItem('lsa-theme',dark?'dark':'light');label()});
  document.getElementById('menu-toggle').addEventListener('click',()=>{wrap.classList.toggle('open');trigger.setAttribute('aria-expanded',wrap.classList.contains('open'))});
})();