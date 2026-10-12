// Only ranking-related controls remain interactive on these display pages.
(() => {
  const rankingControls = '.ranking-more, .ranking-entry, .rank-tabs, .more-board-types, .more-periods, .more-pagination, .more-comics, .more-breadcrumb, dialog';
  document.querySelectorAll('a, button, input, select, textarea').forEach(control => {
    if (control.closest(rankingControls)) return;
    control.inert = true;
    control.setAttribute('aria-disabled', 'true');
    control.tabIndex = -1;
    control.classList.add('display-only-control');
  });
  document.addEventListener('click', event => {
    if (event.target.closest(rankingControls)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
})();
