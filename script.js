/* ============================================
   BULL HORN LANDSCAPING — Main Script
   ============================================ */

/* ---------- Navbar scroll effect ---------- */
const navbar = document.querySelector('.navbar');
function handleNavScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ---------- Mobile nav toggle ---------- */
const hamburger  = document.querySelector('.hamburger');
const navMobile  = document.querySelector('.nav-mobile');
const mobileLinks = document.querySelectorAll('.nav-mobile a');

function toggleMobileNav() {
  const open = hamburger.classList.toggle('open');
  navMobile.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileNav);
mobileLinks.forEach(link => link.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navMobile.classList.remove('open');
  document.body.style.overflow = '';
}));

/* ---------- Scroll reveal ---------- */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ---------- Animated counters ---------- */
function animateCounter(el) {
  const target  = parseFloat(el.dataset.target);
  const suffix  = el.dataset.suffix || '';
  const prefix  = el.dataset.prefix || '';
  const duration = 1800;
  const step     = 16;
  const steps    = duration / step;
  const increment = target / steps;
  let current = 0;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    const display = Number.isInteger(target) ? Math.floor(current) : current.toFixed(1);
    el.textContent = prefix + display + suffix;
  }, step);
}

const counterEls = document.querySelectorAll('[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

counterEls.forEach(el => counterObserver.observe(el));

/* ---------- Smooth scroll for nav links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ---------- Contact form ---------- */
const form = document.querySelector('#contact-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;

    btn.innerHTML = 'Sending…';
    btn.disabled = true;

    try {
      const formData = new FormData(form);
      const object = {
        access_key: '50e3f328-100b-43f1-93f0-3551c235642c',
        subject: 'New Quote Request — Bull Horn Landscaping',
        from_name: 'Bull Horn Website',
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        service: formData.get('service'),
        message: formData.get('message')
      };
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(object)
      });
      const json = await res.json();
      console.log('Web3Forms response:', json);

      if (json.success) {
        btn.innerHTML = '✅ Message Sent! We\'ll be in touch soon.';
        btn.style.background = 'var(--green-light)';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 5000);
      } else {
        console.error('Web3Forms error:', json.message);
        throw new Error(json.message);
      }
    } catch (err) {
      console.error('Submit error:', err);
      btn.innerHTML = '❌ Something went wrong. Please call us directly.';
      btn.style.background = '#c0392b';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    }
  });
}
