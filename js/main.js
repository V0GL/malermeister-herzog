(function () {
  'use strict';

  var nav = document.querySelector('.main-nav');
  var toggle = document.querySelector('.nav-toggle');

  if (toggle && nav) {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'main-nav');

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      nav.classList.toggle('is-open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    nav.id = 'main-nav';

    document.querySelectorAll('.main-nav a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < 768) {
          nav.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });
  }

  // Smooth scroll for anchor links (same page)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    var href = anchor.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  });

  // Active state for one-page navigation links
  var sectionLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  var sectionIds = sectionLinks.map(function (link) { return link.getAttribute('href'); });
  var sections = sectionIds
    .map(function (id) { return document.querySelector(id); })
    .filter(function (node) { return !!node; });

  if (sectionLinks.length && sections.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      sectionLinks.forEach(function (link) {
        var active = link.getAttribute('href') === id;
        link.classList.toggle('is-active', active);
        if (active) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          setActive('#' + entry.target.id);
        }
      });
    }, {
      root: null,
      rootMargin: '-35% 0px -55% 0px',
      threshold: 0.01
    });

    sections.forEach(function (section) { observer.observe(section); });
    setActive(sectionLinks[0].getAttribute('href'));
  }
})();
