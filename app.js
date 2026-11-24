(() => {
  const catButton = document.getElementById('cat-meow');
  const catSound = document.getElementById('cat-sound');
  if (catButton && catSound) {
    catButton.addEventListener('click', () => {
      catSound.currentTime = 0;
      catSound.play().catch(() => {});
    });
  }

  const current = location.pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
  document.querySelectorAll('header nav a').forEach(a => {
    const target = new URL(a.href).pathname.replace(/\/index\.html$/, '/').replace(/\/$/, '');
    const selected = target === current || (a.textContent.trim() === 'projects' && current.startsWith(target + '/'));
    if (selected) a.setAttribute('aria-current', 'page');
  });

  const tabs = [...document.querySelectorAll('[role="tab"]')];
  function selectTab(tab, focus = false) {
    tabs.forEach(t => {
      const selected = t === tab;
      t.setAttribute('aria-selected', String(selected));
      t.dataset.state = selected ? 'active' : 'inactive';
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      panel.hidden = !selected;
      panel.dataset.state = t.dataset.state;
    });
    if (focus) tab.focus();
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => selectTab(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = tabs[(i + 1) % tabs.length];
      if (event.key === 'ArrowLeft') target = tabs[(i - 1 + tabs.length) % tabs.length];
      if (event.key === 'Home') target = tabs[0];
      if (event.key === 'End') target = tabs[tabs.length - 1];
      if (target) { event.preventDefault(); selectTab(target, true); }
    });
  });

  const viewer = document.createElement('dialog');
  viewer.className = 'image-viewer';
  viewer.innerHTML = '<button type="button" aria-label="Close image">×</button><img alt="">';
  document.body.append(viewer);
  viewer.querySelector('button').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => { if (event.target === viewer) viewer.close(); });
  document.querySelectorAll('a[href^="/img/"]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const img = viewer.querySelector('img');
      img.src = link.getAttribute('href');
      img.alt = link.querySelector('img')?.alt || 'Project preview';
      viewer.showModal();
    });
  });
})();
