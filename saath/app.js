/**
 * Saath - Privacy Policy & Legal Portal JavaScript
 * Author: Suraj Sahani (martialcoder)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTOC();
  initCopyButtons();
});

// Theme Management
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const currentTheme = localStorage.getItem('saath_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateToggleIcon(toggleBtn, currentTheme);

  toggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('saath_theme', newTheme);
    updateToggleIcon(toggleBtn, newTheme);
  });
}

function updateToggleIcon(btn, theme) {
  btn.innerHTML = theme === 'dark' 
    ? '<i class="fas fa-sun"></i>' 
    : '<i class="fas fa-moon"></i>';
  btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
}

// Table of Contents Active Link Tracking
function initTOC() {
  const sections = document.querySelectorAll('.content-card[id]');
  const navLinks = document.querySelectorAll('.toc-nav a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0.1,
    }
  );

  sections.forEach((section) => observer.observe(section));
}

// Quick Copy URL Functionality
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', async () => {
      const target = btn.getAttribute('data-copy');
      let textToCopy = window.location.href;

      if (target === 'current-url') {
        textToCopy = window.location.href;
      } else if (target === 'policy-url') {
        textToCopy = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '/privacy.html');
      } else if (target) {
        textToCopy = target;
      }

      try {
        await navigator.clipboard.writeText(textToCopy);
        showToast('Copied to clipboard: ' + textToCopy);
      } catch (err) {
        // Fallback
        const input = document.createElement('input');
        input.value = textToCopy;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        showToast('Copied to clipboard!');
      }
    });
  });
}

// Global Toast Message
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981;"></i> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}
