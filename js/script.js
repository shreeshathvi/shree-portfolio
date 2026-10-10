/**
 * ==============================================================================
 * SHREE SHATHVI — ULTRA-EDITORIAL PORTFOLIO ENGINE
 * Vanilla JavaScript (ES6+), Zero External Dependencies, Clean 60fps Interactions
 * ==============================================================================
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------------------------
     1. COLOR PALETTE CYCLING ON NAME CLICK (CORE INTERACTIVE FEATURE)
     ---------------------------------------------------------------------------- */
  const COLOR_PALETTE = [
    {
      name: 'Electric Violet',
      color: '#8b5cf6',
      glow: '0 0 25px rgba(139, 92, 246, 0.9), 0 0 50px rgba(139, 92, 246, 0.45)'
    },
    {
      name: 'Electric Cyan',
      color: '#00f0ff',
      glow: '0 0 25px rgba(0, 240, 255, 0.9), 0 0 50px rgba(0, 240, 255, 0.45)'
    },
    {
      name: 'Cyber Emerald',
      color: '#00ff88',
      glow: '0 0 25px rgba(0, 255, 136, 0.9), 0 0 50px rgba(0, 255, 136, 0.45)'
    },
    {
      name: 'Neon Red',
      color: '#ff0033',
      glow: '0 0 25px rgba(255, 0, 51, 0.9), 0 0 50px rgba(255, 0, 51, 0.45)'
    },
    {
      name: 'Hot Pink',
      color: '#ff007f',
      glow: '0 0 25px rgba(255, 0, 127, 0.9), 0 0 50px rgba(255, 0, 127, 0.45)'
    },
    {
      name: 'Cyber Gold',
      color: '#ffd700',
      glow: '0 0 25px rgba(255, 215, 0, 0.9), 0 0 50px rgba(255, 215, 0, 0.45)'
    },
    {
      name: 'Pure Ice White',
      color: '#ffffff',
      glow: '0 0 20px rgba(255, 255, 255, 0.85), 0 0 40px rgba(255, 255, 255, 0.4)'
    }
  ];

  let currentColorIndex = 0;
  const heroNameEl = document.getElementById('hero-name');
  const heroNameContainer = document.getElementById('hero-name-container');

  // Retrieve saved color from localStorage if present
  const savedColorIndex = localStorage.getItem('shree_name_color_index');
  if (savedColorIndex !== null) {
    const parsed = parseInt(savedColorIndex, 10);
    if (!isNaN(parsed) && parsed >= 0 && parsed < COLOR_PALETTE.length) {
      currentColorIndex = parsed;
    }
  }

  function applyNameColor(index, isAnimated = true) {
    const palette = COLOR_PALETTE[index];
    if (!heroNameEl) return;

    heroNameEl.style.color = palette.color;
    heroNameEl.style.textShadow = palette.glow;

    if (isAnimated) {
      // Subtle elegant scale bounce on click
      heroNameEl.style.transform = 'scale(1.03)';
      setTimeout(() => {
        heroNameEl.style.transform = '';
      }, 180);
    }

    localStorage.setItem('shree_name_color_index', index.toString());
  }

  // Initialize initial name color
  applyNameColor(currentColorIndex, false);

  // Click on Name to change color
  if (heroNameContainer) {
    heroNameContainer.addEventListener('click', () => {
      currentColorIndex = (currentColorIndex + 1) % COLOR_PALETTE.length;
      applyNameColor(currentColorIndex, true);
    });

    // Clean 3D Mouse Parallax on Name container
    heroNameContainer.addEventListener('mousemove', (e) => {
      const rect = heroNameContainer.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      heroNameEl.style.transform = `perspective(1000px) rotateX(${-y * 12}deg) rotateY(${x * 12}deg) scale(1.02)`;
    });

    heroNameContainer.addEventListener('mouseleave', () => {
      heroNameEl.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }


  /* ----------------------------------------------------------------------------
     2. TOP SCROLL PROGRESS BAR
     ---------------------------------------------------------------------------- */
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  window.addEventListener('scroll', () => {
    if (!scrollProgressBar) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? scrollTop / docHeight : 0;
    scrollProgressBar.style.transform = `scaleX(${scrollPercent})`;
  }, { passive: true });


  /* ----------------------------------------------------------------------------
     3. RIGHT RAIL NAVIGATION & SCROLLSPY (DESKTOP)
     ---------------------------------------------------------------------------- */
  const railNavItems = document.querySelectorAll('.rail-nav-item');
  const sectionIds = ['intro', 'profile', 'summary', 'education', 'experience', 'projects', 'capabilities', 'connect'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  // Smooth scroll click handler for rail items
  railNavItems.forEach(item => {
    item.addEventListener('click', () => {
      const targetId = item.getAttribute('data-target');
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // IntersectionObserver for active section highlighting
  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -40% 0px',
      threshold: [0, 0.25, 0.5, 0.75]
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          railNavItems.forEach(navItem => {
            const match = navItem.getAttribute('data-target') === currentId;
            navItem.classList.toggle('active', match);
          });
        }
      });
    }, observerOptions);

    sections.forEach(sec => sectionObserver.observe(sec));
  }


  /* ----------------------------------------------------------------------------
     4. MOBILE NAVIGATION (HAMBURGER & DRAWER)
     ---------------------------------------------------------------------------- */
  const mobileHamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileDrawerLinks = document.querySelectorAll('.mobile-drawer-link');

  if (mobileHamburgerBtn && mobileDrawer) {
    mobileHamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileHamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileDrawerLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href').replace('#', '');
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          e.preventDefault();
          mobileDrawer.classList.remove('open');
          document.body.style.overflow = '';
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }


  /* ----------------------------------------------------------------------------
     5. THEME SWITCHER (DARK / LIGHT THEME)
     ---------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('shree_theme_preference', newTheme);
  }

  if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
  if (mobileThemeToggle) mobileThemeToggle.addEventListener('click', toggleTheme);


  /* ----------------------------------------------------------------------------
     6. SUMMARY SECTION TYPEWRITER EFFECT
     ---------------------------------------------------------------------------- */
  const summaryTextEl = document.getElementById('summary-typewriter-text');
  if (summaryTextEl) {
    const fullText = "Computer Science graduate with hands-on experience in building practical software architectures and predictive machine learning models. I work with Python, Java, Spring Boot, and MySQL to turn real-world data into clean, functional, and dependable digital systems — and I apply Scikit-Learn and Pandas to build ML models that actually solve problems.";
    let hasTyped = false;

    const summarySection = document.getElementById('summary');
    if (summarySection) {
      const summaryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasTyped) {
            hasTyped = true;
            let charIndex = 0;
            summaryTextEl.textContent = '';

            const typingInterval = setInterval(() => {
              if (charIndex < fullText.length) {
                summaryTextEl.textContent += fullText.charAt(charIndex);
                charIndex++;
              } else {
                clearInterval(typingInterval);
              }
            }, 12);
          }
        });
      }, { threshold: 0.2 });

      summaryObserver.observe(summarySection);
    }
  }


  /* ----------------------------------------------------------------------------
     7. PROJECTS CATEGORY FILTERING
     ---------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterCategory === 'all' || categories.includes(filterCategory)) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });


  /* ----------------------------------------------------------------------------
     8. RESUME DOWNLOAD TOAST NOTIFICATION
     ---------------------------------------------------------------------------- */
  const resumeDownloadBtn = document.getElementById('resume-download-btn');
  const toastNotification = document.getElementById('toast-notification');

  function showToast(message) {
    if (!toastNotification) return;
    toastNotification.textContent = message;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3500);
  }

  if (resumeDownloadBtn) {
    resumeDownloadBtn.addEventListener('click', () => {
      showToast('Resume Download Initiated');
    });
  }

  // 3D Card Hover Tilt Effect for Editorial Glass Cards
  const tiltCards = document.querySelectorAll('.editorial-card-frame, .project-card, .education-card, .resume-cta-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

});
