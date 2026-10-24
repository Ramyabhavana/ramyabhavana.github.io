/**
 * Ramya Bhavana - Portfolio Interactive Logic
 * Minimalist Monochrome Theme & Interaction
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Dynamic Current Year ---
  const yearElem = document.getElementById('current-year');
  if (yearElem) {
    yearElem.textContent = new Date().getFullYear();
  }

  // --- Dallas Live Time ---
  function updateDallasTime() {
    const timeElem = document.getElementById('dallas-time');
    if (timeElem) {
      try {
        const options = {
          timeZone: 'America/Chicago',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        };
        const formatter = new Intl.DateTimeFormat([], options);
        timeElem.textContent = `${formatter.format(new Date())} CT (Dallas, TX)`;
      } catch (e) {
        timeElem.textContent = 'Dallas, TX (Central Time)';
      }
    }
  }
  updateDallasTime();
  setInterval(updateDallasTime, 60000);

  // --- Theme Toggle (Monochrome Dark / Light) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('rb_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rb_theme', newTheme);
      showToast(newTheme === 'dark' ? 'Switched to Dark Theme' : 'Switched to Light Theme');
      if (window.lucide) window.lucide.createIcons();
    });
  }

  // --- Mobile Menu Toggle ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('is-open');
      mobileToggle.classList.toggle('is-open', isOpen);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('is-open');
        mobileToggle.classList.remove('is-open');
      });
    });
  }

  // --- Active Nav on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-links a[href*="${sectionId}"]`);
      
      if (navItem) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navItem.classList.add('active');
        } else {
          navItem.classList.remove('active');
        }
      }
    });
  });

  // --- Skill Filter ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');

  function filterSkills(filterValue) {
    filterBtns.forEach(b => {
      if (b.getAttribute('data-filter') === filterValue) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });

    skillCards.forEach(card => {
      const category = card.getAttribute('data-category');
      if (filterValue === 'all' || category === filterValue) {
        card.style.display = 'flex';
        card.style.opacity = '0';
        setTimeout(() => {
          card.style.transition = 'opacity 0.25s ease';
          card.style.opacity = '1';
        }, 30);
      } else {
        card.style.display = 'none';
      }
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');
      filterSkills(filterValue);
    });
  });

  // --- Copy to Clipboard Toast ---
  const copyButtons = document.querySelectorAll('.copy-btn');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  function showToast(message) {
    if (!toast) return;
    toastMessage.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  copyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          fallbackCopyText(textToCopy);
        });
      } else {
        fallbackCopyText(textToCopy);
      }
    });
  });

  function fallbackCopyText(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied "${text}" to clipboard!`);
    } catch (err) {
      showToast('Could not copy automatically.');
    }
    document.body.removeChild(textArea);
  }

  // --- Back to Top Button ---
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // --- Contact Form Submission Handling ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const name = document.getElementById('form-name').value;
      const email = document.getElementById('form-email').value;
      const subject = document.getElementById('form-subject').value;
      const message = document.getElementById('form-message').value;

      const mailtoUrl = `mailto:ramyasaibhavana439@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      )}`;

      window.location.href = mailtoUrl;
      showToast('Opening your email client...');
      e.preventDefault();
    });
  }
});
