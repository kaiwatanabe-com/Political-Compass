// app.js (final, single file)
// - Preview fixed via offscreen axes cache (no ghosting)
// - Sticky Likert header docks under the top bar
// - Result card fully localized (EN/JA) with quadrant annotations + localized watermark
// - No chart PNG download / no custom background / no watermark on preview chart
// - Adds a floating high-visibility "Save Result Card" button (styles injected here)

/* -------------------- App state -------------------- */
const state = {
  lang: localStorage.getItem("pc_lang") || "en",
  answers: {},
  sectionIndex: 0
};
let lastScores = { x: NaN, y: NaN };

/* -------------------- Elements -------------------- */
const tabsEl = document.getElementById('tabs');
const sectionsEl = document.getElementById('sections');
const progressBar = document.getElementById('progressBar');
const methodPanel = document.getElementById('methodPanel');
const methodToggle = document.getElementById('methodToggle');
const topbar = document.querySelector('.topbar');

const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d', { alpha: true });

/* -------------------- Offscreen axes cache -------------------- */
let axesCache = null;           // HTMLCanvasElement
let axesCacheLang = '';
let axesCacheW = 0;             // CSS px
let axesCacheH = 0;             // CSS px

function buildAxesCache(w, h, lang){
  const dpr = window.devicePixelRatio || 1;
  axesCache = document.createElement('canvas');
  axesCache.width  = Math.max(1, Math.round(w * dpr));
  axesCache.height = Math.max(1, Math.round(h * dpr));
  axesCacheW = w; axesCacheH = h; axesCacheLang = lang;

  const ac = axesCache.getContext('2d');
  ac.scale(dpr, dpr);

  // grid
  ac.strokeStyle = '#263041'; ac.lineWidth = 1;
  for(let i=0;i<=10;i++){
    const t=i/10, gx=Math.round(t*w), gy=Math.round(t*h);
    ac.beginPath(); ac.moveTo(gx,0); ac.lineTo(gx,h); ac.stroke();
    ac.beginPath(); ac.moveTo(0,gy); ac.lineTo(w,gy); ac.stroke();
  }
  // axes
  ac.strokeStyle = '#3b4a61'; ac.lineWidth = 2;
  ac.beginPath(); ac.moveTo(0,h/2); ac.lineTo(w,h/2); ac.stroke();
  ac.beginPath(); ac.moveTo(w/2,0); ac.lineTo(w/2,h); ac.stroke();

  // labels
  ac.fillStyle = '#b9c7d8'; ac.font = '12px system-ui'; ac.textAlign='center';
  ac.fillText(lang==='ja' ? '公共介入重視（−）' : 'Economic Left (−)', 60, h/2 - 10);
  ac.fillText(lang==='ja' ? '市場重視（＋）' : 'Economic Right (+)', w-70, h/2 - 10);

  ac.textAlign = 'left';
  ac.fillText(lang==='ja' ? '権威主義 (−)' : 'Authoritarian (−)', 6, 14);
  ac.textAlign = 'right';
  ac.fillText(lang==='ja' ? '自由主義 (+)' : 'Libertarian (+)', w-6, h-6);

  // ticks
  ac.fillStyle = '#8fa0b4'; ac.textAlign='center';
  [-100,-50,0,50,100].forEach(val=>{
    const px = w/2 + (val/100)*(w/2);
    const py = h/2 - (val/100)*(h/2);
    ac.fillText(val.toString(), px, h/2 + (val===0?24:18));
    ac.fillText(val.toString(), w/2, py + (val===100? -6: 4));
  });

  // origin
  ac.fillStyle = '#8898aa';
  ac.beginPath(); ac.arc(w/2, h/2, 3, 0, Math.PI*2); ac.fill();
}

/* -------------------- Sticky offset -------------------- */
function updateStickyOffset(){
  const topbarH = topbar ? Math.ceil(topbar.getBoundingClientRect().height) : 0;
  const methodH = methodPanel && !methodPanel.hasAttribute('hidden')
    ? Math.ceil(methodPanel.getBoundingClientRect().height) + 8
    : 0;
  document.documentElement.style.setProperty('--stickyTop', (topbarH + methodH + 8) + 'px');
}

/* -------------------- Build UI -------------------- */
function buildUI(){
  tabsEl.innerHTML = "";
  sectionsEl.innerHTML = "";

  BANK.forEach((s, idx)=>{
    // Tab
    const tab = document.createElement('button');
    tab.className = 'tab';
    tab.dataset.index = idx;
    const title = s.title[state.lang] || s.title.en;
    tab.innerHTML = `${title} <span class="badge"></span>`;
    tab.onclick = ()=> setSection(idx);
    tabsEl.appendChild(tab);

    // Section
    const sec = document.createElement('section');
    sec.className = 'section card';
    sec.dataset.key = s.key;

    // Sticky Likert header
    const lh = document.createElement('div');
    lh.className = 'likert-head';
    lh.innerHTML = `
      <div class="likert-grid">
        <h4>${title}</h4>
        ${Array.from({length:9}, (_,i)=>`<div class="muted" style="text-align:center">${i+1}</div>`).join('')}
        <div class="labels"><span>${t('scale_left')}</span><span>${t('scale_neutral')}</span><span>${t('scale_right')}</span></div>
      </div>`;
    sec.appendChild(lh);

    // Questions
    s.items.forEach(([id, textObj, reverse])=>{
      const row = document.createElement('div');
      row.className = 'q';
      const text = textObj[state.lang] || textObj.en;
      row.dataset.id = id;
      row.innerHTML = `
        <p><strong>${id}</strong> ${escapeHtml(text)} ${reverse?'<small class="muted">(R)</small>':''}</p>
        ${Array.from({length:9}, (_,i)=>`<label style="display:flex;justify-content:center"><input type="radio" name="${id}" value="${i+1}"></label>`).join('')}
      `;
      row.addEventListener('change', (e)=>{
        if(e.target && e.target.name===id){
          state.answers[id] = parseInt(e.target.value,10);
          updateProgress();
        }
      });
      sec.appendChild(row);
    });

    sectionsEl.appendChild(sec);
  });

  // Restore radios
  for(const [id, v] of Object.entries(state.answers)){
    const input = sectionsEl.querySelector(`input[name="${id}"][value="${v}"]`);
    if(input) input.checked = true;
  }

  setSection(state.sectionIndex);
  updateProgress();
  if (typeof updateAbout === 'function') updateAbout();
  updateStickyOffset();
}

/* -------------------- Helpers -------------------- */
function t(key){
  const pack = I18N[state.lang] || I18N.en;
  const val = pack[key];
  return typeof val === 'string' ? val : key;
}
function escapeHtml(s){ return s.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function setSection(i){
  state.sectionIndex = i;
  document.querySelectorAll('.tab').forEach((el,idx)=>{
    el.classList.toggle('active', idx===i);
    const s = BANK[idx];
    const ids = s.items.map(([id])=>id);
    const answered = ids.filter(id=> state.answers[id]!=null).length;
    const badge = el.querySelector('.badge');
    if(badge) badge.textContent = (I18N[state.lang].section_counts || I18N.en.section_counts)(answered, ids.length);
  });
  document.querySelectorAll('.section').forEach((el,idx)=>{
    el.classList.toggle('active', idx===i);
  });
  updateProgress();
  window.scrollTo({top:0,behavior:'smooth'});
  updateStickyOffset();
}

/* -------------------- Progress -------------------- */
function updateProgress(){
  const total = BANK.reduce((n,s)=> n + s.items.filter(([id])=>!id.startsWith('AC')).length, 0);
  const answered = Object.entries(state.answers).filter(([k])=>!k.startsWith('AC')).length;
  progressBar.style.width = (total ? Math.round((answered/total)*100) : 0) + "%";
  const answeredEl = document.getElementById('answered');
  if(answeredEl) answeredEl.textContent = `${answered}`;
}

/* -------------------- Nav & actions -------------------- */
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
if(prevBtn) prevBtn.onclick = ()=> setSection(Math.max(0, state.sectionIndex-1));
if(nextBtn) nextBtn.onclick = ()=> setSection(Math.min(BANK.length-1, state.sectionIndex+1));

const saveBtn = document.getElementById('saveBtn');
const loadBtn = document.getElementById('loadBtn');
const resetBtn = document.getElementById('resetBtn');

if(saveBtn) saveBtn.onclick = ()=>{
  localStorage.setItem('pc_answers', JSON.stringify(state.answers));
  localStorage.setItem('pc_lang', state.lang);
  alert(state.lang==='ja' ? '保存しました。' : 'Saved locally.');
};
if(loadBtn) loadBtn.onclick = ()=>{
  const raw = localStorage.getItem('pc_answers');
  if(!raw){ alert(state.lang==='ja' ? '保存データがありません。' : 'No saved progress.'); return; }
  try{
    state.answers = JSON.parse(raw)||{};
    buildUI();
    alert(state.lang==='ja' ? '読み込みました。' : 'Loaded.');
  }catch(e){ alert(state.lang==='ja' ? '読み込みに失敗しました。' : 'Failed to load.'); }
};
if(resetBtn) resetBtn.onclick = ()=>{
  if(confirm(state.lang==='ja' ? 'すべての回答を消去しますか？' : 'Clear all answers?')){
    state.answers = {}; buildUI(); scheduleDraw();
  }
};

/* -------------------- Language segmented control -------------------- */
document.querySelectorAll('.lang-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    state.lang = btn.dataset.lang;
    localStorage.setItem('pc_lang', state.lang);
    document.querySelectorAll('.lang-btn').forEach(b=>{
      const active = b===btn;
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', active ? 'true':'false');
    });
    const title = document.getElementById('appTitle');
    if(title) title.textContent = state.lang==='ja' ? '政治コンパス — 80項目サーベイ' : 'Political Compass — 80-Item Survey';
    translateStatic();
    buildUI();
    axesCache = null; // force rebuild for new language
    scheduleDraw();
  });
});

function translateStatic(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const pack = I18N[state.lang] || I18N.en;
    if(typeof pack[key] === 'string'){ el.textContent = pack[key]; }
  });
  const scale = document.getElementById('scaleLabel');
  if(scale){
    scale.textContent =
      state.lang==='ja' ? '1 = 強い反対 · 5 = 中立 · 9 = 強い賛成'
                        : '1 = Strongly Disagree · 5 = Neutral · 9 = Strongly Agree';
  }
}
translateStatic();

/* -------------------- Method toggle -------------------- */
if(methodToggle){
  methodToggle.addEventListener('click', ()=>{
    methodPanel.toggleAttribute('hidden');
    updateStickyOffset();
  });
}

/* -------------------- Scoring -------------------- */
const rev = v => 10 - v;
const mean = arr => arr.length? arr.reduce((a,b)=>a+b,0)/arr.length : NaN;
const toScaled = m => isNaN(m) ? NaN : Math.max(-100, Math.min(100, ((m - 5) / 4) * 100));

function collect(sectionKey){
  const s = BANK.find(x=> x.key===sectionKey);
  const vals = [];
  for(const [id, _t, isR] of s.items){
    if(id.startsWith('AC')) continue;
    const v = state.answers[id];
    if(v!=null){ vals.push(isR ? rev(v) : v); }
  }
  return vals;
}

function compute(){
  const xVals = collect('economic');
  const yCoreVals = collect('social');
  const ySecVals = collect('security');

  const x = toScaled(mean(xVals));
  const yCore = toScaled(mean(yCoreVals));
  const ySec = toScaled(mean(ySecVals));
  const y = toScaled(mean([...yCoreVals, ...ySecVals]));

  const xEl = document.getElementById('xScore');
  const yEl = document.getElementById('yScore');
  const yCoreEl = document.getElementById('sCore');
  const ySecEl = document.getElementById('sSec');

  if(xEl) xEl.textContent = `X: ${isNaN(x) ? '–' : x.toFixed(1)}`;
  if(yEl) yEl.textContent = `Y: ${isNaN(y) ? '–' : y.toFixed(1)}`;
  if(yCoreEl) yCoreEl.textContent = `Y-Core: ${isNaN(yCore) ? '–' : yCore.toFixed(1)}`;
  if(ySecEl) ySecEl.textContent = `Y-Security: ${isNaN(ySec) ? '–' : ySec.toFixed(1)}`;

  lastScores = { x, y };
  scheduleDraw();
  return {x,y,yCore,ySec};
}

const computeBtn = document.getElementById('compute');
if(computeBtn) computeBtn.onclick = compute;

/* -------------------- Canvas drawing (RAF + cached axes) -------------------- */
let rafId = null;
function scheduleDraw(){
  if(rafId !== null) return;
  rafId = requestAnimationFrame(()=>{
    rafId = null;
    resizeCanvasToContainer();
    drawOnce(lastScores.x, lastScores.y);
  });
}

let resizeBound = false;
function bindResizeOnce(){
  if(resizeBound) return;
  resizeBound = true;
  window.addEventListener('resize', ()=>{
    axesCache = null;            // size changed => rebuild cache
    scheduleDraw();
  }, { passive: true });
}

function resizeCanvasToContainer(){
  const wrap = document.querySelector('.chart-wrap') || canvas.parentElement;
  const dpr = window.devicePixelRatio || 1;
  const size = Math.max(240, Math.round(wrap.clientWidth)); // square, min size

  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';

  const pw = Math.round(size * dpr);
  const ph = Math.round(size * dpr);
  if(canvas.width !== pw || canvas.height !== ph){
    canvas.width = pw;
    canvas.height = ph;
  }

  // rebuild cache if needed (size or language changed)
  const w = canvas.width / dpr, h = canvas.height / dpr;
  if(!axesCache || axesCacheW !== w || axesCacheH !== h || axesCacheLang !== state.lang){
    buildAxesCache(w, h, state.lang);
  }
}

function drawOnce(x, y){
  const dpr = window.devicePixelRatio || 1;

  // Reset and clear in device pixels
  if(typeof ctx.resetTransform === 'function') ctx.resetTransform();
  else ctx.setTransform(1,0,0,1,0,0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Scale to CSS units
  ctx.scale(dpr, dpr);

  const w = canvas.width / dpr;
  const h = canvas.height / dpr;

  // Blit cached axes
  if(axesCache){
    ctx.drawImage(axesCache, 0, 0, axesCache.width, axesCache.height, 0, 0, w, h);
  }

  // Plot current point
  if(!isNaN(x) && !isNaN(y)){
    const px = w/2 + (x/100)*(w/2);
    const py = h/2 - (y/100)*(h/2);
    ctx.fillStyle = '#4da3ff';
    ctx.strokeStyle = '#7affb3';
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI*2); ctx.stroke();
    const label = `(${isNaN(x)?'–':x.toFixed(1)}, ${isNaN(y)?'–':y.toFixed(1)})`;
    ctx.font = '13px system-ui'; ctx.textAlign='left'; ctx.textBaseline='bottom';
    ctx.fillStyle = '#dfe9f5';
    ctx.fillText(label, Math.min(px+12,w-4), Math.max(py-8,14));
  }

  // Return to identity
  if(typeof ctx.resetTransform === 'function') ctx.resetTransform();
  else ctx.setTransform(1,0,0,1,0,0);
}

/* -------------------- Result card (localized, with quadrant annotations) -------------------- */
const downloadCardBtn = document.getElementById('downloadCard');
if(downloadCardBtn) downloadCardBtn.onclick = ()=>{
  const {x,y,yCore,ySec} = compute();
  const W=1000, H=640;
  const off=document.createElement('canvas'); off.width=W; off.height=H; const c=off.getContext('2d');

  // background
  const g=c.createLinearGradient(0,0,0,H); g.addColorStop(0,'#0b0f15'); g.addColorStop(1,'#0e1621');
  c.fillStyle=g; c.fillRect(0,0,W,H);

  const isJA = state.lang==='ja';
  const title = isJA ? '政治コンパス — 結果' : 'Political Compass — Result';
  const lines = isJA ? [
    `X 経済: ${isNaN(x)?'–':x.toFixed(1)}`,
    `Y 市民的自由: ${isNaN(y)?'–':y.toFixed(1)}`,
    `Y-Core（社会）: ${isNaN(yCore)?'–':yCore.toFixed(1)}`,
    `Y-Security（安全保障）: ${isNaN(ySec)?'–':ySec.toFixed(1)}`
  ] : [
    `X Economic: ${isNaN(x)?'–':x.toFixed(1)}`,
    `Y Civil-Liberties: ${isNaN(y)?'–':y.toFixed(1)}`,
    `Y-Core: ${isNaN(yCore)?'–':yCore.toFixed(1)}`,
    `Y-Security: ${isNaN(ySec)?'–':ySec.toFixed(1)}`
  ];
  const tsLabel = isJA ? '生成時刻 ' : 'Generated ';
  const watermark = isJA ? '結果は www.kaiwatanabe.com/pc で確認' : 'check yours at www.kaiwatanabe.com/pc';

  // title
  c.fillStyle='#e6eef7'; c.font='bold 30px system-ui';
  c.fillText(title, 24, 44);

  // mini chart with quadrant annotations
  const S=420, X0=40, Y0=80;
  const chart=document.createElement('canvas'); chart.width=S; chart.height=S; const cc=chart.getContext('2d');
  cc.strokeStyle='#263041'; cc.lineWidth=1;
  for(let i=0;i<=10;i++){ const t=i/10, g=t*S; cc.beginPath(); cc.moveTo(g,0); cc.lineTo(g,S); cc.stroke(); cc.beginPath(); cc.moveTo(0,g); cc.lineTo(S,g); cc.stroke(); }
  cc.strokeStyle='#3b4a61'; cc.lineWidth=2; cc.beginPath(); cc.moveTo(0,S/2); cc.lineTo(S,S/2); cc.stroke(); cc.beginPath(); cc.moveTo(S/2,0); cc.lineTo(S/2,S); cc.stroke();
  cc.fillStyle='#b9c7d8'; cc.font='16px system-ui'; cc.textAlign='left';
  cc.fillText(isJA?'権威主義 (−)':'Authoritarian (−)', 8, 22);
  cc.textAlign='right';
  cc.fillText(isJA?'自由主義 (+)':'Libertarian (+)', S-8, S-8);
  cc.textAlign='center';
  cc.fillText(isJA?'公共介入重視（−）':'Economic Left (−)', 70, S/2 - 10);
  cc.fillText(isJA?'市場重視（＋）':'Economic Right (+)', S-70, S/2 - 10);
  cc.fillStyle='#8898aa'; cc.beginPath(); cc.arc(S/2,S/2,3,0,Math.PI*2); cc.fill();
  if(!isNaN(x) && !isNaN(y)){
    const px = S/2 + (x/100)*(S/2);
    const py = S/2 - (y/100)*(S/2);
    cc.fillStyle='#4da3ff'; cc.strokeStyle='#7affb3'; cc.lineWidth=3;
    cc.beginPath(); cc.arc(px,py,7,0,Math.PI*2); cc.fill();
    cc.beginPath(); cc.arc(px,py,10,0,Math.PI*2); cc.stroke();
  }
  c.drawImage(chart, X0, Y0);

  // stats
  c.font='18px system-ui'; c.fillStyle='#e6eef7';
  lines.forEach((t,i)=> c.fillText(t, 500, 140 + i*34));

  // timestamp + watermark
  const ts=new Date().toLocaleString(); c.fillStyle='#8fa0b4'; c.font='14px system-ui';
  c.fillText(tsLabel + ts, 24, H-24);
  c.save(); c.globalAlpha=0.12; c.fillStyle='#e6eef7'; c.font='bold 28px system-ui'; c.textAlign='right';
  c.fillText(watermark, W-16, H-18); c.restore();

  const a=document.createElement('a');
  a.download='political-compass-card.png';
  a.href=off.toDataURL('image/png');
  a.click();
};

/* -------------------- Init -------------------- */
(function init(){
  // Restore saved state
  const saved = localStorage.getItem('pc_answers');
  if(saved){ try{ state.answers = JSON.parse(saved)||{}; }catch(e){} }
  const savedLang = localStorage.getItem('pc_lang');
  if(savedLang){
    state.lang = savedLang;
    document.querySelectorAll('.lang-btn').forEach(b=>{
      const active = b.dataset.lang===state.lang;
      b.classList.toggle('active', active);
      b.setAttribute('aria-checked', active? 'true':'false');
    });
  }

  // Localize title
  const title = document.getElementById('appTitle');
  if(title) title.textContent = state.lang==='ja' ? '政治コンパス — 80項目サーベイ' : 'Political Compass — 80-Item Survey';

  // Build UI & chart
  translateStatic();
  buildUI();

  bindResizeOnce();
  scheduleDraw(); // will size + build cache + draw

  setTimeout(updateStickyOffset, 50);

  // ----- Make "Save Result Card" button prominent (inject CSS + inline styles) -----
  const btn = document.getElementById('downloadCard');
  if (btn){
    // Inject minimal CSS for pulse halo
    const css = `
      @keyframes pc-pulse-ring { 0%{opacity:.7;transform:scale(1)} 100%{opacity:0;transform:scale(1.35)} }
      .pc-fab::after{content:"";position:absolute;inset:-10px;border-radius:999px;border:2px solid rgba(45,212,191,.55);animation:pc-pulse-ring 1.6s ease-out infinite;}
      @media (prefers-reduced-motion: reduce){ .pc-fab::after{animation:none;display:none;} }
    `;
    const styleEl = document.createElement('style'); styleEl.textContent = css; document.head.appendChild(styleEl);

    // Inline styles so no CSS edits are needed
    Object.assign(btn.style, {
      position: 'fixed',
      right: '16px',
      bottom: '16px',
      zIndex: '1000',
      padding: '14px 18px',
      border: '0',
      borderRadius: '999px',
      fontSize: '16px',
      fontWeight: '700',
      letterSpacing: '.2px',
      color: '#0b1120',
      background: 'linear-gradient(180deg,#2dd4bf 0%, #22c55e 100%)',
      boxShadow: '0 10px 24px rgba(34,197,94,.35), 0 2px 8px rgba(0,0,0,.5)',
      cursor: 'pointer'
    });
    btn.onmouseenter = ()=> btn.style.transform = 'translateY(-2px) scale(1.03)';
    btn.onmouseleave = ()=> btn.style.transform = 'none';
    btn.onmousedown  = ()=> btn.style.filter = 'brightness(.95)';
    btn.onmouseup    = ()=> btn.style.filter = 'none';
    btn.classList.add('pc-fab');
    btn.setAttribute('aria-label', state.lang==='ja' ? '結果カードを保存' : 'Save result card');
    // Remove pulse after 5s or first click
    const stopPulse = ()=> btn.classList.remove('pc-fab');
    setTimeout(stopPulse, 5000);
    btn.addEventListener('click', stopPulse, { once:false });
  }
})();