const canvas = document.getElementById('design-canvas');
const viewport = document.getElementById('viewport');
function resizeCanvas(){const scale=Math.min(window.innerWidth/1920,1);canvas.style.transform=`scale(${scale})`;viewport.style.height=`${5795*scale}px`;canvas.style.marginInline=window.innerWidth>1920?'auto':'0';}
resizeCanvas();new ResizeObserver(resizeCanvas).observe(document.documentElement);
const dialog=document.getElementById('content-dialog');
const content=document.getElementById('dialog-content');
function show(title,body=''){content.innerHTML=`<h2>${title}</h2>${body}`;dialog.showModal();}
document.querySelector('.dialog-close').onclick=()=>dialog.close();
dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
document.querySelectorAll('.refresh').forEach(button=>button.onclick=()=>{const grid=button.closest('section').querySelector('.comic-grid');grid.append(grid.firstElementChild);});
document.querySelectorAll('.comic').forEach(button=>button.onclick=()=>show('漫画标题漫画标题漫画标题漫画标题漫画标题',`<img class="dialog-cover" src="${button.querySelector('.cover').getAttribute('src')}" alt="漫画封面"><p class="dialog-text">台湾 · 动作武打</p><p class="dialog-text">当前为设计原型，漫画正文尚未接入。</p>`));
document.querySelectorAll('.navigation a').forEach((link,index)=>link.onclick=event=>{event.preventDefault();document.querySelectorAll('.navigation a').forEach(a=>a.classList.toggle('active',a===link));if(index){const y=[2494,3611,4739,1581,1038][index-1];window.scrollTo({top:y*Math.min(innerWidth/1920,1),behavior:'smooth'});}else window.scrollTo({top:0,behavior:'smooth'});});
document.querySelectorAll('.floating-ad>button').forEach(button=>button.onclick=()=>button.parentElement.remove());
document.getElementById('back-top').onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
document.querySelector('.floating-tools button').onclick=()=>show('联系客服','<p class="dialog-text">客服联系方式尚未配置。</p>');
document.querySelectorAll('.more').forEach(button=>button.onclick=()=>show(button.closest('section').getAttribute('aria-label'),'<p class="dialog-text">已展示当前设计中的全部漫画，更多内容待接入。</p>'));
document.querySelectorAll('.application,.banner').forEach(button=>button.onclick=()=>show(button.classList.contains('application')?'应用名称':'推荐活动','<p class="dialog-text">此推广入口尚未配置跳转地址。</p>'));
document.querySelector('.search').onclick=()=>show('搜索漫画','<form id="search-form"><label for="search-input">漫画名称</label><input id="search-input" class="dialog-field" placeholder="输入漫画名称" required><button class="dialog-submit">搜索</button><p class="dialog-text" id="search-result" aria-live="polite"></p></form>');
document.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{const title=button.dataset.action;if(title==='登录 / 注册')show(title,'<form id="login-form"><label for="account">账号</label><input id="account" class="dialog-field" autocomplete="username" required><label for="password">密码</label><input id="password" type="password" class="dialog-field" autocomplete="current-password" required><button class="dialog-submit">登录</button><p class="dialog-text" aria-live="polite"></p></form>');else show(title,'<p class="dialog-text">此功能尚未接入服务。</p>');});
content.addEventListener('submit',event=>{event.preventDefault();event.target.querySelector('p').textContent=event.target.id==='search-form'?'暂无匹配结果，搜索服务尚未接入。':'登录服务尚未接入。';});


// Four boards are displayed together; time selection updates every column.
const rankingSection = document.getElementById('rankings');
const rankingColumns = document.getElementById('ranking-columns');
let activeRankingPeriod = 0;
function renderRankings() {
  rankingColumns.innerHTML = Object.entries(rankingBoards).map(([key, board]) => `
    <article class="ranking-column" aria-labelledby="board-${key}">
      <span class="frame-clip" aria-hidden="true"><img class="comic-frame" src="assets/992f8.webp" alt="" width="752" height="1354" loading="lazy"></span>
      <img class="ranking-blue-frame" src="assets/5a7ae.webp" alt="" width="489" height="684" loading="lazy">
      <div class="ranking-column-content">
      <header class="ranking-column-header">
        <h3 id="board-${key}">${board.name}</h3>
        <a class="ranking-more" href="${rankingUrl(key, activeRankingPeriod)}" aria-label="更多${board.name}"><span>更多</span><img src="assets/50a4d.svg" alt="" width="18" height="18"></a>
      </header>
      <ol class="ranking-rows">${getRankingEntries(key, activeRankingPeriod).map(entry => `
        <li><button class="ranking-entry${entry.rank === 1 ? ' is-expanded' : ''}" data-cover="${entry.cover}">
          <span class="ranking-position position-${entry.rank}">${String(entry.rank).padStart(2, '0')}</span>
          ${rankingCoverMarkup(entry, 68, 86)}
          <span class="ranking-entry-copy"><strong title="${entry.title}">${entry.title}</strong>${rankingTagsMarkup(entry)}${rankingEngagementMarkup(entry)}</span>
        </button></li>`).join('')}</ol>
      </div>
    </article>`).join('');
}
const periodTabs = [...rankingSection.querySelectorAll('.rank-tabs button')];
function selectRankingPeriod(index) {
  activeRankingPeriod = index;
  periodTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    tab.querySelector('img').src = selected ? 'assets/f3107.svg' : 'assets/fc7fd.svg';
  });
  renderRankings();
}
periodTabs.forEach((tab, index) => {
  tab.tabIndex = index === 0 ? 0 : -1;
  tab.onclick = () => selectRankingPeriod(index);
  tab.onkeydown = event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % periodTabs.length;
    else if (event.key === 'ArrowLeft') next = (index + periodTabs.length - 1) % periodTabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = periodTabs.length - 1;
    else return;
    event.preventDefault();
    periodTabs[next].focus();
    selectRankingPeriod(next);
  };
});
function expandRankingEntry(column, entry) {
  column.querySelectorAll('.ranking-entry').forEach(row => {
    row.classList.toggle('is-expanded', row === entry);
  });
}
rankingColumns.addEventListener('pointerover', event => {
  const entry = event.target.closest('.ranking-entry');
  if (entry) expandRankingEntry(entry.closest('.ranking-column'), entry);
});
rankingColumns.addEventListener('pointerout', event => {
  const column = event.target.closest('.ranking-column');
  if (column && !column.contains(event.relatedTarget)) {
    expandRankingEntry(column, column.querySelector('.ranking-entry'));
  }
});
rankingColumns.addEventListener('focusin', event => {
  const entry = event.target.closest('.ranking-entry');
  if (entry) expandRankingEntry(entry.closest('.ranking-column'), entry);
});
rankingColumns.addEventListener('focusout', event => {
  const column = event.target.closest('.ranking-column');
  if (column && !column.contains(event.relatedTarget)) {
    expandRankingEntry(column, column.querySelector('.ranking-entry'));
  }
});
rankingColumns.addEventListener('click', event => {
  const entry = event.target.closest('.ranking-entry');
  if (entry) show('漫画标题漫画标题漫画标题漫画标题漫画标题', `<img class="dialog-cover" src="${entry.dataset.cover}" alt="漫画封面"><p class="dialog-text">台湾 · 动作武打</p><p class="dialog-text">当前为设计原型，漫画正文尚未接入。</p>`);
});
renderRankings();
