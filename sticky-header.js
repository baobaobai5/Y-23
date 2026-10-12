// Keep navigation outside the scaled page canvas so it stays fixed to the viewport.
(() => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const shell = document.createElement('div');
  shell.className = 'sticky-navigation';
  shell.dataset.page = document.getElementById('more-canvas') ? 'more' : 'home';
  document.body.prepend(shell);
  shell.append(header);
  function resizeHeader() {
    const scale = Math.min(window.innerWidth / 1920, 1);
    header.style.transform = `scale(${scale})`;
    header.style.left = `${Math.max((window.innerWidth - 1920) / 2, 0)}px`;
    shell.style.height = `${150 * scale}px`;
  }
  resizeHeader();
  new ResizeObserver(resizeHeader).observe(document.documentElement);
})();
