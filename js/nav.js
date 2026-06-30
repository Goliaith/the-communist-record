// Shared navigation active state + polish interactions
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('nav-active');
    }
  });

  // Smooth scroll for internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Subtle scroll progress indicator on long pages (optional nice touch)
  if (document.body.scrollHeight > window.innerHeight * 1.5) {
    const progress = document.createElement('div');
    progress.style.cssText = 'position:fixed;top:0;left:0;height:2px;background:#b91c1c;z-index:9999;transition:width 0.1s ease;';
    document.body.appendChild(progress);
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progress.style.width = scrolled + '%';
    });
  }

  // Simple accordion support for .accordion-header + .accordion-content
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const content = header.nextElementSibling;
      if (!content || !content.classList.contains('accordion-content')) return;
      const isOpen = header.classList.contains('open');
      header.classList.toggle('open');
      content.classList.toggle('open');

      if (!isOpen) {
        // Opening: measure full height (scrollHeight includes padding + child margins) + buffer
        // to prevent bottom text cutoff even with complex content (lists, callouts, etc).
        content.style.maxHeight = (content.scrollHeight + 80) + 'px';
      } else {
        // Closing: lock current height then animate to 0 for smooth transition
        content.style.maxHeight = content.scrollHeight + 'px';
        void content.offsetHeight; // force reflow to register the starting height
        content.style.maxHeight = '0';
      }
    });

    // After transition completes, if open set to 'none' so full natural height is used (no clipping)
    const content = header.nextElementSibling;
    if (content && content.classList.contains('accordion-content')) {
      content.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'max-height' && header.classList.contains('open')) {
          content.style.maxHeight = 'none';
        }
      });
    }
  });
});