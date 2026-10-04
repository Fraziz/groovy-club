/**
 * GROOVY CLUB — Client Logic & Interactions
 * Manages mobile drawer, garment view tabs, category filter, unit converter,
 * product detail modal, newsletter subscription, and scroll observer.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const drawerClose = document.getElementById('drawer-close');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const drawerLinks = document.querySelectorAll('.drawer-link, .drawer-action');

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    drawerClose.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileToggle && drawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = drawer.classList.contains('open');
      isOpen ? closeDrawer() : openDrawer();
    });

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);

    drawerLinks.forEach((link) => {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
        mobileToggle.focus();
      }
    });
  }

  // 2. Sticky Header Elevation
  const siteHeader = document.getElementById('site-header');
  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    },
    { passive: true }
  );

  // 3. Signature Tee View Switcher Tabs
  const teeTabs = document.querySelectorAll('.tee-tab');
  const teePanels = document.querySelectorAll('.tee-view-panel');

  teeTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      teeTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      teePanels.forEach((p) => {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetId = tab.getAttribute('aria-controls');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.removeAttribute('hidden');
      }
    });
  });

  // 4. Collection Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      productCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // 5. Fit Guide Unit Converter (Inches vs Centimeters)
  const unitInches = document.getElementById('unit-inches');
  const unitCm = document.getElementById('unit-cm');
  const measureCells = document.querySelectorAll('#tee-measurements-table td[data-inch]');

  function setUnit(unit) {
    if (unit === 'cm') {
      unitCm.classList.add('active');
      unitCm.setAttribute('aria-checked', 'true');
      unitInches.classList.remove('active');
      unitInches.setAttribute('aria-checked', 'false');

      measureCells.forEach((cell) => {
        cell.textContent = cell.getAttribute('data-cm');
      });
    } else {
      unitInches.classList.add('active');
      unitInches.setAttribute('aria-checked', 'true');
      unitCm.classList.remove('active');
      unitCm.setAttribute('aria-checked', 'false');

      measureCells.forEach((cell) => {
        cell.textContent = cell.getAttribute('data-inch');
      });
    }
  }

  if (unitInches && unitCm) {
    unitInches.addEventListener('click', () => setUnit('inch'));
    unitCm.addEventListener('click', () => setUnit('cm'));
  }

  // 6. Product Quick-View Modal Catalog Data
  const productsData = {
    'tee-modal': {
      title: 'Signature Tee',
      kicker: 'Core Piece • In Development',
      desc: 'The foundational Groovy Club garment. Engineered from 260 GSM compact combed cotton with a thick 1.25" rib crewneck, controlled dropped shoulders, and subtle water-based screen print in signature #CEA370.',
      image: '/images/tee-front.jpg',
      thumbs: ['/images/tee-front.jpg', '/images/tee-back.jpg', '/images/tee-detail.jpg'],
      bullets: [
        'Heavyweight 260 GSM compact combed cotton',
        'Relaxed, slightly boxy silhouette with controlled dropped shoulders',
        'Thick, dense 1.25" structured 1x1 rib collar',
        'Matte water-based screen print in signature color #CEA370',
        'Pre-shrunk to retain measurements across washing',
      ],
      colors: [
        { name: 'Warm Ivory', hex: '#F5F1E8' },
        { name: 'Charcoal', hex: '#24221F' },
        { name: 'Soft Taupe', hex: '#DDD2C2' },
      ],
      status: 'In Development • Pre-Production Sample Refinement',
    },
    'heritage-modal': {
      title: 'Heritage Trouser',
      kicker: 'Tailoring • In Development',
      desc: 'Relaxed straight fit tailored with a clean single forward pleat and side waist adjusters. Cut from high-twist wool-cotton blend that drapes with graceful vertical lines over casual footwear or leather loafers.',
      image: '/images/heritage-trouser.jpg',
      thumbs: ['/images/heritage-trouser.jpg', '/images/hero-editorial.jpg', '/images/details-curve.jpg'],
      bullets: [
        'Single forward pleat with razor-sharp pressed front crease',
        'High-rise waist with extended tab closure and side buckle adjusters',
        'Substantial 340 GSM wool-cotton blend with soft fluid drape',
        'Lined to knee with breathable cotton cupro',
        'Unfinished hem allowing custom tailored break',
      ],
      colors: [
        { name: 'Charcoal', hex: '#24221F' },
        { name: 'Deep Espresso', hex: '#352A22' },
      ],
      status: 'In Development • Pattern & Rise Calibration',
    },
    'club-modal': {
      title: 'Club Trouser',
      kicker: 'Utility Tailoring • In Development',
      desc: 'A wider silhouette balancing relaxed comfort with refined utility details. Features the signature Groovy Curve arc on the front coin pocket and generous leg opening.',
      image: '/images/details-curve.jpg',
      thumbs: ['/images/details-curve.jpg', '/images/heritage-trouser.jpg'],
      bullets: [
        'Substantial washed cotton-linen twill',
        'Signature Groovy Curve curved coin pocket construction',
        'Wide straight cut with subtle taper at ankle',
        'Reinforced bar-tacking on all stress points',
        'Internal drawstring for flexible waist styling',
      ],
      colors: [
        { name: 'Charcoal', hex: '#24221F' },
        { name: 'Soft Taupe', hex: '#DDD2C2' },
      ],
      status: 'In Development • Pocket Seam Testing',
    },
    'evening-modal': {
      title: 'Evening Trouser',
      kicker: 'Formalwear • In Development',
      desc: 'Clean sartorial tailoring and elegant drape designed for elevated nighttime dressing. Crafted from a high-twist midnight charcoal gabardine with deep front pleats.',
      image: '/images/hero-editorial.jpg',
      thumbs: ['/images/hero-editorial.jpg', '/images/heritage-trouser.jpg'],
      bullets: [
        'High-twist worsted wool-cotton gabardine with natural crease resistance',
        'Double reverse pleats for dramatic drape in motion',
        'Clean concealed front fly and besom back pockets',
        'Full silk-touch lining',
      ],
      colors: [{ name: 'Midnight Charcoal', hex: '#24221F' }],
      status: 'In Development • Fabric Sourcing',
    },
    'weekend-modal': {
      title: 'Weekend Trouser',
      kicker: 'Casual Tailoring • In Development',
      desc: 'An easy silhouette featuring a relaxed waistband and internal drawstring. Unrestricted ease while preserving clean formal pleat lines.',
      image: '/images/lookbook-hero.jpg',
      thumbs: ['/images/lookbook-hero.jpg', '/images/hero-editorial.jpg'],
      bullets: [
        'Relaxed elasticated waistband with concealed cotton cord',
        'Single gentle pleat that holds structure without tightness',
        'Heavy brushed cotton jersey-twill hybrid',
        'Deep on-seam side pockets',
      ],
      colors: [
        { name: 'Soft Taupe', hex: '#DDD2C2' },
        { name: 'Warm Ivory', hex: '#F5F1E8' },
      ],
      status: 'In Development • Waistband Comfort Testing',
    },
    'pinstripe-modal': {
      title: 'Signature Pinstripe',
      kicker: 'Specialty Tailoring • In Development',
      desc: 'Vintage tailoring with a whisper-subtle tonal stripe woven with threads of our signature #CEA370 hue. Cut with high rise and generous cuff turn-ups.',
      image: '/images/details-curve.jpg',
      thumbs: ['/images/details-curve.jpg', '/images/heritage-trouser.jpg'],
      bullets: [
        'Custom woven wool-viscose blend with tonal micro-stripe',
        'Micro-accent stripe in signature color #CEA370',
        'Double forward pleats and 2-inch cuff hems',
        'Pick-stitched pockets and waistband edge',
      ],
      colors: [
        { name: 'Charcoal Stripe', hex: '#24221F' },
        { name: 'Signature Accent', hex: '#CEA370' },
      ],
      status: 'In Development • Loom Weave Testing',
    },
  };

  const modal = document.getElementById('product-modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalClose = document.getElementById('modal-close');
  const modalTitle = document.getElementById('modal-product-title');
  const modalKicker = document.getElementById('modal-kicker');
  const modalDesc = document.getElementById('modal-desc');
  const modalImg = document.getElementById('modal-img');
  const modalThumbs = document.getElementById('modal-thumbs');
  const modalBullets = document.getElementById('modal-bullets');
  const modalColors = document.getElementById('modal-colors');
  const openModalButtons = document.querySelectorAll('[data-open-modal]');

  function openModal(modalKey) {
    const data = productsData[modalKey] || productsData['tee-modal'];

    modalTitle.textContent = data.title;
    modalKicker.textContent = data.kicker;
    modalDesc.textContent = data.desc;
    modalImg.src = data.image;
    modalImg.alt = data.title;

    // Bullets
    modalBullets.innerHTML = '';
    data.bullets.forEach((bullet) => {
      const li = document.createElement('li');
      li.textContent = bullet;
      modalBullets.appendChild(li);
    });

    // Thumbs
    modalThumbs.innerHTML = '';
    data.thumbs.forEach((thumbSrc, index) => {
      const thumbBtn = document.createElement('button');
      thumbBtn.type = 'button';
      thumbBtn.className = `modal-thumb ${index === 0 ? 'active' : ''}`;
      thumbBtn.setAttribute('aria-label', `View image ${index + 1}`);
      const img = document.createElement('img');
      img.src = thumbSrc;
      img.alt = `${data.title} view ${index + 1}`;
      thumbBtn.appendChild(img);

      thumbBtn.addEventListener('click', () => {
        modalImg.src = thumbSrc;
        document.querySelectorAll('.modal-thumb').forEach((t) => t.classList.remove('active'));
        thumbBtn.classList.add('active');
      });

      modalThumbs.appendChild(thumbBtn);
    });

    // Colors
    modalColors.innerHTML = '';
    data.colors.forEach((col, idx) => {
      const span = document.createElement('span');
      span.className = `swatch-option ${idx === 0 ? 'active' : ''}`;
      span.style.backgroundColor = col.hex;
      span.title = col.name;
      span.setAttribute('aria-label', col.name);
      span.addEventListener('click', () => {
        document.querySelectorAll('.swatch-option').forEach((s) => s.classList.remove('active'));
        span.classList.add('active');
      });
      modalColors.appendChild(span);
    });

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openModalButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetModal = btn.getAttribute('data-open-modal');
      openModal(targetModal);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  const modalLinks = document.querySelectorAll('.modal-guide-link, .modal-notify-link');
  modalLinks.forEach((link) => {
    link.addEventListener('click', closeModal);
  });

  // 7. Newsletter / Join the Club Form
  const joinForm = document.getElementById('join-form');
  const emailInput = document.getElementById('newsletter-email');
  const formMessage = document.getElementById('form-message');

  if (joinForm && emailInput && formMessage) {
    joinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = emailInput.value.trim();

      if (!val || !val.includes('@') || !val.includes('.')) {
        formMessage.className = 'form-message error';
        formMessage.textContent = 'Please enter a valid email address.';
        return;
      }

      formMessage.className = 'form-message success';
      formMessage.textContent =
        'Welcome to the Club. You are on the priority list for our first physical run.';
      emailInput.value = '';
    });
  }

  // 8. Scroll Reveal Observer
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  // 9. Active Navigation Spy
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if ('IntersectionObserver' in window && sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((sec) => navObserver.observe(sec));
  }

  // 10. Dynamic Current Year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
