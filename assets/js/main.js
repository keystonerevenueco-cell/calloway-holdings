/* ==========================================================================
   CALLOWAY HOLDINGS - UNIFIED MAIN JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // --- 1. HERO SLIDESHOW / CAROUSEL FUNCTIONALITY ---
    const carouselTrack = document.querySelector('.carousel-track');
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dots .dot');
    
    if (carouselTrack && slides.length > 0) {
        let currentIndex = 2; // Default to Slide 3 (Active Division)
        let slideInterval;

        function updateSlide(index) {
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;
            
            currentIndex = index;
            carouselTrack.style.transform = `translateX(-${currentIndex * 100}%)`;

            // Update dot visual state
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });

            // Update slide active class
            slides.forEach((slide, idx) => {
                if (idx === currentIndex) {
                    slide.classList.add('active-slide');
                } else {
                    slide.classList.remove('active-slide');
                }
            });
        }

        // Initialize default slide positioning
        updateSlide(currentIndex);

        // Click listeners on dots
        dots.forEach((dot) => {
            dot.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-slide'), 10);
                if (!isNaN(targetIndex)) {
                    updateSlide(targetIndex);
                    resetAutoplay();
                }
            });
        });

        // Autoplay functionality (5 second interval)
        function startAutoplay() {
            slideInterval = setInterval(() => {
                updateSlide(currentIndex + 1);
            }, 5000);
        }

        function resetAutoplay() {
            clearInterval(slideInterval);
            startAutoplay();
        }

        // Start slide rotation
        startAutoplay();

        // Pause slideshow when hovering over hero card
        const heroCards = document.querySelectorAll('.floating-hero-card');
        heroCards.forEach(card => {
            card.addEventListener('mouseenter', () => clearInterval(slideInterval));
            card.addEventListener('mouseleave', () => startAutoplay());
        });
    }

    // --- 2. MOBILE MENU TOGGLE DRAWER ---
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

    // --- 3. ACTIVE NAVIGATION HIGHLIGHTING ACROSS PAGES ---
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

    // --- 4. SCROLL FADE-IN OBSERVER ---
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

    // --- 5. PHONE INPUT FORMATTING ---
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(phoneInput => {
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
    });

    // --- 6. FORM VALIDATION & AJAX SUBMISSION ---
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const requiredInputs = form.querySelectorAll('[required]');

        // Clear error highlights as user types
        requiredInputs.forEach(input => {
            input.addEventListener('input', function() {
                const parentGroup = this.closest('.form-group');
                if (parentGroup && this.value.trim()) {
                    parentGroup.classList.remove('has-error');
                }
            });
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault(); // Stop native navigation / formsubmit redirect

            let isValid = true;

            form.querySelectorAll('.form-group').forEach(group => {
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

            if (!isValid) return;

            // Submit button UI state update
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerText : 'Submit';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = 'Sending...';
            }

            // AJAX submission directly to FormSubmit
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to site's custom thank-you page
                    window.location.href = 'thank-you.html';
                } else {
                    alert('There was an issue submitting your form. Please check your fields and try again.');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.innerText = originalBtnText;
                    }
                }
            })
            .catch(() => {
                alert('Connection error. Please check your network and try again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
        });
    });

    // --- 7. SMOOTH SCROLLING ---
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

    // --- 8. AUTO-HIDE NAVBAR ON SCROLL DOWN / SHOW ON SCROLL UP ---
    let lastScrollY = window.scrollY;
    const header = document.querySelector('.site-header');
    const scrollThreshold = 10;

    if (header) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY || document.documentElement.scrollTop;

            if (currentScrollY < 0) return;

            // Keep visible at very top
            if (currentScrollY <= 80) {
                header.classList.remove('nav-hidden');
                lastScrollY = currentScrollY;
                return;
            }

            // Scroll direction check
            if (Math.abs(currentScrollY - lastScrollY) > scrollThreshold) {
                if (currentScrollY > lastScrollY) {
                    header.classList.add('nav-hidden'); // Hide on scroll down
                } else {
                    header.classList.remove('nav-hidden'); // Show on scroll up
                }
                lastScrollY = currentScrollY;
            }
        }, { passive: true });
    }
});