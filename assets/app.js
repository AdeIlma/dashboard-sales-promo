(function(){
const D=window.__D; const CD=[31,31,30]; const MON=['Jul','Agu','Sep']; const MONL=['Juli','Agustus','September'];
const REG=['JOGJA','JATENG','JATIM','BALI','JAKARTA']; const RV={JOGJA:'--r-jog',JATENG:'--r-jtg',JATIM:'--r-jtm',BALI:'--r-bli',JAKARTA:'--r-jkt'};
const G=['NAIK TERUS','NAIK LALU STABIL','MULAI GROWTH','STUCK','MELEMAH DI SEP','TURUN TERUS'];
const GX=['PROMO BARU (JUL=0)','PROMO SPORADIS','TIDAK ADA PROMO'];
const GV={'NAIK TERUS':'nt','NAIK LALU STABIL':'nls','MULAI GROWTH':'mg','STUCK':'st','MELEMAH DI SEP':'ml','TURUN TERUS':'tt'};
const MECH=['TWIN','BUNDLING','PARTY PACKAGE','BUY X GET Y','BUY MORE SAVE MORE','MIX & MATCH'];
const MV={'TWIN':'--promo','BUNDLING':'--sales','PARTY PACKAGE':'--r-jtg','BUY X GET Y':'--r-bli','BUY MORE SAVE MORE':'--r-jkt','MIX & MATCH':'--g-st'};
let T=0.03;
const css=v=>getComputedStyle(document.documentElement).getPropertyValue(v).trim();
const $=s=>document.querySelector(s); const $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const nf=(x,d=0)=>x==null||!isFinite(x)?'–':x.toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
const M=x=>x==null?'–':'Rp '+nf(x/1e9,2)+' M'; const J=x=>x==null?'–':nf(x/1e6,0)+' jt';
const P=(x,s=true)=>x==null||!isFinite(x)?'–':(s&&x>0?'+':'')+nf(x*100,1)+'%';
const cls=x=>x==null||!isFinite(x)?'':x>T?'up':x<-T?'down':'flat';
const g=(a,b)=>a==null||b==null||!b?null:a/b-1;
const sum=a=>a.reduce((x,y)=>x+(y||0),0);
const ads=a=>a.map((v,i)=>v==null?null:v/CD[i]);
// ---------- classification
function pat(d1,d2){ if(d1==null||d2==null||!isFinite(d1)||!isFinite(d2)) return 'N/A';
  const a=d1>T?'U':d1<-T?'D':'F', b=d2>T?'U':d2<-T?'D':'F';
  return {UU:'NAIK TERUS',UF:'NAIK LALU STABIL',UD:'PUNCAK AGU LALU TURUN',FU:'MULAI GROWTH',DU:'MULAI GROWTH (REBOUND)',FF:'STUCK / STAGNAN',FD:'MULAI TURUN',DF:'TURUN LALU STUCK',DD:'TURUN TERUS'}[a+b]; }
function grp(p){ if(p==='NAIK TERUS'||p==='TURUN TERUS') return p; if(p.startsWith('MULAI GROWTH')) return 'MULAI GROWTH';
  if(p==='STUCK / STAGNAN'||p==='TURUN LALU STUCK') return 'STUCK'; if(p==='PUNCAK AGU LALU TURUN'||p==='MULAI TURUN') return 'MELEMAH DI SEP'; return p; }
const dir=x=>x==null||!isFinite(x)?'N/A':x>T?'NAIK':x<-T?'TURUN':'STAGNAN';
function classify(){
  D.br.forEach(b=>{ const a=ads(b.s), p=ads(b.p);
    b.st3=sum(b.s); b.pt3=sum(b.p); b.ps=b.st3?b.pt3/b.st3:0;
    b.d1=g(a[1],a[0]); b.d2=g(a[2],a[1]); b.d3=g(a[2],a[0]);
    b.q1=g(p[1],p[0]); b.q2=g(p[2],p[1]); b.q3=g(p[2],p[0]);
    if(b.st!=='LFL'){ b.SP=b.PP=b.SG=b.PG=b.SD=b.PD='–'; return; }
    b.SP=pat(b.d1,b.d2); b.SG=grp(b.SP); b.SD=dir(b.d3);
    if(!b.p[0]){ b.PP=b.p[2]>0?'PROMO BARU (JUL=0)':(b.p[1]>0?'PROMO SPORADIS':'TIDAK ADA PROMO'); b.PD=b.p[2]>0?'NAIK':'N/A'; }
    else if(!b.p[1]){ b.PP='PROMO SPORADIS'; b.PD=dir(b.q3); }
    else { b.PP=pat(b.q1,b.q2); b.PD=dir(b.q3); }
    b.PG=grp(b.PP);
  });
}
const LFL=()=>D.br.filter(b=>b.st==='LFL');
function pill(grp){ const k=GV[grp]; if(!k) return `<span class="pill" style="background:var(--g-na-bg);color:var(--muted)">${esc(grp)}</span>`;
  const tc=k==='nls'?'nt':k; return `<span class="pill" style="background:var(--g-${k}-bg);color:var(--g-${tc});border-color:color-mix(in srgb,var(--g-${k}) 35%,transparent)">${esc(grp)}</span>`; }
function patPill(p){ return pill(grp(p)).replace(`>${esc(grp(p))}<`,`>${esc(p)}<`); }
function dirPill(d){ const c=d==='NAIK'?'nt':d==='TURUN'?'tt':d==='STAGNAN'?'st':null; return c?`<span class="pill" style="background:var(--g-${c}-bg);color:var(--g-${c})">${d}</span>`:`<span class="pill" style="background:var(--g-na-bg);color:var(--muted)">${esc(d)}</span>`; }
// ---------- tooltip
const tip=$('#tip');
document.addEventListener('mousemove',e=>{ const t=e.target.closest('[data-tip]'); if(!t){tip.style.display='none';return;}
  tip.innerHTML=t.getAttribute('data-tip'); tip.style.display='block';
  const w=tip.offsetWidth,h=tip.offsetHeight; let x=e.clientX+14,y=e.clientY+14; if(x+w>innerWidth-8)x=e.clientX-w-14; if(y+h>innerHeight-8)y=e.clientY-h-14; tip.style.left=x+'px'; tip.style.top=y+'px'; });
// ---------- svg charts
function niceMax(v){ const p=Math.pow(10,Math.floor(Math.log10(v))); const n=v/p; return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p; }
function stacked(el,cats,series,{h=260,fmt=v=>nf(v,1),top,topFmt,extra}={}){
  const W=560,pl=44,pr=10,pt=22,pb=28; const tot=cats.map((_,i)=>sum(series.map(s=>s.v[i])));
  const mx=niceMax(Math.max(...tot)*1.08); const y=v=>pt+(h-pt-pb)*(1-v/mx); const bw=Math.min(90,(W-pl-pr)/cats.length*.55);
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img"><g class="grid">`;
  for(let i=0;i<=4;i++){const v=mx*i/4; s+=`<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}"/><text x="${pl-6}" y="${y(v)+4}" text-anchor="end">${fmt(v)}</text>`;} s+='</g>';
  cats.forEach((c,i)=>{ const cx=pl+(W-pl-pr)*(i+.5)/cats.length; let acc=0;
    series.forEach(se=>{ const v=se.v[i]||0; if(v<=0)return; const y0=y(acc+v),hh=y(acc)-y(acc+v);
      s+=`<rect x="${cx-bw/2}" y="${y0}" width="${bw}" height="${Math.max(0,hh)}" fill="${se.c}" data-tip="<b>${esc(c)} · ${esc(se.n)}</b><br>${fmt(v)}${se.tipx?se.tipx(i):''}"/>`;
      if(se.lab&&hh>15) s+=`<text x="${cx}" y="${y0+hh/2+4}" text-anchor="middle" style="fill:#fff;font-weight:600">${se.lab(i)}</text>`; acc+=v; });
    s+=`<text x="${cx}" y="${y(tot[i])-6}" text-anchor="middle" class="lbl">${topFmt?topFmt(i,tot[i]):fmt(tot[i])}</text><text x="${cx}" y="${h-8}" text-anchor="middle">${esc(c)}</text>`; });
  el.innerHTML=s+'</svg>';
}
function lines(el,cats,series,{h=250,fmt=v=>nf(v,0)}={}){
  const W=560,pl=40,pr=110,pt=12,pb=26; const all=series.flatMap(s=>s.v).filter(v=>v!=null);
  let mn=Math.min(100,...all),mx=Math.max(...all); const pad=(mx-mn)*.08||5; mn=Math.floor((mn-pad)/10)*10; mx=Math.ceil((mx+pad)/10)*10;
  const x=i=>pl+(W-pl-pr)*i/(cats.length-1), y=v=>pt+(h-pt-pb)*(1-(v-mn)/(mx-mn));
  let s=`<svg viewBox="0 0 ${W} ${h}" width="100%" role="img"><g class="grid">`;
  for(let i=0;i<=4;i++){const v=mn+(mx-mn)*i/4; s+=`<line x1="${pl}" x2="${W-pr}" y1="${y(v)}" y2="${y(v)}"/><text x="${pl-6}" y="${y(v)+4}" text-anchor="end">${fmt(v)}</text>`;}
  s+=`</g><line x1="${pl}" x2="${W-pr}" y1="${y(100)}" y2="${y(100)}" stroke="var(--faint)" stroke-dasharray="4 3"/>`;
  cats.forEach((c,i)=>s+=`<text x="${x(i)}" y="${h-6}" text-anchor="middle">${c}</text>`);
  const ends=[];
  series.forEach(se=>{ const pts=se.v.map((v,i)=>v==null?null:[x(i),y(v)]).filter(Boolean);
    s+=`<polyline fill="none" stroke="${se.c}" stroke-width="2.4" points="${pts.map(p=>p.join(',')).join(' ')}"/>`;
    se.v.forEach((v,i)=>{ if(v!=null) s+=`<circle cx="${x(i)}" cy="${y(v)}" r="${i===cats.length-1?4.5:3.2}" fill="${se.c}" data-tip="<b>${esc(se.n)} · ${cats[i]}</b><br>Indeks ${nf(v,1)}"/>`; });
    ends.push({y:y(se.v[se.v.length-1]),t:`${se.n} ${nf(se.v[se.v.length-1],0)}`,c:se.c}); });
  ends.sort((a,b)=>a.y-b.y); for(let i=1;i<ends.length;i++) if(ends[i].y-ends[i-1].y<13) ends[i].y=ends[i-1].y+13;
  ends.forEach(e=>s+=`<text x="${W-pr+8}" y="${e.y+4}" style="fill:${e.c};font-weight:700">${esc(e.t)}</text>`);
  el.innerHTML=s+'</svg>';
}
function hbars(el,items,{fmt=J,max}={}){
  const mx=max||Math.max(...items.map(i=>i.v),1);
  el.innerHTML=`<div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(90px,38%) auto;gap:5px 10px;align-items:center;font-size:12.5px">`+
   items.map(i=>`<div style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(i.l)}" ${i.click?`class="${i.cls||''}" style="cursor:pointer" data-k="${esc(i.k)}"`:''}>${i.pre||''}${esc(i.l)}</div>
     <div class="bar" data-tip="${esc(i.tip||i.l)}" ${i.k?`data-k="${esc(i.k)}" style="cursor:pointer"`:''}><span style="width:${Math.max(1,i.v/mx*100)}%;background:${i.c||'var(--sales)'}"></span></div>
     <div class="n" style="text-align:right;white-space:nowrap">${i.lab??fmt(i.v)}</div>`).join('')+'</div>';
}
function spark(v,c='var(--sales)'){ const a=v.filter(x=>x!=null); if(a.length<2) return ''; const mn=Math.min(...a),mx=Math.max(...a),r=mx-mn||1;
  const pts=v.map((x,i)=>x==null?null:`${4+i*26},${18-(x-mn)/r*14}`).filter(Boolean); return `<svg width="60" height="22" viewBox="0 0 60 22"><polyline fill="none" stroke="${c}" stroke-width="1.8" points="${pts.join(' ')}"/><circle cx="${pts[pts.length-1].split(',')[0]}" cy="${pts[pts.length-1].split(',')[1]}" r="2.6" fill="${c}"/></svg>`; }
// ---------- table helper with sort
function table(el,cols,rows,{onClick,key,sel,initSort}={}){
  if(!el._st||el._nc!==cols.length){el._st={c:initSort?initSort[0]:null,d:initSort?initSort[1]:-1}; el._nc=cols.length;}
  const st=el._st; let rs=rows.slice();
  if(st.c!=null){ const c=cols[st.c]; rs.sort((a,b)=>{ let x=c.s?c.s(a):c.v(a), y=c.s?c.s(b):c.v(b); if(x==null)x=-Infinity; if(y==null)y=-Infinity; return (typeof x==='string'?x.localeCompare(y):x-y)*st.d; }); }
  el.innerHTML=`<thead><tr>${cols.map((c,i)=>`<th class="${c.n?'n':''}" data-i="${i}" title="Urutkan">${c.h}${st.c===i?(st.d>0?' ▲':' ▼'):''}</th>`).join('')}</tr></thead><tbody>`+
    rs.map(r=>`<tr class="${onClick?'click':''} ${sel&&key&&key(r)===sel?'sel':''}" ${key?`data-k="${esc(key(r))}" tabindex="0"`:''}>${cols.map(c=>`<td class="${c.n?'n':''} ${c.cl||''}">${c.f?c.f(r):esc(c.v(r))}</td>`).join('')}</tr>`).join('')+'</tbody>';
  el.querySelectorAll('th').forEach(th=>th.onclick=()=>{ const i=+th.dataset.i; st.d=st.c===i?-st.d:(cols[i].n?-1:1); st.c=i; table(el,cols,rows,{onClick,key,sel}); });
  if(onClick) el.querySelectorAll('tbody tr').forEach(tr=>{ tr.onclick=()=>onClick(tr.dataset.k); tr.onkeydown=e=>{if(e.key==='Enter')onClick(tr.dataset.k);}; });
}
// ---------- tabs
function show(t){ $$('nav.tabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.t===t)); $$('main>section').forEach(s=>s.classList.toggle('hide',s.id!=='t-'+t));
  try{history.replaceState(null,'','#'+t);}catch(e){} window.scrollTo({top:0}); }
$$('nav.tabs button').forEach(b=>b.onclick=()=>show(b.dataset.t));
document.addEventListener('click',e=>{const b=e.target.closest('[data-go]'); if(b){ if(b.dataset.go==='sku'){$('#skScope').value='R:'+curReg; renderSku();} if(b.dataset.go==='promo'){$('#prScope').value='R:'+curReg; renderPro();} show(b.dataset.go);} });
function chipGroup(sel,cb){ $$(sel+' .chip').forEach(c=>c.onclick=()=>{ $$(sel+' .chip').forEach(x=>x.setAttribute('aria-pressed',x===c)); cb(c.dataset.v); }); }
// ---------- RINGKASAN
let natScope='nat';
function renderRingkasan(){
  const n=D.nat,l=D.lfl, a=ads(n.s), pa=ads(n.p), al=ads(l.s), st=sum(n.s), pt=sum(n.p);
  $('#kpis').innerHTML=[
    ['Total sales Q3',M(st),`Jul ${M(n.s[0])} → Sep ${M(n.s[2])}`],
    ['Sales promo Q3',M(pt),`Share ${P(pt/st,false)} · ${nf(sum(n.q))} paket`],
    ['Δ sales/hari Jul → Sep',`<span class="${cls(g(a[2],a[0]))}">${P(g(a[2],a[0]))}</span>`,`Agu ${P(g(a[1],a[0]))} · Sep ${P(g(a[2],a[1]))}`],
    ['Δ sales/hari LFL',`<span class="${cls(g(al[2],al[0]))}">${P(g(al[2],al[0]))}</span>`,`Sep vs Agu hanya ${P(g(al[2],al[1]))}`],
    ['Δ promo/hari Jul → Sep',`<span class="${cls(g(pa[2],pa[0]))}">${P(g(pa[2],pa[0]))}</span>`,`Share ${P(n.p[0]/n.s[0],false)} → ${P(n.p[2]/n.s[2],false)}`],
    ['Branch aktif',`${n.b[0]} → ${n.b[2]}`,`119 LFL · 12 baru · 4 lainnya`]
  ].map(k=>`<div class="kpi"><div class="eyebrow">${k[0]}</div><div class="v">${k[1]}</div><div class="d">${k[2]}</div></div>`).join('');
  const s=D[natScope]; const np=s.s.map((v,i)=>v-s.p[i]);
  stacked($('#chNat'),MONL,[{n:'Non-promo',c:css('--sales'),v:np.map(v=>v/1e9)},{n:'Promo',c:css('--promo'),v:s.p.map(v=>v/1e9),lab:i=>P(s.p[i]/s.s[i],false)}],
    {fmt:v=>nf(v,v<10?1:0),topFmt:(i,t)=>'Rp '+nf(t,2)+' M · promo '+P(s.p[i]/s.s[i],false)});
  const mc=MECH.filter(k=>D.mech[k]);
  stacked($('#chMech'),MONL,mc.map(k=>({n:k,c:css(MV[k]),v:D.mech[k].map(v=>v/1e9),lab:i=>D.mech[k][i]>6e8?nf(D.mech[k][i]/1e9,2):''})),{fmt:v=>nf(v,v<10?1:0),topFmt:(i,t)=>'Rp '+nf(t,2)+' M'});
  $('#lgMech').innerHTML=mc.map(k=>`<span><i style="background:var(${MV[k]})"></i>${k} ${P(sum(D.mech[k])/pt,false)}</span>`).join('');
  $('#regcards').innerHTML=REG.map(r=>{ const v=D.reg[r], A=ads(v.s), PA=ads(v.p), isNew=v.s[0]==null;
    const sp=isNew?'NEW REGION':pat(g(A[1],A[0]),g(A[2],A[1])), pp=isNew?'NEW REGION':pat(g(PA[1],PA[0]),g(PA[2],PA[1]));
    return `<div class="rc" style="--rc:var(${RV[r]})" data-r="${r}" tabindex="0" role="button"><div style="display:flex;justify-content:space-between;align-items:center"><h3>${r}</h3>${spark(v.s,`var(${RV[r]})`)}</div>
      <div class="kpi" style="border:0;padding:0;background:none"><div class="v" style="font-size:20px">${M(sum(v.s))}</div></div>
      <div class="row"><span class="muted">Δ sales/hari Jul→Sep</span><b class="${cls(g(A[2],A[0]))}">${isNew?'baru buka Agu':P(g(A[2],A[0]))}</b></div>
      <div class="row"><span class="muted">Δ promo/hari Jul→Sep</span><b class="${cls(g(PA[2],PA[0]))}">${isNew?'–':P(g(PA[2],PA[0]))}</b></div>
      <div class="row"><span class="muted">Share promo</span><b>${isNew?'':P(v.p[0]/v.s[0],false)+' → '}${P(v.p[2]/v.s[2],false)}</b></div>
      <div class="row" style="margin-top:8px;flex-wrap:wrap;justify-content:flex-start">${isNew?pill('NEW REGION'):patPill(sp)}${isNew?'':patPill(pp).replace('<span','<span title="Pola promo"')}</div></div>`; }).join('');
  $$('#regcards .rc').forEach(c=>{ const go=()=>{curReg=c.dataset.r; renderRegion(); show('region');}; c.onclick=go; c.onkeydown=e=>{if(e.key==='Enter')go();}; });
  renderFindings(); renderGroupsMini();
}
function renderFindings(){
  const n=D.nat,l=D.lfl,a=ads(n.s),al=ads(l.s),lf=LFL(); const c=k=>lf.filter(b=>b.SG===k).length, cp=k=>lf.filter(b=>b.PG===k).length;
  const jogMl=lf.filter(b=>b.r==='JOGJA'&&b.SG==='MELEMAH DI SEP').length; const tt=lf.filter(b=>b.SG==='TURUN TERUS').map(b=>b.b.split(' - ')[1]);
  const both=lf.filter(b=>b.SD==='NAIK'&&b.PD==='NAIK').length, sNpT=lf.filter(b=>b.SD==='NAIK'&&b.PD==='TURUN').length;
  const t1=D.proNat[0], sk=D.skuNat[0];
  $('#finds').innerHTML=[
    ['--up',`<b>Sales nasional naik terus.</b> Sales per hari +${nf(g(a[1],a[0])*100,1)}% di Agustus dan ${P(g(a[2],a[1]))} di September.`],
    ['--g-st',`<b>Momentum organik melambat di September.</b> Untuk 119 branch LFL, sales per hari Sep hanya ${P(g(al[2],al[1]))} vs Agu. Sisa pertumbuhan datang dari Jakarta dan outlet baru.`],
    ['--promo',`<b>Promo makin besar.</b> Share promo ${P(n.p[0]/n.s[0],false)} → ${P(n.p[2]/n.s[2],false)}. TWIN dan BUNDLING = ${P((sum(D.mech.TWIN)+sum(D.mech.BUNDLING))/sum(n.p),false)} nilai promo.`],
    ['--r-jog',`<b>JOGJA perlu perhatian.</b> Region terbesar tapi share promo terkecil, dan ${jogMl} branch JOGJA melemah di September.`],
    ['--g-tt',`<b>Branch LFL:</b> ${c('NAIK TERUS')} naik terus, ${c('MULAI GROWTH')} mulai growth, ${c('STUCK')} stuck, ${c('MELEMAH DI SEP')} melemah di Sep, ${c('TURUN TERUS')} turun terus${tt.length?' ('+tt.join(', ')+')':''}.`],
    ['--g-mg',`<b>Sales × promo:</b> ${both} branch naik bersama; ${sNpT} branch sales naik tetapi promonya turun.`],
    ['--sales',`<b>Hero:</b> ${esc(sk[1])} = ${P(sk[7],false)} sales non-promo. ${esc(t1[1])} = ${P(t1[7],false)} nilai promo.`]
  ].map(f=>`<li style="--fc:var(${f[0]})">${f[1]}</li>`).join('');
}
function grpBar(el,field,list){
  const lf=LFL(); const tot=lf.length; let x=0;
  el.innerHTML=`<div style="display:flex;height:30px;border-radius:6px;overflow:hidden">`+list.map(k=>{ const n=lf.filter(b=>b[field]===k).length; if(!n) return '';
    const v=GV[k]; const bg=v?`var(--g-${v})`:'var(--g-na)'; return `<div data-g="${esc(k)}" data-f="${field}" data-tip="<b>${esc(k)}</b><br>${n} branch (${nf(n/tot*100,0)}%)" style="flex:${n};background:${bg};color:#fff;font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;min-width:0">${n>=3?n:''}</div>`; }).join('')+'</div>';
  el.querySelectorAll('[data-g]').forEach(d=>d.onclick=()=>{ mSel={[d.dataset.f==='SG'?'s':'p']:d.dataset.g}; renderTrend(); show('trend'); $('#mlTitle').scrollIntoView({block:'start'}); });
}
function renderGroupsMini(){ grpBar($('#grpS'),'SG',G); grpBar($('#grpP'),'PG',G.concat(GX));
  $('#lgGrp').innerHTML=G.map(k=>`<span><i style="background:var(--g-${GV[k]})"></i>${k}</span>`).join('')+`<span><i style="background:var(--g-na)"></i>Tanpa/sporadis promo</span>`; }
chipGroup('#natScope',v=>{natScope=v;renderRingkasan();});
// ---------- REGION
let curReg='JOGJA', regScope='all', idxM='s';
$('#regSel').innerHTML=['NASIONAL'].concat(REG).map(r=>`<button class="chip" data-v="${r}" aria-pressed="${r===curReg}">${r!=='NASIONAL'?`<span class="dot" style="background:var(${RV[r]})"></span>`:''}${r}</button>`).join('');
$$('#regSel .chip').forEach(c=>c.onclick=()=>{curReg=c.dataset.v; renderRegion();});
chipGroup('#regScope',v=>{regScope=v;renderRegion();}); chipGroup('#idxSel',v=>{idxM=v;renderRegion();});
function regData(r){ if(r==='NASIONAL') return regScope==='lfl'?D.lfl:D.nat; if(regScope==='lfl') return D.regl[r]||D.reg[r]; return D.reg[r]; }
function renderRegion(){
  $$('#regSel .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.v===curReg));
  const v=regData(curReg), A=ads(v.s), PA=ads(v.p), isNew=v.s[0]==null;
  const brs=D.br.filter(b=>(curReg==='NASIONAL'||b.r===curReg)&&(regScope==='all'||b.st==='LFL'));
  const lf=brs.filter(b=>b.st==='LFL');
  $('#regKpis').innerHTML=[
    ['Sales Q3',M(sum(v.s)),`${brs.length} branch${curReg==='JAKARTA'&&regScope==='lfl'?' (Jakarta belum punya LFL)':''}`],
    ['Δ sales/hari Jul → Sep',isNew?'baru':`<span class="${cls(g(A[2],A[0]))}">${P(g(A[2],A[0]))}</span>`,isNew?`Sep vs Agu ${P(g(A[2],A[1]))}`:pat(g(A[1],A[0]),g(A[2],A[1]))],
    ['Promo Q3',M(sum(v.p)),`Share ${P(sum(v.p)/sum(v.s),false)}`],
    ['Δ promo/hari Jul → Sep',isNew?'baru':`<span class="${cls(g(PA[2],PA[0]))}">${P(g(PA[2],PA[0]))}</span>`,isNew?'':pat(g(PA[1],PA[0]),g(PA[2],PA[1]))],
    ['Branch LFL naik terus',`${lf.filter(b=>b.SG==='NAIK TERUS').length} / ${lf.length}`,`Turun terus ${lf.filter(b=>b.SG==='TURUN TERUS').length} · melemah ${lf.filter(b=>b.SG==='MELEMAH DI SEP').length}`]
  ].map(k=>`<div class="kpi"><div class="eyebrow">${k[0]}</div><div class="v">${k[1]}</div><div class="d">${k[2]}</div></div>`).join('');
  $('#regTblTitle').textContent=`Ringkasan bulanan ${curReg}${regScope==='lfl'?' (LFL)':''}`;
  const rows=[['Sales',v.s,J],['Promo',v.p,J],['Non-promo',v.s.map((x,i)=>x==null?null:x-v.p[i]),J],['Share promo',v.s.map((x,i)=>x?v.p[i]/x:null),x=>P(x,false)],['Sales per hari',A,J],['Promo per hari',PA,J],['Paket promo terjual',v.q,x=>nf(x)],['Branch aktif',v.b,x=>nf(x)]];
  $('#regTbl').innerHTML=`<thead><tr><th>Metrik</th>${MONL.map(m=>`<th class="n">${m}</th>`).join('')}<th class="n">Δ Agu</th><th class="n">Δ Sep</th></tr></thead><tbody>`+
    rows.map((r,i)=>{ const x=r[1]; const isPct=i===3; const d1=isPct?(x[1]!=null&&x[0]!=null?(x[1]-x[0]):null):g(x[1],x[0]), d2=isPct?(x[2]-x[1]):g(x[2],x[1]);
      const fd=d=>d==null?'–':isPct?(d>0?'+':'')+nf(d*100,1)+' pp':`<span class="${cls(d)}">${P(d)}</span>`;
      return `<tr><td class="name">${r[0]}</td>${x.map(z=>`<td class="n">${r[2](z)}</td>`).join('')}<td class="n">${i>=6?'':fd(d1)}</td><td class="n">${i>=6?'':fd(d2)}</td></tr>`; }).join('')+'</tbody>';
  // index lines
  const ser=REG.filter(r=>r!=='JAKARTA').map(r=>{ const d=regScope==='lfl'?D.regl[r]:D.reg[r]; const a=ads(idxM==='s'?d.s:d.p); return {n:r,c:css(RV[r]),v:a.map(x=>x/a[0]*100)}; });
  const nd=regScope==='lfl'?D.lfl:D.nat, na=ads(idxM==='s'?nd.s:nd.p); ser.push({n:'NASIONAL',c:css('--faint'),v:na.map(x=>x/na[0]*100)});
  lines($('#chIdx'),MON,ser); $('#lgIdx').innerHTML='Jakarta tidak ditampilkan karena baru buka Agustus. Garis putus-putus = level Juli.';
  // mechanic
  const mr=curReg==='NASIONAL'?D.mech:(D.mechReg[curReg]||{}); const mk=MECH.filter(k=>mr[k]);
  stacked($('#chRegMech'),MONL,mk.map(k=>({n:k,c:css(MV[k]),v:mr[k].map(x=>x/1e6)})),{fmt:v=>nf(v,0),topFmt:(i,t)=>nf(t,0)+' jt'});
  const pt=sum(mk.map(k=>sum(mr[k]))); $('#lgRegMech').innerHTML=mk.map(k=>`<span><i style="background:var(${MV[k]})"></i>${k} ${P(sum(mr[k])/pt,false)}</span>`).join('');
  $('#regMechNote').textContent='Rp juta · tanpa Special Price';
  // branch bars
  const bb=brs.slice().sort((a,b)=>b.st3-a.st3);
  hbars($('#regBr'),bb.map(b=>({l:b.b.split(' - ')[1]+(b.st!=='LFL'?' ('+b.st+')':''),v:b.st3,k:b.b,click:true,c:GV[b.SG]?`var(--g-${GV[b.SG]})`:'var(--g-na)',
     tip:`<b>${esc(b.b)}</b><br>Sales Q3 ${J(b.st3)} · promo ${P(b.ps,false)}<br>Δ Jul→Sep ${P(b.d3)} · ${esc(b.SG)}`,lab:`${J(b.st3)} <span class="${cls(b.d3)}" style="font-size:11px">${b.st==='LFL'?P(b.d3):''}</span>`})));
  $$('#regBr [data-k]').forEach(d=>d.onclick=()=>openBranch(d.dataset.k,true));
  const sk=curReg==='NASIONAL'?D.skuNat:D.skuReg[curReg], pr=curReg==='NASIONAL'?D.proNat:D.proReg[curReg];
  hbars($('#regSku'),sk.slice(0,10).map(r=>({l:r[0]+'. '+r[1],v:r[3]+r[4]+r[5],tip:`<b>${esc(r[1])}</b><br>Share ${P(r[7],false)} · Δ ${P(r[8])}<br>${esc(r[9])}`,lab:`${J(r[3]+r[4]+r[5])} <span class="${cls(r[8])}" style="font-size:11px">${P(r[8])}</span>`})));
  hbars($('#regPro'),pr.slice(0,10).map(r=>({l:r[0]+'. '+r[1].replace('PROMO BUNDLING','BDL'),v:r[3]+r[4]+r[5],c:'var(--promo)',tip:`<b>${esc(r[1])}</b><br>${r[2]} · ${r[8]} outlet · share ${P(r[7],false)}<br>${esc(r[10])}`,lab:`${J(r[3]+r[4]+r[5])} <span class="muted" style="font-size:11px">${P(r[7],false)}</span>`})));
}
// ---------- BRANCH
let selBr=null;
$('#fReg').innerHTML='<option value="">Semua</option>'+REG.map(r=>`<option>${r}</option>`).join('');
function fillGroupSelects(){ $('#fSg').innerHTML='<option value="">Semua</option>'+G.map(k=>`<option>${k}</option>`).join(''); $('#fPg').innerHTML='<option value="">Semua</option>'+G.concat(GX).map(k=>`<option>${k}</option>`).join(''); }
fillGroupSelects();
['#fReg','#fSt','#fSg','#fPg'].forEach(s=>$(s).onchange=renderBranch); $('#fQ').oninput=renderBranch;
const brCols=[
  {h:'Branch',v:b=>b.b,cl:'name',f:b=>`<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(${RV[b.r]});margin-right:6px"></span>${esc(b.b.split(' - ')[1])}`},
  {h:'Region',v:b=>b.r},{h:'Status',v:b=>b.st},
  {h:'Sales Jul',n:1,v:b=>b.s[0],f:b=>J(b.s[0])},{h:'Sales Agu',n:1,v:b=>b.s[1],f:b=>J(b.s[1])},{h:'Sales Sep',n:1,v:b=>b.s[2],f:b=>J(b.s[2])},
  {h:'Total Q3',n:1,v:b=>b.st3,f:b=>`<b>${J(b.st3)}</b>`},{h:'Trend',v:b=>b.d3,f:b=>spark(ads(b.s),`var(${RV[b.r]})`)},
  {h:'Promo Q3',n:1,v:b=>b.pt3,f:b=>J(b.pt3)},{h:'Share promo',n:1,v:b=>b.ps,f:b=>P(b.ps,false)},
  {h:'Δ1',n:1,v:b=>b.d1,f:b=>b.st==='LFL'?`<span class="${cls(b.d1)}">${P(b.d1)}</span>`:'–'},{h:'Δ2',n:1,v:b=>b.d2,f:b=>b.st==='LFL'?`<span class="${cls(b.d2)}">${P(b.d2)}</span>`:'–'},
  {h:'Δ Jul→Sep',n:1,v:b=>b.st==='LFL'?b.d3:null,f:b=>b.st==='LFL'?`<b class="${cls(b.d3)}">${P(b.d3)}</b>`:'–'},
  {h:'Kelompok sales',v:b=>b.SG,f:b=>b.st==='LFL'?pill(b.SG):'<span class="muted small">–</span>'},
  {h:'Δ promo Jul→Sep',n:1,v:b=>b.st==='LFL'?b.q3:null,f:b=>b.st==='LFL'?`<span class="${cls(b.q3)}">${P(b.q3)}</span>`:'–'},
  {h:'Kelompok promo',v:b=>b.PG,f:b=>b.st==='LFL'?pill(b.PG):'<span class="muted small">–</span>'}];
function renderBranch(){
  const r=$('#fReg').value,s=$('#fSt').value,sg=$('#fSg').value,pg=$('#fPg').value,q=$('#fQ').value.trim().toUpperCase();
  const rows=D.br.filter(b=>(!r||b.r===r)&&(!s||(s==='X'?!['LFL','NEW'].includes(b.st):b.st===s))&&(!sg||b.SG===sg)&&(!pg||b.PG===pg)&&(!q||b.b.includes(q)));
  $('#brCount').textContent=`${rows.length} branch · sales ${M(sum(rows.map(b=>b.st3)))}`;
  table($('#brTbl'),brCols,rows,{onClick:k=>openBranch(k),key:b=>b.b,sel:selBr,initSort:[6,-1]});
}
function openBranch(k,jump){ selBr=k; const b=D.br.find(x=>x.b===k); if(!b) return; if(jump){ $('#fReg').value=''; $('#fSt').value=''; $('#fSg').value=''; $('#fPg').value=''; $('#fQ').value=''; show('branch'); }
  renderBranch(); const el=$('#brDetail'); const A=ads(b.s),PA=ads(b.p); const nm=b.b.split(' - ')[1];
  const mk=Object.entries(b.m||{}).sort((x,y)=>y[1]-x[1]); const sk=D.skuBr[b.b]||[], pr=D.proBr[b.b]||[];
  el.innerHTML=`<div class="detail"><div class="dhead"><div><div class="eyebrow">${b.r} · ${b.st}${b.st==='NEW'?' · mulai '+b.first:''}</div><h2>${esc(nm)}</h2></div>
   <div style="display:flex;gap:6px;flex-wrap:wrap">${b.st==='LFL'?`<span class="muted small">Sales</span>${patPill(b.SP)}<span class="muted small">Promo</span>${patPill(b.PP)}`:''}<button class="btnx" id="dClose">Tutup</button></div></div>
   <div class="mini">
     <div><span class="muted small">Sales Q3</span><b>${J(b.st3)}</b></div>
     <div><span class="muted small">Sales/hari Jul → Sep</span><b class="${cls(b.d3)}">${b.st==='LFL'?P(b.d3):'–'}</b></div>
     <div><span class="muted small">Promo Q3</span><b>${J(b.pt3)}</b></div>
     <div><span class="muted small">Share promo Jul → Sep</span><b>${P(b.s[0]?b.p[0]/b.s[0]:null,false)} → ${P(b.s[2]?b.p[2]/b.s[2]:null,false)}</b></div>
     <div><span class="muted small">Hari transaksi</span><b>${b.h.join(' / ')}</b></div></div>
   <div class="dgrid">
     <div style="min-width:0"><h3 style="margin-bottom:6px">Sales per bulan</h3><div id="dCh"></div>
       <h3 style="margin:10px 0 6px">Mekanik promo (Q3)</h3><div id="dMk">${mk.length?'':'<span class="muted small">Tidak ada promo bundling/twin.</span>'}</div></div>
     <div style="min-width:0"><h3 style="margin-bottom:6px">Top 20 hero SKU</h3><div class="tbl" style="max-height:340px"><table id="dSk"></table></div></div>
     <div style="min-width:0"><h3 style="margin-bottom:6px">Top 10 hero promo</h3>${pr.length?'<div class="tbl" style="max-height:340px"><table id="dPr"></table></div>':'<span class="muted small">Tidak ada data promo.</span>'}</div>
   </div></div>`;
  stacked($('#dCh'),MON,[{n:'Non-promo',c:css('--sales'),v:b.s.map((v,i)=>(v-b.p[i])/1e6)},{n:'Promo',c:css('--promo'),v:b.p.map(v=>v/1e6)}],{h:200,fmt:v=>nf(v,0),topFmt:(i,t)=>nf(t,0)+' jt'});
  if(mk.length) hbars($('#dMk'),mk.map(([k,v])=>({l:k,v,c:`var(${MV[k]})`,lab:`${J(v)} · ${P(v/b.pt3,false)}`})));
  table($('#dSk'),[{h:'#',n:1,v:r=>r[0]},{h:'Menu',v:r=>r[1],cl:'wrapc'},{h:'Q3',n:1,v:r=>r[3]+r[4]+r[5],f:r=>J(r[3]+r[4]+r[5])},{h:'Share',n:1,v:r=>r[7],f:r=>P(r[7],false)},{h:'Δ',n:1,v:r=>r[8],f:r=>`<span class="${cls(r[8])}">${P(r[8])}</span>`}],sk);
  if(pr.length) table($('#dPr'),[{h:'#',n:1,v:r=>r[0]},{h:'Paket',v:r=>r[1],cl:'wrapc'},{h:'Q3',n:1,v:r=>r[3]+r[4]+r[5],f:r=>J(r[3]+r[4]+r[5])},{h:'Qty',n:1,v:r=>r[6],f:r=>nf(r[6])},{h:'Status',v:r=>r[10],f:r=>`<span class="small">${esc(r[10])}</span>`}],pr);
  $('#dClose').onclick=()=>{selBr=null; el.innerHTML=''; renderBranch();};
  el.scrollIntoView({behavior:'smooth',block:'start'});
}
// ---------- TREND
let mSel=null, scRegs=new Set(['JOGJA','JATENG','JATIM','BALI']), grM='s';
chipGroup('#grSel',v=>{grM=v;renderTrend();});
$('#mlClear').onclick=()=>{mSel=null;renderTrend();};
function renderTrend(){
  const lf=LFL(); const GP=G.concat(GX);
  const nUp=lf.filter(b=>b.SD==='NAIK').length,nDn=lf.filter(b=>b.SD==='TURUN').length;
  $('#trKpis').innerHTML=[['Naik terus (sales)',lf.filter(b=>b.SG==='NAIK TERUS').length,'Δ1 dan Δ2 di atas ambang','--g-nt'],['Mulai growth (sales)',lf.filter(b=>b.SG==='MULAI GROWTH').length,'datar/turun di Agu, naik di Sep','--g-mg'],
    ['Stuck (sales)',lf.filter(b=>b.SG==='STUCK').length,'tidak bergerak dua periode','--g-st'],['Melemah di Sep (sales)',lf.filter(b=>b.SG==='MELEMAH DI SEP').length,'puncak Agu lalu turun','--g-ml'],
    ['Turun terus (sales)',lf.filter(b=>b.SG==='TURUN TERUS').length,'turun dua periode','--g-tt'],['Arah Jul → Sep',`${nUp} ↑ · ${nDn} ↓`,`${lf.length-nUp-nDn} stagnan`,'--sales']]
    .map(k=>`<div class="kpi" style="border-top:3px solid var(${k[3]})"><div class="eyebrow">${k[0]}</div><div class="v">${k[1]}</div><div class="d">${k[2]}</div></div>`).join('');
  const cols=GP.length+2; const m=$('#matrix'); m.style.gridTemplateColumns=`minmax(130px,1.4fr) repeat(${GP.length},minmax(62px,1fr)) minmax(54px,.6fr)`;
  let h=`<div class="hd" style="text-align:left">Sales ↓ / Promo →</div>`+GP.map(k=>`<div class="hd">${k.replace(' (JUL=0)','')}</div>`).join('')+'<div class="hd">Total</div>';
  const mx=Math.max(1,...G.flatMap(s=>GP.map(p=>lf.filter(b=>b.SG===s&&b.PG===p).length)));
  G.forEach(s=>{ h+=`<div class="rh" style="background:var(--g-${GV[s]}-bg);color:var(--g-${GV[s]})">${s}</div>`;
    GP.forEach(p=>{ const n=lf.filter(b=>b.SG===s&&b.PG===p).length; const on=mSel&&mSel.s===s&&mSel.p===p;
      h+= n?`<div class="cell ${on?'on':''}" tabindex="0" data-s="${s}" data-p="${p}" data-tip="Sales <b>${s}</b> · Promo <b>${p}</b><br>${n} branch" style="background:color-mix(in srgb,var(--accent) ${12+n/mx*60}%,var(--surface));color:${n/mx>.55?'#fff':'var(--ink)'}">${n}</div>`:`<div class="cell z">·</div>`; });
    h+=`<div class="cell" tabindex="0" data-s="${s}" style="background:var(--surface2)">${lf.filter(b=>b.SG===s).length}</div>`; });
  h+=`<div class="rh" style="background:var(--surface2)">Total</div>`+GP.map(p=>`<div class="cell" tabindex="0" data-p="${p}" style="background:var(--surface2)">${lf.filter(b=>b.PG===p).length}</div>`).join('')+`<div class="cell" style="background:var(--surface2)">${lf.length}</div>`;
  m.innerHTML=h;
  m.querySelectorAll('.cell[data-s],.cell[data-p]').forEach(c=>{ const go=()=>{ mSel={s:c.dataset.s,p:c.dataset.p}; renderTrend(); $('#mlTitle').scrollIntoView({behavior:'smooth',block:'start'}); }; c.onclick=go; c.onkeydown=e=>{if(e.key==='Enter')go();}; });
  const t=nf(T*100,0);
  $('#grpDef').innerHTML=`Δ1 = sales/hari Agu vs Jul, Δ2 = Sep vs Agu. <b>Naik terus</b>: keduanya &gt; +${t}% · <b>Naik lalu stabil</b>: naik lalu datar · <b>Mulai growth</b>: datar/turun lalu naik · <b>Stuck</b>: datar–datar atau turun lalu datar · <b>Melemah di Sep</b>: naik/datar lalu turun · <b>Turun terus</b>: keduanya &lt; −${t}%.`;
  let list=lf, title='Semua branch LFL';
  if(mSel){ list=lf.filter(b=>(!mSel.s||b.SG===mSel.s)&&(!mSel.p||b.PG===mSel.p)); title=[mSel.s?'Sales '+mSel.s:'',mSel.p?'Promo '+mSel.p:''].filter(Boolean).join(' · '); }
  $('#mlTitle').textContent=`${title} (${list.length} branch)`;
  table($('#mlTbl'),[brCols[0],brCols[1],{h:'Sales Jul',n:1,v:b=>b.s[0],f:b=>J(b.s[0])},{h:'Sales Sep',n:1,v:b=>b.s[2],f:b=>J(b.s[2])},brCols[10],brCols[11],brCols[12],
    {h:'Pola sales',v:b=>b.SP,f:b=>patPill(b.SP)},{h:'Δ1 promo',n:1,v:b=>b.q1,f:b=>`<span class="${cls(b.q1)}">${P(b.q1)}</span>`},{h:'Δ2 promo',n:1,v:b=>b.q2,f:b=>`<span class="${cls(b.q2)}">${P(b.q2)}</span>`},brCols[14],{h:'Pola promo',v:b=>b.PP,f:b=>patPill(b.PP)},{h:'Share promo',n:1,v:b=>b.ps,f:b=>P(b.ps,false)}],
    list,{onClick:k=>openBranch(k,true),key:b=>b.b,initSort:[6,-1]});
  // scatter
  $('#scReg').innerHTML=['JOGJA','JATENG','JATIM','BALI'].map(r=>`<button class="chip" data-v="${r}" aria-pressed="${scRegs.has(r)}"><span class="dot" style="background:var(${RV[r]})"></span>${r}</button>`).join('');
  $$('#scReg .chip').forEach(c=>c.onclick=()=>{ scRegs.has(c.dataset.v)?scRegs.delete(c.dataset.v):scRegs.add(c.dataset.v); renderTrend(); });
  scatter(); groupsByRegion(); quad(); newTbl();
}
function scatter(){
  const W=560,H=380,pl=46,pr=12,pt=14,pb=34, xmn=-60,xmx=160,ymn=-100,ymx=300;
  const X=v=>pl+(W-pl-pr)*(Math.max(xmn,Math.min(xmx,v))-xmn)/(xmx-xmn), Y=v=>pt+(H-pt-pb)*(1-(Math.max(ymn,Math.min(ymx,v))-ymn)/(ymx-ymn));
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img"><g class="grid">`;
  for(let v=-50;v<=150;v+=50) s+=`<line x1="${X(v)}" x2="${X(v)}" y1="${pt}" y2="${H-pb}"/><text x="${X(v)}" y="${H-pb+14}" text-anchor="middle">${v}%</text>`;
  for(let v=-100;v<=300;v+=100) s+=`<line x1="${pl}" x2="${W-pr}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${pl-6}" y="${Y(v)+4}" text-anchor="end">${v}%</text>`;
  s+=`</g><rect x="${X(-T*100)}" y="${pt}" width="${X(T*100)-X(-T*100)}" height="${H-pt-pb}" fill="var(--line2)" opacity=".7"/><rect x="${pl}" y="${Y(T*100)}" width="${W-pl-pr}" height="${Y(-T*100)-Y(T*100)}" fill="var(--line2)" opacity=".7"/>`;
  s+=`<text x="${W-pr-4}" y="${pt+12}" text-anchor="end" style="fill:var(--up);font-weight:700">Sales ↑ Promo ↑</text><text x="${pl+4}" y="${pt+12}" style="fill:var(--flat);font-weight:700">Sales ↓ Promo ↑</text>
   <text x="${W-pr-4}" y="${H-pb-6}" text-anchor="end" style="fill:var(--flat);font-weight:700">Sales ↑ Promo ↓</text><text x="${pl+4}" y="${H-pb-6}" style="fill:var(--down);font-weight:700">Sales ↓ Promo ↓</text>
   <text x="${(W+pl)/2}" y="${H-4}" text-anchor="middle">Δ sales per hari Sep vs Jul</text>`;
  const pts=LFL().filter(b=>scRegs.has(b.r)&&b.q3!=null&&isFinite(b.q3)).sort((a,b)=>b.st3-a.st3);
  pts.forEach(b=>{ const r=3+Math.sqrt(b.st3/1e9)*3.4; const cut=(b.q3*100>ymx||b.d3*100>xmx)?' (di luar skala)':'';
    s+=`<circle cx="${X(b.d3*100)}" cy="${Y(b.q3*100)}" r="${r}" fill="var(${RV[b.r]})" fill-opacity=".72" stroke="var(--surface)" stroke-width="1" style="cursor:pointer" data-k="${esc(b.b)}"
      data-tip="<b>${esc(b.b)}</b><br>Sales ${P(b.d3)} · Promo ${P(b.q3)}${cut}<br>Sales Q3 ${J(b.st3)}<br>${esc(b.SG)} / ${esc(b.PG)}"/>`;
    if(b.d3<-T||b.q3<-.4||b.d3>.9){ const cx=X(b.d3*100), rt=cx>W-110; s+=`<text x="${rt?cx-r-2:cx+r+2}" y="${Y(b.q3*100)+3}" text-anchor="${rt?'end':'start'}" style="font-size:9.5px">${esc(b.b.split(' - ')[1])}</text>`; } });
  $('#chSc').innerHTML=s+'</svg>'; $$('#chSc circle[data-k]').forEach(c=>c.onclick=()=>openBranch(c.dataset.k,true));
}
function groupsByRegion(){
  const lf=LFL(), f=grM==='s'?'SG':'PG', list=grM==='s'?G:G.concat(GX); const regs=['JOGJA','JATENG','JATIM','BALI'];
  const W=560,rowH=40,pl=70,pr=10,H=regs.length*rowH+10; const mx=Math.max(...regs.map(r=>lf.filter(b=>b.r===r).length));
  let s=`<svg viewBox="0 0 ${W} ${H}" width="100%" role="img">`;
  regs.forEach((r,i)=>{ let x=pl; const y=6+i*rowH; s+=`<text x="${pl-8}" y="${y+18}" text-anchor="end" class="lbl">${r}</text>`;
    list.forEach(k=>{ const n=lf.filter(b=>b.r===r&&b[f]===k).length; if(!n) return; const w=(W-pl-pr)*n/mx; const c=GV[k]?`var(--g-${GV[k]})`:'var(--g-na)';
      s+=`<rect x="${x}" y="${y}" width="${w-1}" height="26" fill="${c}" rx="2" data-tip="<b>${r} · ${esc(k)}</b><br>${n} branch" style="cursor:pointer" data-r="${r}" data-g="${esc(k)}"/>`;
      if(w>18) s+=`<text x="${x+w/2}" y="${y+17}" text-anchor="middle" style="fill:#fff;font-weight:700;pointer-events:none">${n}</text>`; x+=w; }); });
  $('#chGr').innerHTML=s+'</svg>';
  $$('#chGr rect[data-g]').forEach(c=>c.onclick=()=>{ $('#fReg').value=c.dataset.r; $('#fSt').value='LFL'; $('#fSg').value=grM==='s'?c.dataset.g:''; $('#fPg').value=grM==='p'?c.dataset.g:''; $('#fQ').value=''; renderBranch(); show('branch'); });
  $('#lgGr2').innerHTML=list.map(k=>`<span><i style="background:${GV[k]?`var(--g-${GV[k]})`:'var(--g-na)'}"></i>${k}</span>`).join('');
}
function quad(){ const lf=LFL(); const S=['NAIK','STAGNAN','TURUN'], Pp=['NAIK','STAGNAN','TURUN','N/A'];
  const act={'NAIK|NAIK':'Pertahankan & scale','NAIK|x':'Cek eksekusi promo','x|NAIK':'Promo tidak angkat sales','x|x':'Prioritas evaluasi'};
  $('#quad').innerHTML=`<div class="tbl" style="max-height:none"><table><thead><tr><th>Sales \\ Promo</th>${Pp.map(p=>`<th class="n">${p}</th>`).join('')}</tr></thead><tbody>`+
   S.map(s=>`<tr><td class="name">${dirPill(s)}</td>${Pp.map(p=>{ const n=lf.filter(b=>b.SD===s&&b.PD===p).length; const a=act[(s==='NAIK'?'NAIK':'x')+'|'+(p==='NAIK'?'NAIK':'x')];
     return `<td class="n" ${n?`data-tip="${a}" style="cursor:pointer" data-s="${s}" data-p="${p}"`:''}><b>${n||'·'}</b></td>`; }).join('')}</tr>`).join('')+'</tbody></table></div>'+
   `<div class="muted small" style="margin-top:6px">Klik angka untuk membuka daftar. Arah memakai Δ sales per hari Sep vs Jul.</div>`;
  $$('#quad td[data-s]').forEach(td=>td.onclick=()=>{ const lfx=LFL().filter(b=>b.SD===td.dataset.s&&b.PD===td.dataset.p);
    mSel=null; $('#mlTitle').textContent=`Sales ${td.dataset.s} · Promo ${td.dataset.p} (${lfx.length} branch)`;
    table($('#mlTbl'),[brCols[0],brCols[1],brCols[6],brCols[12],brCols[13],brCols[14],brCols[15],{h:'Share promo',n:1,v:b=>b.ps,f:b=>P(b.ps,false)}],lfx,{onClick:k=>openBranch(k,true),key:b=>b.b,initSort:[3,1]});
    $('#mlTitle').scrollIntoView({behavior:'smooth',block:'start'}); }); }
function newTbl(){ const rows=D.br.filter(b=>b.st!=='LFL');
  table($('#newTbl'),[brCols[0],brCols[1],{h:'Status',v:b=>b.st},{h:'Mulai',v:b=>b.first},{h:'Hari Agu / Sep',v:b=>b.h[2],f:b=>b.h[1]+' / '+b.h[2]},
   {h:'Sales Agu',n:1,v:b=>b.s[1],f:b=>J(b.s[1])},{h:'Sales Sep',n:1,v:b=>b.s[2],f:b=>J(b.s[2])},
   {h:'Per hari aktif Agu',n:1,v:b=>b.h[1]?b.s[1]/b.h[1]:null,f:b=>b.h[1]?J(b.s[1]/b.h[1]):'–'},{h:'Per hari aktif Sep',n:1,v:b=>b.h[2]?b.s[2]/b.h[2]:null,f:b=>b.h[2]?J(b.s[2]/b.h[2]):'–'},
   {h:'Ramp-up',n:1,v:b=>b.h[1]&&b.h[2]?(b.s[2]/b.h[2])/(b.s[1]/b.h[1])-1:null,f:b=>{const v=b.h[1]&&b.h[2]?(b.s[2]/b.h[2])/(b.s[1]/b.h[1])-1:null; return v==null?(b.h[2]?'buka Sep':'–'):`<b class="${cls(v)}">${P(v)}</b>`;}},
   {h:'Share promo',n:1,v:b=>b.ps,f:b=>P(b.ps,false)}],rows,{onClick:k=>openBranch(k,true),key:b=>b.b,initSort:[6,-1]}); }
// ---------- SKU & PROMO
function scopeOpts(sel){ $(sel).innerHTML='<option value="N">Nasional</option><optgroup label="Region">'+REG.map(r=>`<option value="R:${r}">${r}</option>`).join('')+'</optgroup>'+
  REG.map(r=>`<optgroup label="Branch ${r}">`+D.br.filter(b=>b.r===r).sort((a,c)=>a.b.localeCompare(c.b)).map(b=>`<option value="B:${esc(b.b)}">${esc(b.b.split(' - ')[1])}</option>`).join('')+'</optgroup>').join(''); }
scopeOpts('#skScope'); scopeOpts('#prScope');
let skHs='';
$('#skHs').innerHTML=['','HERO KONSISTEN','HERO BARU / NAIK','HERO FLUKTUATIF','KELUAR DARI TOP'].map(k=>`<button class="chip" data-v="${k}" aria-pressed="${k===''}">${k||'Semua status'}</button>`).join('');
chipGroup('#skHs',v=>{skHs=v;renderSku();}); $('#skScope').onchange=renderSku; $('#skQ').oninput=renderSku;
function renderSku(){ const sc=$('#skScope').value; let data,label,tot;
  if(sc==='N'){data=D.skuNat;label='Nasional';} else if(sc.startsWith('R:')){data=D.skuReg[sc.slice(2)];label=sc.slice(2);} else {data=D.skuBr[sc.slice(2)]||[];label=sc.slice(2);}
  const q=$('#skQ').value.trim().toUpperCase(); const rows=data.filter(r=>(!skHs||r[10]===skHs)&&(!q||r[1].includes(q)));
  const top=data.length; const cum=sum(data.map(r=>r[7]));
  $('#skKpi').innerHTML=`<div><span class="muted small">Cakupan</span><b>${esc(label.replace('DTG ',''))}</b></div><div><span class="muted small">Top ${top} SKU = sales non-promo</span><b>${P(cum,false)}</b></div>
    <div><span class="muted small">Hero konsisten</span><b>${data.filter(r=>r[10]==='HERO KONSISTEN').length} / ${top}</b></div><div><span class="muted small">Tumbuh &gt; ambang</span><b class="up">${data.filter(r=>r[8]>T).length}</b></div>`;
  hbars($('#chSku'),data.slice(0,15).map(r=>({l:r[0]+'. '+r[1],v:r[3]+r[4]+r[5],tip:`<b>${esc(r[1])}</b><br>${esc(r[2])} · ${r[11]} outlet<br>${esc(r[9])} · ${esc(r[10])}`,lab:`${J(r[3]+r[4]+r[5])} <span class="${cls(r[8])}" style="font-size:11px">${P(r[8])}</span>`})));
  const cols=[{h:'#',n:1,v:r=>r[0]},{h:'Menu',v:r=>r[1],cl:'name'},{h:'Detail',v:r=>r[2]},{h:'Jul',n:1,v:r=>r[3],f:r=>J(r[3])},{h:'Agu',n:1,v:r=>r[4],f:r=>J(r[4])},{h:'Sep',n:1,v:r=>r[5],f:r=>J(r[5])},
    {h:'Total Q3',n:1,v:r=>r[3]+r[4]+r[5],f:r=>`<b>${J(r[3]+r[4]+r[5])}</b>`},{h:'Qty',n:1,v:r=>r[6],f:r=>nf(r[6])},{h:'Share',n:1,v:r=>r[7],f:r=>P(r[7],false)},
    {h:'Δ Jul→Sep',n:1,v:r=>r[8],f:r=>`<span class="${cls(r[8])}">${P(r[8])}</span>`},{h:'Pola',v:r=>r[9],f:r=>patPill(r[9])},{h:'Status hero',v:r=>r[10],f:r=>`<span class="small">${esc(r[10])}</span>`},{h:'Outlet',n:1,v:r=>r[11]}];
  if(sc==='N') cols.push({h:'Qty via promo',n:1,v:r=>r[12],f:r=>nf(r[12])});
  table($('#skTbl'),cols,rows);
  $('#skNote').textContent=sc.startsWith('B:')?'Per branch ditampilkan top 20. Top 50 per branch ada di Excel sheet 3C.':'“Qty via promo” = unit SKU yang keluar sebagai isi paket promo (hanya nasional).';
}
let prM='';
$('#prMech').innerHTML=[''].concat(MECH).map(k=>`<button class="chip" data-v="${k}" aria-pressed="${k===''}">${k?`<span class="dot" style="background:var(${MV[k]})"></span>`:''}${k||'Semua mekanik'}</button>`).join('');
chipGroup('#prMech',v=>{prM=v;renderPro();}); $('#prScope').onchange=renderPro; $('#prQ').oninput=renderPro;
function renderPro(){ const sc=$('#prScope').value; let data,label;
  if(sc==='N'){data=D.proNat;label='Nasional';} else if(sc.startsWith('R:')){data=D.proReg[sc.slice(2)];label=sc.slice(2);} else {data=D.proBr[sc.slice(2)]||[];label=sc.slice(2);}
  const q=$('#prQ').value.trim().toUpperCase(); const rows=data.filter(r=>(!prM||r[2]===prM)&&(!q||r[1].includes(q)));
  const b=sc.startsWith('B:')?D.br.find(x=>x.b===sc.slice(2)):null;
  $('#prKpi').innerHTML=`<div><span class="muted small">Cakupan</span><b>${esc(label.replace('DTG ',''))}</b></div><div><span class="muted small">Top ${data.length} paket = nilai promo</span><b>${P(sum(data.map(r=>r[7])),false)}</b></div>
    <div><span class="muted small">Top 1</span><b style="font-size:13px;line-height:1.25">${data[0]?esc(data[0][1]):'–'}</b></div><div><span class="muted small">${sc==='N'?'Paket aktif Q3':'Naik terus'}</span><b>${sc==='N'?D.proCount:data.filter(r=>r[10]==='NAIK TERUS').length}</b></div>`;
  hbars($('#chPro'),rows.slice(0,15).map(r=>({l:r[0]+'. '+r[1].replace('PROMO BUNDLING','BDL'),v:r[3]+r[4]+r[5],c:`var(${MV[r[2]]})`,tip:`<b>${esc(r[1])}</b><br>${r[2]} · ${r[8]} outlet · ${nf(r[6])} paket<br>${esc(r[10])}`,lab:`${J(r[3]+r[4]+r[5])} <span class="muted" style="font-size:11px">${P(r[7],false)}</span>`})));
  table($('#prTbl'),[{h:'#',n:1,v:r=>r[0]},{h:'Paket promo',v:r=>r[1],cl:'wrapc'},{h:'Mekanik',v:r=>r[2],f:r=>`<span class="small"><span class="dot" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(${MV[r[2]]});margin-right:5px"></span>${r[2]}</span>`},
    {h:'Jul',n:1,v:r=>r[3],f:r=>J(r[3])},{h:'Agu',n:1,v:r=>r[4],f:r=>J(r[4])},{h:'Sep',n:1,v:r=>r[5],f:r=>J(r[5])},{h:'Total Q3',n:1,v:r=>r[3]+r[4]+r[5],f:r=>`<b>${J(r[3]+r[4]+r[5])}</b>`},
    {h:'Qty',n:1,v:r=>r[6],f:r=>nf(r[6])},{h:'Share',n:1,v:r=>r[7],f:r=>P(r[7],false)},{h:'Outlet',n:1,v:r=>r[8]},{h:'Δ Jul→Sep',n:1,v:r=>r[9],f:r=>`<span class="${cls(r[9])}">${P(r[9])}</span>`},{h:'Pola / status',v:r=>r[10],f:r=>/BARU|BERHENTI/.test(r[10])?`<span class="pill" style="background:var(--g-na-bg);color:var(--muted)">${esc(r[10])}</span>`:patPill(r[10])}],rows);
}
// ---------- init
function all(){ classify(); renderRingkasan(); renderRegion(); renderBranch(); renderTrend(); renderSku(); renderPro(); if(selBr) openBranch(selBr); }
$('#thr').oninput=e=>{ T=e.target.value/100; $('#thrv').textContent='±'+e.target.value+'%'; all(); };
all();
const h=(location.hash||'').slice(1); if(['ringkasan','region','branch','trend','sku','promo'].includes(h)) show(h);
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',all);
new MutationObserver(all).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
})();
