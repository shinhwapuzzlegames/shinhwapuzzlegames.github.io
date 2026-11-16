// ShinhwaPuzzleGames — small site script (no build step, no dependencies)
(function () {
  var root = document.documentElement;

  // ---------- Language (KO / EN) ----------
  function getStoredLang() {
    try { return localStorage.getItem('spg-lang'); } catch (e) { return null; }
  }
  function setLang(lang) {
    root.lang = lang;
    try { localStorage.setItem('spg-lang', lang); } catch (e) {}
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('on', b.dataset.lang === lang);
    });
  }
  var params = new URLSearchParams(location.search);
  var initial = params.get('lang') || getStoredLang() ||
    ((navigator.language || 'en').toLowerCase().indexOf('ko') === 0 ? 'ko' : 'en');
  setLang(initial === 'ko' ? 'ko' : 'en');
  document.querySelectorAll('.lang-toggle button').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset.lang); });
  });

  // ---------- Mobile menu ----------
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.querySelector('.nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', open);
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ---------- Game filters ----------
  var filterBtns = document.querySelectorAll('.filters button');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.dataset.filter;
      filterBtns.forEach(function (b) { b.classList.toggle('on', b === btn); });
      document.querySelectorAll('.game-card').forEach(function (card) {
        card.classList.toggle('hide', f !== 'all' && card.dataset.genre !== f);
      });
    });
  });

  // ---------- Game count ----------
  var countEl = document.getElementById('game-count');
  if (countEl) countEl.textContent = document.querySelectorAll('.game-card').length;

  // ---------- Reveal on scroll ----------
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('in'); });
  }

  // ---------- Active nav link ----------
  var sections = document.querySelectorAll('main section[id]');
  var links = document.querySelectorAll('.nav a[href^="#"]');
  if (sections.length && links.length && 'IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  // ---------- Year ----------
  document.querySelectorAll('.year').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
