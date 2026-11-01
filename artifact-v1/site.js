// Shared behaviour for every category page: nav, preloader, smooth scroll, contact bubble.
(function () {
  var cfg = window.PAGE || {};
  var navbar = document.getElementById('navbar');
  var menuBtn = document.getElementById('menu-btn');
  var bubble = document.getElementById('contact-bubble');
  var prompt = document.getElementById('scroll-prompt');
  var manualBubble = false;

  if (navbar) navbar.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
      var active = navbar.classList.contains('mobile-active');
      if (e.target.closest('.nav-logo') && !active) return;
      if (e.target.closest('a') && active) return; // let the link navigate
      if (active) { e.preventDefault(); }
      navbar.classList.toggle('mobile-active', !active);
      navbar.classList.remove('collapsed');
      menuBtn && menuBtn.classList.toggle('open', !active);
      document.body.style.overflow = active ? '' : 'hidden';
    } else if (!e.target.closest('a')) {
      navbar.classList.toggle('force-expand');
    }
  });

  if (bubble) bubble.addEventListener('click', function (e) {
    if (e.target.closest('a')) return;
    manualBubble = !bubble.classList.contains('expanded');
    bubble.classList.toggle('expanded', manualBubble);
  });

  function onScroll() {
    var y = window.scrollY;
    if (navbar) {
      if (y > 50) { if (!navbar.classList.contains('mobile-active')) navbar.classList.add('collapsed'); }
      else navbar.classList.remove('collapsed', 'force-expand');
    }
    if (prompt && cfg.promptOnScroll !== false) prompt.classList.toggle('hide', y > 50);
    if (bubble) {
      var bottom = window.innerHeight + y >= document.documentElement.scrollHeight - 50;
      if (bottom) bubble.classList.add('expanded');
      else if (!manualBubble) bubble.classList.remove('expanded');
      if (!bottom && manualBubble && Math.abs(y - (onScroll.last || 0)) > 200) { manualBubble = false; bubble.classList.remove('expanded'); }
    }
    onScroll.last = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  setTimeout(function () {
    var pre = document.querySelector('.preloader'); if (pre) pre.classList.add('hidden');
    var main = document.querySelector('.main-content'); if (main) main.classList.add('loaded');
  }, cfg.delay || 500);

  try {
    if (cfg.lenis !== false && window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var o = cfg.lenisOpts || {};
      var lenis = new Lenis(Object.assign({ duration: 1.2, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, touchMultiplier: 1.5 }, o));
      var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  } catch (e) {}

  // Seamless kinetic rows (Graphic + Photography)
  window.initKinetic = function (wrapper) {
    if (!wrapper) return;
    var rows = Array.prototype.slice.call(wrapper.querySelectorAll('.gallery-strip'));
    if (window.innerWidth <= 768) {
      wrapper.classList.add('loaded');
      var ob = new IntersectionObserver(function (es) { es.forEach(function (en) { en.target.classList.toggle('in-view', en.isIntersecting); }); }, { rootMargin: '-20% 0px -20% 0px', threshold: 0 });
      wrapper.querySelectorAll('.strip-item').forEach(function (it) { ob.observe(it); });
      return;
    }
    var pos = rows.map(function () { return 0; }), lim = rows.map(function () { return 0; });
    var vel = 0, skew = 0, lastY = window.scrollY;
    function calc() {
      rows.forEach(function (row, i) {
        var items = row.children, n = Math.floor(items.length / 3);
        if (n > 0 && items[n]) lim[i] = items[n].offsetLeft - items[0].offsetLeft;
        if (lim[i] > 0 && pos[i] === 0) {
          var st = (lim[i] / 5) * (i % 5);
          pos[i] = i % 2 === 0 ? -lim[i] - st : -lim[i] + st;
        }
      });
      wrapper.classList.add('loaded');
    }
    function tick() {
      var y = window.scrollY, d = y - lastY; lastY = y;
      vel += (d * 0.1 - vel) * 0.1;
      var speed = 0.5 + vel * 5;
      skew += (vel * 2 - skew) * 0.1;
      var sk = Math.max(Math.min(skew, 5), -5);
      rows.forEach(function (row, i) {
        var l = lim[i] || 3000;
        if (i % 2 === 0) { pos[i] -= speed; if (pos[i] <= -2 * l) pos[i] += l; if (pos[i] > -l) pos[i] -= l; }
        else { pos[i] += speed; if (pos[i] >= 0) pos[i] -= l; if (pos[i] < -l) pos[i] += l; }
        row.style.transform = 'translate3d(' + pos[i].toFixed(2) + 'px,0,0) skewX(' + sk.toFixed(2) + 'deg)';
      });
      requestAnimationFrame(tick);
    }
    calc(); window.addEventListener('resize', calc);
    if (document.readyState !== 'complete') window.addEventListener('load', calc);
    tick();
  };
})();
