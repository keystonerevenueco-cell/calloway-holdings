document.addEventListener('DOMContentLoaded', function() {

    // 1. MOBILE MENU TOGGLE DRAWER
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('is-open');
            
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('is-open');
            mobileToggle.setAttribute('aria-expanded', !isOpen);
        });

        // Close menu on clicking outside
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('is-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('is-open');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // 2. ACTIVE NAVIGATION HIGHLIGHTING ACROSS PAGES
    const updateActiveNav = () => {
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentHash = window.location.hash;
        const navLinks = document.querySelectorAll('.nav-link');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            link.classList.remove('active-nav');

            const [linkPage, linkHash] = href.split('#');
            const cleanLinkPage = linkPage === '' ? 'index.html' : linkPage;

            if (cleanLinkPage === currentPath) {
                if (currentHash) {
                    if (linkHash && `#${linkHash}` === currentHash) {
                        link.classList.add('active-nav');
                    }
                } else if (!linkHash || linkHash === 'home') {
                    link.classList.add('active-nav');
                }
            }
        });
    };

    updateActiveNav();
    window.addEventListener('hashchange', updateActiveNav);

    // 3. SCROLL FADE-IN OBSERVER
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    document.querySelectorAll('.fade-in').forEach(element => {
        fadeObserver.observe(element);
    });

    // 4. PHONE INPUT FORMATTING
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let input = e.target.value.replace(/\D/g, '');
            if (input.length > 10) input = input.substring(0, 10);
            
            let formatted = input;
            if (input.length > 6) {
                formatted = `(${input.substring(0,3)}) ${input.substring(3,6)}-${input.substring(6)}`;
            } else if (input.length > 3) {
                formatted = `(${input.substring(0,3)}) ${input.substring(3)}`;
            } else if (input.length > 0) {
                formatted = `(${input}`;
            }
            e.target.value = formatted;
        });
    }

    // 5. SERVICE FORM INLINE VALIDATION
    const serviceForm = document.getElementById('serviceForm');
    const formStatus = document.getElementById('formStatus');

    if (serviceForm) {
        const requiredInputs = serviceForm.querySelectorAll('[required]');

        requiredInputs.forEach(input => {
            input.addEventListener('input', function() {
                const parentGroup = this.closest('.form-group');
                if (parentGroup && this.value.trim()) {
                    parentGroup.classList.remove('has-error');
                }
            });
        });

        serviceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;

            serviceForm.querySelectorAll('.form-group').forEach(group => {
                group.classList.remove('has-error');
            });

            requiredInputs.forEach(input => {
                if (!input.value.trim() || !input.checkValidity()) {
                    isValid = false;
                    const parentGroup = input.closest('.form-group');
                    if (parentGroup) {
                        parentGroup.classList.add('has-error');
                    }
                }
            });

            if (isValid) {
                const submitBtn = serviceForm.querySelector('.form-submit-btn');
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.disabled = false;
                    if (formStatus) {
                        formStatus.textContent = "Thank you! Your service request has been received. Our operations team will contact you within 24 business hours.";
                        formStatus.className = "form-status success";
                    }
                    serviceForm.reset();
                }, 1000);
            }
        });
    }

    // 6. SMOOTH SCROLLING
    document.querySelectorAll('a[href*="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.substring(href.indexOf('#'));
            
            if (targetId && targetId !== '#' && document.querySelector(targetId)) {
                const targetElement = document.querySelector(targetId);
                if (targetElement && (window.location.pathname.endsWith(link.pathname) || link.pathname === '')) {
                    e.preventDefault();
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    history.pushState(null, null, targetId);
                    updateActiveNav();
                }
            }
        });
    });

    // 7. AUTO-HIDE NAVBAR ON SCROLL DOWN / SHOW ON SCROLL UP
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.site-header');
    const scrollThreshold = 10; // Minimum scroll distance (px) before toggling state

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;

            // Ignore negative scroll values caused by touch/mobile rubber-banding
            if (currentScrollY < 0) return;

            // Always keep navbar visible near top of page
            if (currentScrollY <= 80) {
                header.classList.remove('nav-hidden');
                lastScrollY = currentScrollY;
                return;
            }

            // Only toggle state if scroll distance exceeds threshold
            if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
                if (currentScrollY > lastScrollY) {
                    // Scrolling Down -> Hide Header
                    header.classList.add('nav-hidden');
                } else {
                    // Scrolling Up -> Show Header
                    header.classList.remove('nav-hidden');
                }
                lastScrollY = currentScrollY;
            }
        }, { passive: true });
    }
});