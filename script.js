document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav-links');
  const menuToggle = document.querySelector('.menu-toggle');
  const backTop = document.querySelector('.back-top');
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  const revealItems = document.querySelectorAll('.reveal, .reveal-group');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  const setActive = id => navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(visible.target.id);
    }, { threshold: [0.2, 0.45, 0.7], rootMargin: '-20% 0px -55% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  window.addEventListener('scroll', () => {
    if (backTop) backTop.classList.toggle('show', window.scrollY > 550);
  }, { passive: true });
  backTop?.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));

  const canTilt = window.matchMedia('(pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (canTilt) {
    document.querySelectorAll('.skill-card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(800px) rotateY(${x * 3}deg) rotateX(${y * -3}deg) translateY(-6px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }
});
