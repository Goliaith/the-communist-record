// Shared navigation active state + polish interactions
document.addEventListener('DOMContentLoaded', () => {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('nav-active');
    }
  });

  // Add search icon to nav for modern UX (global)
  const navFlex = document.querySelector('nav .flex.items-center.gap-x-2') || document.querySelector('nav .flex.items-center');
  if (navFlex) {
    const searchIcon = document.createElement('button');
    searchIcon.innerHTML = '🔍';
    searchIcon.className = 'px-2 py-1 hover:bg-slate-800 rounded text-sm';
    searchIcon.title = 'Search';
    searchIcon.onclick = window.openSearchModal;
    navFlex.appendChild(searchIcon);
  }

  // Highlight dropdown parents when a child link is active
  document.querySelectorAll('nav .group').forEach(group => {
    const hasActiveChild = group.querySelector('a.nav-active');
    if (hasActiveChild) {
      const trigger = group.querySelector('div');
      if (trigger) {
        trigger.classList.add('nav-active');
      }
    }
  });

  // Improved dropdown handling: hover with delay + click toggle for reliability
  const dropdownGroups = document.querySelectorAll('nav .group');
  dropdownGroups.forEach(group => {
    const menu = group.querySelector('.absolute');
    if (!menu) return;

    let hideTimeout = null;

    const showMenu = () => {
      clearTimeout(hideTimeout);
      menu.classList.remove('hidden');
      menu.classList.add('block');
    };

    const scheduleHide = () => {
      hideTimeout = setTimeout(() => {
        menu.classList.remove('block');
        menu.classList.add('hidden');
      }, 200); // 200ms grace period to cross any micro-gap or select item
    };

    // Hover behavior on the entire group container
    group.addEventListener('mouseenter', showMenu);
    group.addEventListener('mouseleave', scheduleHide);

    // Keep open when hovering directly over the menu
    menu.addEventListener('mouseenter', () => clearTimeout(hideTimeout));
    menu.addEventListener('mouseleave', scheduleHide);

    // Click/tap toggle (important for touch devices and accessibility)
    const trigger = group.querySelector('div');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const isCurrentlyOpen = menu.classList.contains('block');

        // Close all other dropdowns
        dropdownGroups.forEach(g => {
          const m = g.querySelector('.absolute');
          if (m && m !== menu) {
            m.classList.remove('block');
            m.classList.add('hidden');
          }
        });

        if (isCurrentlyOpen) {
          menu.classList.remove('block');
          menu.classList.add('hidden');
        } else {
          menu.classList.remove('hidden');
          menu.classList.add('block');
        }
      });
    }

    // Auto-close after clicking a link inside (page will usually navigate)
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('block');
        menu.classList.add('hidden');
      });
    });
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

  // Animated counters for attention-grabbing numbers (used on home "In 30 Seconds")
  function animateCounter(el, duration = 1400) {
    const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
    if (!target || isNaN(target)) return;

    const startTime = performance.now();
    const startValue = 0;

    const step = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current = Math.floor(startValue + (target - startValue) * eased);

      if (el.textContent.includes('+')) {
        el.textContent = current + '+';
      } else if (el.textContent.includes('M')) {
        el.textContent = current + 'M+';
      } else {
        el.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        // final value
        if (el.textContent.includes('+')) el.textContent = target + '+';
        else if (target >= 100) el.textContent = target + (el.textContent.includes('M') ? 'M+' : '');
        else el.textContent = target.toLocaleString();
      }
    };
    requestAnimationFrame(step);
  }

  // Trigger counters when they come into view
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counters.forEach(c => animateCounter(c));
          observer.disconnect();
        }
      });
    }, { threshold: 0.4 });
    observer.observe(counters[0]);
  }

  // Initialize sources search on any page
  if (typeof window.initSourcesSearch === 'function') {
    window.initSourcesSearch();
  }

  // Scroll reveal for .reveal elements
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    reveals.forEach(el => revealObserver.observe(el));
  }

  // Simple share buttons for facts and visuals - always copy to clipboard
  window.shareFact = function(text, url = window.location.href) {
    const fullText = text + ' — ' + url;
    navigator.clipboard.writeText(fullText).then(() => {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-sm px-4 py-2 rounded-full border border-slate-600 shadow';
      toast.textContent = 'Copied to clipboard';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1800);
    }).catch(() => {
      // fallback if clipboard fails
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 bg-slate-800 text-sm px-4 py-2 rounded-full border border-slate-600 shadow';
      toast.textContent = 'Copy failed - try manually';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 1800);
    });
  };

  // Home journey filter via search input and buttons
  window.filterJourney = function(type) {
    const cards = document.querySelectorAll('#journey .grid a');
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      let show = true;
      if (type === 'historical') show = !text.includes('modern') && !text.includes('dsa') && !text.includes('funding');
      if (type === 'modern') show = text.includes('modern') || text.includes('dsa') || text.includes('funding');
      card.style.display = show ? '' : 'none';
    });
  };

  const homeSearch = document.querySelector('input[placeholder*="Search site"]');
  if (homeSearch && (window.location.pathname.endsWith('index.html') || window.location.pathname === '/')) {
    const journeyCards = document.querySelectorAll('#journey .grid a');
    homeSearch.addEventListener('input', () => {
      const term = homeSearch.value.toLowerCase();
      journeyCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        card.style.display = term === '' || text.includes(term) ? '' : 'none';
      });
    });
  }

  // Simple live search for sources page (and any page with #sources-search)
  window.initSourcesSearch = function() {
    const input = document.getElementById('sources-search');
    if (!input) return;
    input.addEventListener('input', () => {
      const term = input.value.toLowerCase().trim();
      // Filter all list items and paragraphs on the page for simplicity
      document.querySelectorAll('li, p, .card, .source-item').forEach(item => {
        if (item.closest('nav') || item.closest('footer')) return;
        const text = item.textContent.toLowerCase();
        item.style.display = term === '' || text.includes(term) ? '' : 'none';
      });
    });
  };

  // Random stark fact generator for homepage engagement
  window.showRandomFact = function() {
    const facts = [
      "94+ million people killed by communist regimes in the 20th century — more than both World Wars combined.",
      "China's Great Leap Forward alone caused 30-45 million deaths in just a few years through famine.",
      "The Soviet Gulag system held up to 18 million people; millions died from starvation, cold, and overwork.",
      "Cambodia's Khmer Rouge killed about 2 million — a quarter of the population — in under 4 years.",
      "No Nobel Prizes in science came from purely centrally planned economies during their peak.",
      "China lifted 800M+ from poverty only AFTER introducing market reforms and private incentives.",
      "The 'long march through the institutions' strategy was explicitly outlined by Gramsci and adopted by modern radicals."
    ];
    const fact = facts[Math.floor(Math.random() * facts.length)];
    const toast = document.createElement('div');
    toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 max-w-[90%] bg-slate-900 border border-red-800 text-sm px-4 py-3 rounded-2xl shadow-xl z-[100]';
    toast.innerHTML = `<div class="flex items-start gap-2"><span>${fact}</span></div>`;
    document.body.appendChild(toast);
    // Auto remove after several seconds (no manual close needed)
    setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 6000);
  };

  // Funding flow detail helper (used on funding page)
  window.showFlowDetail = function(type) {
    const el = document.getElementById('flow-detail');
    if (!el) return;

    const details = [
      "Most groups (CPUSA, WWP, FRSO, etc.) are sustained almost entirely by small monthly dues from members. This is the traditional, low-volume model.",
      "Neville Roy Singham’s network (via donor-advised funds and nonprofits) sent roughly $278 million into the ecosystem. The People’s Forum alone received ~$20–22M.",
      "Money from the Singham-backed People’s Forum flows into PSL organizing, the ANSWER Coalition, Code Pink actions, and related media. This creates infrastructure far beyond what dues alone can support."
    ];
    el.innerHTML = details[type] || '';
  };

  // Timeline era filter (used on timeline.html)
  window.filterTimeline = function(era) {
    const items = document.querySelectorAll('.timeline-item');
    let firstVisible = null;
    items.forEach(item => {
      const yearText = item.querySelector('.year')?.textContent || '';
      let show = true;

      if (era === 'prewar') show = yearText.includes('18') || (parseInt(yearText) || 0) < 1940;
      if (era === 'coldwar') show = (parseInt(yearText) || 0) >= 1945 && (parseInt(yearText) || 0) < 1990;
      if (era === 'post') show = (parseInt(yearText) || 0) >= 1991 || yearText.toLowerCase().includes('legacy') || yearText.includes('200');
      if (era === '1917') show = yearText.includes('1917');
      if (era === '1930') show = yearText.includes('193') || yearText.includes('1929') || yearText.includes('1932');

      item.style.display = (era === 'all' || show) ? '' : 'none';
      if (!firstVisible && (era === 'all' || show)) firstVisible = item;
    });
    if (firstVisible) {
      firstVisible.scrollIntoView({ behavior: 'smooth', block: 'center' });
      firstVisible.classList.add('ring-2', 'ring-red-500');
      setTimeout(() => firstVisible.classList.remove('ring-2', 'ring-red-500'), 1500);
    }
  };

  // Jump to specific year and open accordion
  window.jumpToYear = function(year) {
    const items = document.querySelectorAll('.timeline-item');
    for (let item of items) {
      const yearText = item.querySelector('.year')?.textContent || '';
      if (yearText.includes(year)) {
        item.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        if (header && content) {
          if (!header.classList.contains('open')) {
            header.classList.add('open');
            content.classList.add('open');
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
        item.classList.add('ring-2', 'ring-red-500');
        setTimeout(() => item.classList.remove('ring-2', 'ring-red-500'), 1500);
        break;
      }
    }
  };

  // Simple global search modal for modern UX
  window.openSearchModal = function() {
    let modal = document.getElementById('search-modal');
    if (modal) {
      modal.style.display = 'flex';
      modal.querySelector('input').focus();
      return;
    }

    modal = document.createElement('div');
    modal.id = 'search-modal';
    modal.className = 'fixed inset-0 bg-black/70 z-[200] flex items-start justify-center pt-20';
    modal.innerHTML = `
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        <div class="p-4 border-b border-slate-700 flex">
          <input type="text" id="modal-search-input" placeholder="Search facts, groups, history..." class="flex-1 bg-transparent outline-none text-sm">
          <button onclick="document.getElementById('search-modal').remove()" class="ml-2 text-slate-400">✕</button>
        </div>
        <div id="search-results" class="p-2 max-h-80 overflow-auto text-sm"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const input = modal.querySelector('#modal-search-input');
    const results = modal.querySelector('#search-results');

    const pages = [
      { title: "Human Cost", url: "human-cost.html", keywords: "deaths 94m famine gulag cambodia" },
      { title: "Why It Fails", url: "why-it-fails.html", keywords: "calculation incentives stagnation comparison" },
      { title: "Modern Risks", url: "modern-risks.html", keywords: "dsa cultural marxism institutions" },
      { title: "Current Groups", url: "current-groups.html", keywords: "psl cpusa wwp frso funding singham" },
      { title: "Funding", url: "funding.html", keywords: "singham network money flow dues psl" },
      { title: "Timeline", url: "timeline.html", keywords: "history soviet china 1917 1939 1945" },
      { title: "Regimes", url: "regimes.html", keywords: "ussr china cuba venezuela" },
      { title: "Origins", url: "origins.html", keywords: "marx manifesto lenin gramsci" }
    ];

    input.oninput = () => {
      const q = input.value.toLowerCase().trim();
      results.innerHTML = '';
      if (!q) return;
      const filtered = pages.filter(p => p.title.toLowerCase().includes(q) || p.keywords.includes(q));
      filtered.forEach(p => {
        const div = document.createElement('div');
        div.className = 'p-2 hover:bg-slate-800 cursor-pointer rounded';
        div.innerHTML = `<strong>${p.title}</strong>`;
        div.onclick = () => { window.location.href = p.url; };
        results.appendChild(div);
      });
      if (filtered.length === 0) {
        results.innerHTML = '<div class="p-2 text-slate-400">No matches. Try "dsa", "singham", "famine", etc.</div>';
      }
    };

    // Close on outside click
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    input.focus();
  };

  // Dismissible What's New banner (remembers with localStorage)
  window.dismissWhatsNew = function() {
    const banner = document.getElementById('whats-new-banner');
    if (banner) {
      banner.style.transition = 'opacity 0.2s';
      banner.style.opacity = '0';
      setTimeout(() => {
        banner.style.display = 'none';
        localStorage.setItem('whatsNewDismissed', 'true');
      }, 200);
    }
  };

  // Hide banner if previously dismissed
  if (localStorage.getItem('whatsNewDismissed') === 'true') {
    const banner = document.getElementById('whats-new-banner');
    if (banner) banner.style.display = 'none';
  }

  // Floating back-to-top button for long pages (modern UX)
  if (document.body.scrollHeight > window.innerHeight * 2) {
    const backToTop = document.createElement('button');
    backToTop.innerHTML = '↑';
    backToTop.className = 'fixed bottom-4 right-4 w-10 h-10 bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center text-xl opacity-80 hover:opacity-100 transition z-[90] hidden';
    backToTop.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('hidden', window.scrollY < 400);
    });
  }

  // Interactive HTML flow highlighter for funding page
  window.highlightFlow = function(el, flowType) {
    // Remove previous highlights
    document.querySelectorAll('.flow-box').forEach(box => box.classList.remove('ring-2', 'ring-red-500', 'bg-red-900/30'));

    el.classList.add('ring-2', 'ring-red-500', 'bg-red-900/30');

    const explain = document.getElementById('flow-explain');
    if (!explain) return;

    const explanations = {
      'dues': 'Traditional model: Small recurring contributions from individual members fund basic operations for most communist organizations. Very limited scale.',
      'singham': 'External capital injection: ~$278M funneled through U.S. nonprofits (often using donor-advised funds). Dramatically increases capacity for specific aligned groups.',
      'forum': 'Pass-through hub: The People’s Forum receives the largest documented Singham transfers and serves as organizational and event infrastructure closely tied to PSL.',
      'psl': 'Primary beneficiary: PSL gains professional organizing staff, physical spaces (Liberation Centers), media, and protest coordination capacity far beyond member dues.',
      'answer': 'Protest infrastructure: ANSWER Coalition (closely linked to WWP/PSL circles) uses network funding for large-scale demonstrations and international solidarity work.',
      'codepink': 'Overlapping activism: Code Pink receives significant Singham-linked funding and frequently co-organizes with PSL/ANSWER actions.'
    };

    explain.innerHTML = `<strong>Selected flow:</strong> ${explanations[flowType] || 'Select a box to explore the flow.'}`;
  };
});