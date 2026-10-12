// Shared local demonstration data. Replace this source when connecting ranking APIs.
const rankingCovers = ['bda2d', 'e8978', '1d437', '013fc', '8746f', 'ef6db'];
const rankingEngagement = [
  { views: 32840, likes: 2840 }, { views: 27610, likes: 2130 },
  { views: 21930, likes: 1840 }, { views: 18750, likes: 1520 },
  { views: 14580, likes: 1260 }, { views: 11240, likes: 910 }
];
const rankingPeriods = ['日', '近7天', '近15天', '近30天'];
const rankingBoards = {
  popular: { name: '人气榜', metric: '阅读', unit: '次', orders: [[0, 1, 2, 3, 4, 5], [1, 0, 4, 2, 5, 3], [2, 4, 0, 5, 1, 3], [4, 2, 1, 0, 3, 5]], values: [32840, 27610, 21930, 18750, 14580, 11240] },
  favorites: { name: '收藏榜', metric: '收藏', unit: '次', orders: [[2, 4, 1, 0, 5, 3], [4, 2, 0, 3, 1, 5], [1, 4, 3, 2, 5, 0], [3, 1, 4, 5, 0, 2]], values: [8420, 7130, 5840, 4920, 3760, 2910] },
  new: { name: '新作榜', metric: '阅读', unit: '次', orders: [[5, 3, 4, 2, 1, 0], [3, 5, 2, 4, 0, 1], [5, 4, 3, 1, 2, 0], [4, 5, 1, 3, 0, 2]], values: [12460, 10820, 9310, 7850, 6210, 4980] },
  rising: { name: '飙升榜', metric: '热度增幅', unit: '%', orders: [[3, 5, 0, 4, 2, 1], [5, 3, 4, 1, 0, 2], [0, 5, 1, 2, 3, 4], [1, 3, 5, 0, 4, 2]], values: [218, 176, 142, 113, 86, 54] }
};

const rankingPeriodKeys = ['day', '7', '15', '30'];
function getRankingEntries(boardKey, periodIndex) {
  const board = rankingBoards[boardKey];
  return board.orders[periodIndex].map((coverIndex, position) => ({
    cover: `assets/${rankingCovers[coverIndex]}.webp`,
    title: '漫画标题漫画标题漫画标题漫画标题漫画标题',
    tags: ['台湾', '动作', '武打'],
    rank: position + 1,
    views: Math.round(rankingEngagement[coverIndex].views * [1, 4.8, 8.3, 12.6][periodIndex]),
    likes: Math.round(rankingEngagement[coverIndex].likes * [1, 4.8, 8.3, 12.6][periodIndex]),
    value: Math.round(board.values[position] * (board.unit === '%' ? 1 + periodIndex * .12 : [1, 4.8, 8.3, 12.6][periodIndex]))
  }));
}
function rankingValue(boardKey, entry) {
  const board = rankingBoards[boardKey];
  return `${board.unit === '%' ? '+' : ''}${entry.value.toLocaleString('zh-CN')}${board.unit}`;
}
function rankingUrl(boardKey, periodIndex) {
  return `rankings.html?board=${boardKey}&period=${rankingPeriodKeys[periodIndex]}`;
}

function rankingMetricMarkup(boardKey, entry) {
  const board = rankingBoards[boardKey];
  const isGrowth = board.unit === '%';
  const abbreviated = !isGrowth && entry.value >= 10000;
  const number = isGrowth ? `+${entry.value}` : abbreviated ? (entry.value / 10000).toFixed(2) : entry.value.toLocaleString('zh-CN');
  return `<span class="ranking-entry-metric ${isGrowth ? 'metric-growth' : ''}" title="${board.metric} ${rankingValue(boardKey, entry)}"><strong>${number}<em>${isGrowth ? '%' : abbreviated ? '万' : ''}</em></strong><small>${board.metric}${isGrowth ? '' : '次数'}</small></span>`;
}
function rankingCoverMarkup(entry, width, height) {
  return `<span class="ranking-cover"><img class="ranking-thumbnail" src="${entry.cover}" alt="" width="${width}" height="${height}" loading="lazy"><span class="ranking-cover-shade" aria-hidden="true"></span><span class="logo mini ranking-watermark" aria-hidden="true"><img src="assets/510bf.svg" alt="" width="21.7032" height="8.00005"><span class="logo-type"><b>万象</b><span class="producer">出品</span><small>-wanxiang-</small></span></span></span>`;
}


function rankingTagsMarkup(entry) {
  return `<span class="ranking-genres" aria-label="分类标签">${entry.tags.map(tag => `<span class="ranking-genre">${tag}</span>`).join('')}</span>`;
}
function rankingEngagementMarkup(entry) {
  const compact = value => value >= 10000 ? `${(value / 10000).toFixed(1)}W` : value.toLocaleString('zh-CN');
  return `<span class="ranking-engagement"><span title="观看量 ${entry.views.toLocaleString('zh-CN')}" aria-label="观看量 ${entry.views}"><img src="assets/ranking-eye.svg" alt="" width="16" height="16"><span>${compact(entry.views)}</span></span><span title="喜欢量 ${entry.likes.toLocaleString('zh-CN')}" aria-label="喜欢量 ${entry.likes}"><img src="assets/ranking-heart.svg" alt="" width="16" height="16"><span>${compact(entry.likes)}</span></span></span>`;
}
