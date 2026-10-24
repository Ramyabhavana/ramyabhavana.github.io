/**
 * Ramya Bhavana - Portfolio Interactive Logic
 * SAP Signature GUI Theme & Command Navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // --- Dynamic Year ---
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

  // --- Theme Toggle (SAP Signature Light / Dark Horizon) ---
  const themeToggleBtn = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('rb_sap_theme') || 'signature';
  document.documentElement.setAttribute('data-theme', savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'signature' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('rb_sap_theme', newTheme);
      showToast(newTheme === 'dark' ? 'Switched to SAP Horizon Dark' : 'Switched to SAP Signature Light');
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
      const sectionTop = current.offsetTop - 120;
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

  // --- SAP GUI Command Bar & T-Code Logic ---
  const cmdInput = document.getElementById('sap-command-input');
  const cmdGoBtn = document.getElementById('sap-command-go');
  const tcodeChips = document.querySelectorAll('.tcode-chip');

  function executeTCode(rawCode) {
    if (!rawCode) return;
    const code = rawCode.trim().toUpperCase().replace(/^\/N/, '');

    const tcodeMap = {
      'VA01': { target: '#skills', filter: 'sd', msg: 'Session 1: Order-to-Cash / Sales Documents (VA01)' },
      'VA02': { target: '#skills', filter: 'sd', msg: 'Session 1: Sales Order Maintenance (VA02)' },
      'VK11': { target: '#skills', filter: 'sd', msg: 'Session 1: Pricing Procedures & Condition Techniques (VK11)' },
      'VL01N': { target: '#skills', filter: 'sd', msg: 'Session 1: Outbound Delivery & ATP Fulfillment (VL01N)' },
      'VF01': { target: '#skills', filter: 'sd', msg: 'Session 1: Billing Processing & Invoicing (VF01)' },
      'BP': { target: '#skills', filter: 's4', msg: 'Session 1: Business Partner & Customer Master (BP)' },
      'SPRO': { target: '#skills', filter: 'all', msg: 'Session 1: SAP Customizing Implementation Guide (SPRO)' },
      'ABOUT': { target: '#about', msg: 'Navigating to Executive Overview' },
      'EXP': { target: '#experience', msg: 'Navigating to Enterprise Experience' },
      'CERT': { target: '#certification', msg: 'Navigating to SAP Certification' },
      'SKILLS': { target: '#skills', filter: 'all', msg: 'Navigating to Skills Matrix' },
      'CONTACT': { target: '#contact', msg: 'Navigating to Contact Dispatcher' }
    };

    const match = tcodeMap[code];
    if (match) {
      if (match.filter) {
        filterSkills(match.filter);
      }
      const el = document.querySelector(match.target);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      showToast(`✔ ${match.msg}`);
    } else {
      // General search or jump
      const targetSec = document.querySelector(`#${code.toLowerCase()}`);
      if (targetSec) {
        targetSec.scrollIntoView({ behavior: 'smooth' });
        showToast(`✔ Navigating to #${code.toLowerCase()}`);
      } else {
        showToast(`ℹ T-Code "/n${code}" not recognized. Try VA01, VK11, VL01N, VF01, BP, or SPRO.`);
      }
    }

    if (cmdInput) cmdInput.value = '';
  }

  if (cmdInput && cmdGoBtn) {
    cmdGoBtn.addEventListener('click', () => {
      executeTCode(cmdInput.value);
    });

    cmdInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        executeTCode(cmdInput.value);
      }
    });
  }

  tcodeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const tcode = chip.getAttribute('data-tcode');
      executeTCode(tcode);
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
    }, 3200);
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
      showToast('Opening your email client to dispatch message...');
      e.preventDefault();
    });
  }
});
