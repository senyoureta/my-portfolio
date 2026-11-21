/* ============================================================
   SENAI — interactions
   Language · theme · navigation · reveals
   ============================================================ */
(function () {
  'use strict';

  var root = document.documentElement;
  var body = document.body;
  var storage = {
    get: function (key) {
      try { return window.localStorage.getItem(key); } catch (e) { return null; }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, value); } catch (e) {}
    }
  };

  /* ---------- Reusable inline monogram ---------- */

  function mountMonograms() {
    var template = document.getElementById('monogram-template');
    if (!template) return;
    var source = template.innerHTML;
    document.querySelectorAll('[data-monogram]').forEach(function (mount) {
      mount.innerHTML = source;
    });
  }
  mountMonograms();

  var copy = {
    ar: {
      title: 'SENAI — BRAND & WEB DESIGN',
      description: 'شعار، هوية، موقع، أو صفحة هبوط. مصمم ومطوّر واحد يسلّمك الشغل، بدون وسطاء.',
      nav: 'التنقل الرئيسي',
      mobileNav: 'التنقل',
      openMenu: 'فتح القائمة',
      closeMenu: 'إغلاق القائمة',
      language: 'اللغة',
      wa: 'تواصل عبر واتساب',
      quickLinks: 'روابط سريعة',
      home: 'SENAI — الرئيسية',
      services: 'الخدمات',
      toDark: 'التبديل إلى الوضع الليلي',
      toLight: 'التبديل إلى الوضع النهاري',
      menuDark: 'الوضع الليلي',
      menuLight: 'الوضع النهاري'
    },
    en: {
      title: 'SENAI — BRAND & WEB DESIGN',
      description: 'A logo, identity, website or landing page. One designer and developer delivers it — no middlemen.',
      nav: 'Primary navigation',
      mobileNav: 'Navigation',
      openMenu: 'Open menu',
      closeMenu: 'Close menu',
      language: 'Language',
      wa: 'Contact on WhatsApp',
      quickLinks: 'Quick links',
      home: 'SENAI — Home',
      services: 'Services',
      toDark: 'Switch to dark mode',
      toLight: 'Switch to light mode',
      menuDark: 'Dark mode',
      menuLight: 'Light mode'
    }
  };

  var projectAlts = {
    'ora.webp': {
      ar: 'ORA — متجر مجوهرات من تصميم SENAI',
      en: 'ORA — jewelry store website designed by SENAI'
    },
    'ghaim.webp': {
      ar: 'GHAIM — متجر ملابس أطفال من تصميم SENAI',
      en: 'GHAIM — childrenswear store designed by SENAI'
    },
    'rewa.webp': {
      ar: 'REWA — مفهوم هوية فندقية من تصميم SENAI',
      en: 'REWA — hospitality identity concept by SENAI'
    },
    'torquaz.webp': {
      ar: 'TORQUAZ — هوية بصرية لعلامة أزياء من تصميم SENAI',
      en: 'TORQUAZ — fashion brand identity by SENAI'
    }
  };

  var metaDescription = document.querySelector('meta[name="description"]');
  var themeColorMeta = document.getElementById('theme-color-meta');
  var header = document.getElementById('site-header');
  var menu = document.getElementById('mobile-menu');
  var menuToggle = document.querySelector('.menu-toggle');
  var menuWasOpen = false;
  var lastFocused = null;

  function currentLang() {
    return root.getAttribute('lang') === 'en' ? 'en' : 'ar';
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  }

  function setTheme(theme, persist) {
    theme = theme === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
    if (persist !== false) storage.set('senai-theme', theme);

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#1A1511' : '#F5F0E6');
    }

    var t = copy[currentLang()];
    var label = theme === 'dark' ? t.toLight : t.toDark;

    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      button.setAttribute('aria-label', label);
      button.setAttribute('title', label);
      button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    });

    document.querySelectorAll('[data-theme-text]').forEach(function (el) {
      el.textContent = theme === 'dark' ? t.menuLight : t.menuDark;
    });
  }

  function setLanguage(lang, persist) {
    lang = lang === 'en' ? 'en' : 'ar';
    root.setAttribute('lang', lang);
    root.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    if (persist !== false) storage.set('senai-lang', lang);

    document.querySelectorAll('[data-set-lang]').forEach(function (button) {
      var active = button.getAttribute('data-set-lang') === lang;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    var t = copy[lang];
    document.title = t.title;
    if (metaDescription) metaDescription.setAttribute('content', t.description);

    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', t.title);
    if (ogDescription) ogDescription.setAttribute('content', t.description);

    setStaticLabels(lang);
    setTheme(currentTheme(), false);
    updateImageAlts(lang);
  }

  function setStaticLabels(lang) {
    var t = copy[lang];

    var primaryNav = document.getElementById('primary-nav');
    if (primaryNav) primaryNav.setAttribute('aria-label', t.nav);

    var mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) mobileNav.setAttribute('aria-label', t.mobileNav);

    document.querySelectorAll('.lang-switch').forEach(function (el) {
      el.setAttribute('aria-label', t.language);
    });

    document.querySelectorAll('[data-menu-close]').forEach(function (el) {
      el.setAttribute('aria-label', t.closeMenu);
    });

    var isOpen = menu && menu.classList.contains('is-open');
    if (menuToggle) {
      menuToggle.setAttribute('aria-label', isOpen ? t.closeMenu : t.openMenu);
      menuToggle.setAttribute('title', isOpen ? t.closeMenu : t.openMenu);
    }

    document.querySelectorAll('.wa-float, .hero__actions .text-link, .footer__contact a[href*="wa.me"]').forEach(function (el) {
      el.setAttribute('aria-label', t.wa);
    });

    document.querySelectorAll('.brand, .footer__logo').forEach(function (el) {
      el.setAttribute('aria-label', t.home);
    });

    var footerNav = document.querySelector('.footer__nav');
    if (footerNav) footerNav.setAttribute('aria-label', t.quickLinks);

    var ticker = document.querySelector('.hero__ticker');
    if (ticker) ticker.setAttribute('aria-label', t.services);
  }

  function updateImageAlts(lang) {
    document.querySelectorAll('.work__media img').forEach(function (img) {
      var file = (img.getAttribute('src') || '').split('/').pop();
      var alt = projectAlts[file];
      if (alt) img.setAttribute('alt', alt[lang]);

      var work = img.closest('.work');
      var link = img.closest('.work__media');
      var name = work ? work.querySelector('.work__name') : null;
      if (link && name) {
        link.setAttribute('aria-label', name.textContent.trim() + (lang === 'ar' ? ' — عرض المشروع' : ' — View project'));
      }
    });
  }

  /* ---------- Mobile menu ---------- */

  function focusableInMenu() {
    if (!menu) return [];
    return Array.prototype.slice.call(menu.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
      .filter(function (el) {
        return el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0;
      });
  }

  function openMenu() {
    if (!menu || !menuToggle) return;
    menuWasOpen = true;
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    menu.removeAttribute('inert');
    menu.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.setAttribute('aria-label', copy[currentLang()].closeMenu);
    body.classList.add('menu-open');

    window.requestAnimationFrame(function () {
      var closeButton = menu.querySelector('.mobile-menu__top [data-menu-close]');
      if (closeButton) closeButton.focus();
    });
  }

  function closeMenu(returnFocus) {
    if (!menu || !menuToggle) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    menu.setAttribute('inert', '');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', copy[currentLang()].openMenu);
    body.classList.remove('menu-open');

    if (returnFocus !== false) {
      var target = lastFocused && document.contains(lastFocused) ? lastFocused : menuToggle;
      target.focus();
    }
    menuWasOpen = false;
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', function () {
      if (menu.classList.contains('is-open')) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll('[data-menu-close]').forEach(function (button) {
      button.addEventListener('click', function () { closeMenu(); });
    });

    menu.querySelectorAll('.mobile-nav a').forEach(function (link) {
      link.addEventListener('click', function () { closeMenu(false); });
    });

    document.addEventListener('keydown', function (event) {
      if (!menu.classList.contains('is-open')) return;

      if (event.key === 'Escape') {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== 'Tab') return;
      var nodes = focusableInMenu();
      if (!nodes.length) return;
      var first = nodes[0];
      var last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1099 && menu.classList.contains('is-open')) {
        closeMenu(false);
      }
    });
  }

  /* ---------- Header state ---------- */

  var hero = document.querySelector('.hero');
  var waFloat = document.querySelector('.wa-float');

  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
    if (waFloat) {
      var threshold = hero ? Math.min(hero.offsetHeight * 0.7, window.innerHeight * 0.7) : 240;
      waFloat.classList.toggle('is-visible', window.scrollY > threshold);
    }
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* ---------- Active navigation ---------- */

  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.primary-nav .nav__link'));
  var sections = navLinks.map(function (link) {
    var id = link.getAttribute('href');
    return id && id.charAt(0) === '#' ? document.querySelector(id) : null;
  }).filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });

    sections.forEach(function (section) { navObserver.observe(section); });
  }

  /* ---------- Reveal on scroll ---------- */

  var revealItems = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealItems.forEach(function (item) { revealObserver.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('is-visible'); });
  }

  /* ---------- Language buttons ---------- */

  document.querySelectorAll('[data-set-lang]').forEach(function (button) {
    button.addEventListener('click', function () {
      setLanguage(button.getAttribute('data-set-lang'));
    });
  });

  document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
    button.addEventListener('click', function () {
      setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    });
  });

  /* ---------- Initial state ---------- */

  setLanguage(currentLang(), false);
  setTheme(currentTheme(), false);
})();
