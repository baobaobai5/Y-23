const query = new URLSearchParams(location.search);
const boardKey = Object.hasOwn(rankingBoards, query.get('board')) ? query.get('board') : 'popular';
const requestedPeriod = rankingPeriodKeys.indexOf(query.get('period'));
const periodIndex = requestedPeriod < 0 ? 0 : requestedPeriod;
const requestedPage = Number(query.get('page'));
const currentPage = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= 10 ? requestedPage : 1;
const board = rankingBoards[boardKey];
const canvas = document.getElementById('more-canvas');
const viewport = document.getElementById('more-viewport');
function resizeMoreCanvas() {
  const scale = Math.min(innerWidth / 1920, 1);
  canvas.style.transform = `scale(${scale})`;
  canvas.style.marginInline = innerWidth > 1920 ? 'auto' : '0';
  viewport.style.height = `${2725 * scale}px`;
}
resizeMoreCanvas();
new ResizeObserver(resizeMoreCanvas).observe(document.documentElement);
document.title = `${board.name} - 万象`;
canvas.setAttribute('aria-label', board.name);
function pageUrl(page = currentPage, period = periodIndex) {
  return `${rankingUrl(boardKey, period)}&page=${page}`;
}
document.querySelector('.more-board-types').innerHTML = Object.entries(rankingBoards).map(([key, item]) => `<a href="${rankingUrl(key, periodIndex)}&page=1" ${key === boardKey ? 'aria-current="page"' : ''}><img src="assets/${key === boardKey ? 'f3107' : 'fc7fd'}.svg" alt="" width="64" height="40"><span>${item.name}</span></a>`).join('');
document.querySelector('.more-periods').innerHTML = rankingPeriods.map((label, index) => `<a href="${pageUrl(1, index)}" ${index === periodIndex ? 'aria-current="page"' : ''}><img src="assets/${index === periodIndex ? 'f3107' : 'fc7fd'}.svg" alt="" width="64" height="40"><span>${label}</span></a>`).join('');
const miniLogo = "<span class=\"logo mini\">\n<img src=\"assets/510bf.svg\" class=\"\" alt=\"\" width=\"21.7032\" height=\"8.00005\" decoding=\"async\">\n<span class=\"logo-type\">\n<b>万象</b>\n<span class=\"producer\">出品</span>\n<small>-wanxiang-</small>\n</span>\n</span>";
function cardMarkup(index) {
  const rank = (currentPage - 1) * 24 + index + 1;
  // The fourth badge in the provided first-page artwork reads TOP·6.
  const badgeRank = currentPage === 1 && index === 3 ? 6 : rank;
  return `<button class="comic ranking" aria-label="${board.name} 第${rank}名，漫画标题漫画标题">
    <span class="frame-clip"><img class="comic-frame" src="assets/992f8.webp" alt="" width="752" height="1354" ${index >= 12 ? 'loading="lazy"' : ''}></span>
    <img class="cover" src="assets/bda2d.webp" alt="漫画封面" width="500" height="909" ${index >= 12 ? 'loading="lazy"' : ''}>
    <img class="blue-frame" src="assets/5a7ae.webp" alt="" width="489" height="684" ${index >= 12 ? 'loading="lazy"' : ''}>
    ${miniLogo}
    <img class="caption-bg" src="assets/2d62a.webp" alt="" width="1403" height="345" ${index >= 12 ? 'loading="lazy"' : ''}>
    <span class="rank-badge rank-${rank}">TOP·${badgeRank}</span>
    <span class="comic-title" title="漫画标题漫画标题">漫画标题漫画标题…</span>
    <span class="tags">${['台湾','动作武打','动作武打'].map(label => `<span class="tag"><img src="assets/cb799.webp" alt="" width="717" height="567"><span>${label}</span></span>`).join('')}</span>
  </button>`;
}
document.querySelector('.more-comics').innerHTML = Array.from({length:24}, (_, index) => cardMarkup(index)).join('');
const pageNumbers = [1,1,2,3,4,5,'...',10];
const pagingButton = (number, index) => number === '...' ? '<span class="page-ellipsis">...</span>' : `<a href="${pageUrl(number)}" ${currentPage === number && (number !== 1 || index === 0) ? 'aria-current="page"' : ''} aria-label="第${number}页">${number}</a>`;
document.querySelector('.more-pagination').innerHTML = `<a class="page-prev" href="${pageUrl(Math.max(1,currentPage-1))}" aria-label="上一页" ${currentPage === 1 ? 'aria-disabled="true"' : ''}><img src="assets/66a33.svg" alt="" width="24" height="24"></a><span class="more-page-numbers">${pageNumbers.map(pagingButton).join('')}</span><a class="page-next" href="${pageUrl(Math.min(10,currentPage+1))}" aria-label="下一页" ${currentPage === 10 ? 'aria-disabled="true"' : ''}><img src="assets/47abb.svg" alt="" width="24" height="24"></a>`;
document.querySelectorAll('[aria-disabled="true"]').forEach(link => link.addEventListener('click',event=>event.preventDefault()));
const preview = document.getElementById('ranking-preview');
const previewContent = document.getElementById('ranking-preview-content');
function show(title, body = '') { previewContent.innerHTML = `<h2>${title}</h2>${body}`; preview.showModal(); }
document.querySelector('.dialog-close').onclick = () => preview.close();
preview.addEventListener('click',event=>{if(event.target===preview)preview.close();});
document.querySelector('.more-comics').addEventListener('click',event=>{if(event.target.closest('.comic'))show('漫画标题漫画标题','<img class="dialog-cover" src="assets/bda2d.webp" alt="漫画封面"><p class="dialog-text">当前为设计原型，漫画正文尚未接入。</p>');});
document.querySelectorAll('.floating-ad>button').forEach(button=>button.onclick=()=>button.parentElement.remove());
document.getElementById('back-top').onclick=()=>scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
document.querySelector('.floating-tools button').onclick=()=>show('联系客服','<p class="dialog-text">客服联系方式尚未配置。</p>');
document.querySelectorAll('.application,.banner').forEach(button=>button.onclick=()=>show(button.classList.contains('application')?'应用名称':'推荐活动','<p class="dialog-text">此推广入口尚未配置跳转地址。</p>'));
document.querySelector('.search').onclick=()=>show('搜索漫画','<form><label for="search-input">漫画名称</label><input id="search-input" class="dialog-field" placeholder="输入漫画名称" required><button class="dialog-submit">搜索</button><p class="dialog-text" aria-live="polite"></p></form>');
document.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{const title=button.dataset.action;if(title==='登录 / 注册')show(title,'<form><label for="account">账号</label><input id="account" class="dialog-field" autocomplete="username" required><label for="password">密码</label><input id="password" type="password" class="dialog-field" autocomplete="current-password" required><button class="dialog-submit">登录</button><p class="dialog-text" aria-live="polite"></p></form>');else show(title,'<p class="dialog-text">此功能尚未接入服务。</p>');});
previewContent.addEventListener('submit',event=>{event.preventDefault();event.target.querySelector('p').textContent='服务尚未接入。';});
