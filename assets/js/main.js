/* ═══════════════════════════════════════════════════════════════════════════
   Bishal Khand Thakuri — personal site
   Vanilla JS: theme, nav, reveal, accordion, timeline, copy, contour canvas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Colour theme ────────────────────────────────────────────────────── */
  var root = document.documentElement;
  var themeBtn = document.querySelector('.theme-toggle');

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      setTheme(root.getAttribute('data-theme') === 'ink' ? 'paper' : 'ink');
    });
  }

  /* ── Header state + scroll progress ──────────────────────────────────── */
  var header = document.querySelector('.site-header');
  var progress = document.querySelector('.progress span');
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;

    if (header) header.classList.toggle('scrolled', y > 12);

    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleX(' + (h > 0 ? Math.min(y / h, 1) : 0) + ')';
    }

    updateTimeline();
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  /* ── Mobile menu ─────────────────────────────────────────────────────── */
  var menuBtn = document.querySelector('.menu-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function closeMenu() {
    if (!menuBtn || !mobileMenu) return;
    document.body.classList.remove('nav-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      menuBtn.setAttribute('aria-expanded', String(open));
      mobileMenu.hidden = !open;
    });

    mobileMenu.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ── Reveal on scroll ────────────────────────────────────────────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ── Active section in nav ───────────────────────────────────────────── */
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll('.site-nav a[href*="#"]')
  );

  if (navLinks.length && 'IntersectionObserver' in window) {
    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute('href').split('#')[1];
        return id ? document.getElementById(id) : null;
      })
      .filter(Boolean);

    var activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle(
            'is-active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(function (section) { activeObserver.observe(section); });
  }

  /* ── Project accordion ───────────────────────────────────────────────── */
  document.querySelectorAll('.project-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var project = head.closest('.project');
      var isOpen = project.classList.contains('open');

      document.querySelectorAll('.project.open').forEach(function (other) {
        if (other !== project) {
          other.classList.remove('open');
          other.querySelector('.project-head').setAttribute('aria-expanded', 'false');
        }
      });

      project.classList.toggle('open', !isOpen);
      head.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ── Timeline scroll progress ────────────────────────────────────────── */
  var timeline = document.querySelector('.timeline');

  function updateTimeline() {
    if (!timeline || reduceMotion) return;
    var rect = timeline.getBoundingClientRect();
    var start = window.innerHeight * 0.82;
    var span = rect.height + start * 0.4;
    var p = (start - rect.top) / span;
    timeline.style.setProperty('--tl-progress', Math.max(0, Math.min(1, p)).toFixed(3));
  }

  /* ── Copy to clipboard ───────────────────────────────────────────────── */
  var toast = document.querySelector('.toast');
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 2200);
  }

  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-copy');
      var done = function () { showToast('Email copied'); };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(value).then(done, function () {
          fallbackCopy(value, done);
        });
      } else {
        fallbackCopy(value, done);
      }
    });
  });

  function fallbackCopy(value, done) {
    var area = document.createElement('textarea');
    area.value = value;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(area);
  }

  /* ── Hero: animated contour field ────────────────────────────────────── */
  var canvas = document.querySelector('[data-contour]');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var width = 0;
    var height = 0;
    var rgb = '0, 79, 144';
    var mouseX = -9999;
    var mouseY = -9999;
    var strength = 0;
    var targetStrength = 0;
    var frameId = null;

    rgb = (root.style.getPropertyValue('--canvas-rgb') ||
           getComputedStyle(root).getPropertyValue('--canvas-rgb') ||
           '0, 79, 144').trim();

    function readThemeColor() {
      rgb = getComputedStyle(root).getPropertyValue('--canvas-rgb').trim() || '0, 79, 144';
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduceMotion) drawField(0);
    }

    function drawField(t) {
      ctx.clearRect(0, 0, width, height);

      var gap = width < 700 ? 30 : 26;
      var lineCount = Math.ceil(height / gap) + 2;
      var step = 7;

      strength += (targetStrength - strength) * 0.06;

      for (var i = 0; i < lineCount; i++) {
        var baseY = i * gap - gap;
        var centre = 1 - Math.abs(baseY - height / 2) / (height / 2 + 1);
        var alpha = 0.05 + 0.14 * centre;

        ctx.beginPath();
        ctx.strokeStyle = 'rgba(' + rgb + ',' + alpha.toFixed(3) + ')';
        ctx.lineWidth = 1;

        for (var x = -step; x <= width + step; x += step) {
          var nx = x * 0.0055;
          var wave =
            Math.sin(nx * 1.7 + t * 0.00022 + i * 0.42) * (10 + 8 * centre) +
            Math.sin(nx * 3.2 - t * 0.00016 + i * 0.19) * 6 +
            Math.sin(nx * 0.8 + t * 0.00009 + i * 0.83) * (6 + 7 * centre);

          var y = baseY + wave;

          if (strength > 0.01) {
            var dx = x - mouseX;
            var dy = baseY - mouseY;
            var dist2 = dx * dx + dy * dy;
            var sigma2 = 2 * 110 * 110;
            var force = Math.exp(-dist2 / sigma2) * 30 * strength;
            y += dy >= 0 ? force : -force;
          }

          if (x === -step) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.stroke();
      }
    }

    function loop(t) {
      drawField(t);
      frameId = window.requestAnimationFrame(loop);
    }

    var hero = canvas.parentElement;
    hero.addEventListener('pointermove', function (e) {
      var rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      targetStrength = 1;
    });

    hero.addEventListener('pointerleave', function () {
      targetStrength = 0;
    });

    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    if ('MutationObserver' in window) {
      new MutationObserver(readThemeColor).observe(root, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }

    resize();

    if (!reduceMotion) {
      frameId = window.requestAnimationFrame(loop);
    } else {
      drawField(0);
    }

    /* Pause the animation when the hero is off-screen. */
    if ('IntersectionObserver' in window && !reduceMotion) {
      new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && frameId === null) {
            frameId = window.requestAnimationFrame(loop);
          } else if (!entry.isIntersecting && frameId !== null) {
            window.cancelAnimationFrame(frameId);
            frameId = null;
          }
        });
      }, { threshold: 0 }).observe(canvas);
    }
  }

  /* Initial state */
  onScroll();
})();
