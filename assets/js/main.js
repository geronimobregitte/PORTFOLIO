(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var bar = document.querySelector('.progress');

  function onScroll() {
    if (!bar) return;
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? h.scrollTop / max : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // stagger the children of any [data-stagger] container
  document.querySelectorAll('[data-stagger]').forEach(function (p) {
    Array.prototype.forEach.call(p.children, function (c, i) {
      c.classList.add('reveal');
      c.style.setProperty('--d', i * 90 + 'ms');
    });
  });

  function runCounters(scope, instant) {
    scope.querySelectorAll('[data-count]').forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = +el.dataset.count;
      if (instant) { el.textContent = target; return; }
      var start = performance.now(), dur = 1200;
      el.textContent = '0';
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(tick);
      })(start);
    });
  }

  var items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (e) { e.classList.add('in'); });
    runCounters(document, true);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      runCounters(en.target, false);
      io.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (e) { io.observe(e); });
})();
