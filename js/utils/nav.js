'use strict';

(function initSharedNav() {
  const runNav = () => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 10);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    
    const currentPath = window.location.pathname;
    const breadcrumb = document.querySelector('.breadcrumb a[href*="categories/"]');
    const categoryFilename = breadcrumb ? breadcrumb.getAttribute('href').split('/').pop() : '';

    document.querySelectorAll('.nav-link, .nav-mobile-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      const linkFilename = href.split('/').pop().split('#')[0];
      
      let isActive = false;
      
      const isHomeLink = linkFilename === 'index.html' || href === '/' || href === '';
      const isHomePath = currentPath === '/' || currentPath.endsWith('/index.html') || currentPath.includes('/index.html');
      
      if (isHomeLink && isHomePath) {
        isActive = true;
      } else if (!isHomePath) {
        if (categoryFilename && linkFilename === categoryFilename) {
          isActive = true;
        } else {
          const pathFilename = currentPath.split('/').pop();
          if (linkFilename && pathFilename === linkFilename) {
            isActive = true;
          } else if (linkFilename && currentPath.includes('/categories/' + linkFilename.replace('.html', ''))) {
            isActive = true;
          }
        }
      }
      
      
      
      if (isActive) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });

    
    const burger = document.getElementById('nav-hamburger');
    const drawer = document.getElementById('nav-mobile-drawer');

    if (burger && drawer) {
      burger.addEventListener('click', () => {
        const isOpen = burger.classList.toggle('open');
        drawer.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        drawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
        document.body.style.overflow = isOpen ? 'hidden' : '';
      });

      
      drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
          burger.classList.remove('open');
          drawer.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        });
      });

      
      document.addEventListener('click', (e) => {
        if (burger.classList.contains('open') && !navbar.contains(e.target) && !drawer.contains(e.target)) {
          burger.classList.remove('open');
          drawer.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });

      
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && burger.classList.contains('open')) {
          burger.classList.remove('open');
          drawer.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          drawer.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      });
    }

    
    const toggleContainer = document.getElementById('dark-toggle-container');
    if (toggleContainer && typeof DarkModeToggle !== 'undefined') {
      const toggle = DarkModeToggle.getInstance();
      if (!toggleContainer.hasChildNodes()) {
        toggleContainer.appendChild(toggle.render());
      }
    }

    
    const toolLayout = document.getElementById('tool-layout');
    if (toolLayout) {
      const adjustLayout = () => {
        toolLayout.style.gridTemplateColumns = window.innerWidth < 900 ? '1fr' : '';
      };
      window.addEventListener('resize', adjustLayout, { passive: true });
      adjustLayout();
    }

    
    const contactLayout = document.getElementById('contact-layout');
    if (contactLayout) {
      const adjustContact = () => {
        contactLayout.style.gridTemplateColumns = window.innerWidth < 700 ? '1fr' : '1fr 1fr';
      };
      window.addEventListener('resize', adjustContact, { passive: true });
      adjustContact();
    }

  };

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    runNav();
  } else {
    document.addEventListener('DOMContentLoaded', runNav);
  }
})();