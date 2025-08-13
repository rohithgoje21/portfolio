// Portfolio website functionality
document.addEventListener('DOMContentLoaded', () => {
    if (location.hash !== "#home") {
        location.hash = "#home";
    }
    
    // Define a function that will be called after all components are loaded
    window.initSite = function() {
        
        // DOM Elements - access these after components are loaded
        const body = document.querySelector('body');
        const themeToggle = document.getElementById('themeToggle');
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        const dropdowns = document.querySelectorAll('.dropdown');
        const scrollToTopBtn = document.getElementById('scrollToTop');
        const currentYearSpan = document.getElementById('current-year');
        const contactForm = document.getElementById('contactForm');

    // Set current year in footer
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Theme Switcher
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Remove existing theme classes to start clean
        body.classList.remove('dark-theme', 'light-theme');

        if (savedTheme === 'dark') {
            body.classList.add('dark-theme');
        } else if (savedTheme === 'light') {
            body.classList.add('light-theme');
        } else if (prefersDarkScheme) {
            body.classList.add('dark-theme');
        } else {
            body.classList.add('light-theme'); // Default to light theme
        }
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            // Determine the new theme by checking if dark-theme is currently active *before* toggling
            const isCurrentlyDark = body.classList.contains('dark-theme');
            if (isCurrentlyDark) {
                body.classList.remove('dark-theme');
                body.classList.add('light-theme');
                localStorage.setItem('theme', 'light');
            } else {
                body.classList.remove('light-theme');
                body.classList.add('dark-theme');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Mobile Navigation
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile nav when clicking a link
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            if (!link.classList.contains('dropdown-toggle')) {
                link.addEventListener('click', () => {
                    if (navToggle && navMenu && navMenu.classList.contains('active')) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            }
        });
    }
    
    // Handle dropdown toggles
    if (dropdownToggles.length > 0) {
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const dropdown = toggle.closest('.dropdown');
                const isActive = dropdown.classList.contains('active');
                
                dropdowns.forEach(d => d.classList.remove('active'));
                
                if (!isActive || window.innerWidth > 768) {
                    dropdown.classList.toggle('active', !isActive);
                }
            });
        });
    }
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        }
    });

    // Active Navigation Link on Scroll
    function setActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100; 

        sections.forEach(section => {
            if (section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (section.id && link.getAttribute('href') === `#${section.id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Scroll to Top Button
    function toggleScrollToTopBtn() {
        if (scrollToTopBtn) {
            scrollToTopBtn.classList.toggle('visible', window.scrollY > 500);
        }
    }

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const oldMsg = contactForm.parentNode.querySelector('.form-success');
            if (oldMsg) oldMsg.remove();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;
            const formData = new FormData(contactForm);

            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(response => {
                if (response.ok) {
                    contactForm.reset();
                    const successMsg = document.createElement('div');
                    successMsg.classList.add('form-success');
                    successMsg.textContent = 'Thank you for your message! I will get back to you soon.';
                    contactForm.parentNode.insertBefore(successMsg, contactForm.nextSibling);
                    setTimeout(() => successMsg.remove(), 5000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Oops! There was a problem submitting your form. Please try again later.');
            })
            .finally(() => {
                if (submitBtn) submitBtn.disabled = false;
            });
        });
    }

    // Horizontal Scroll with Arrows Functionality
    function setupHorizontalScroll(sectionId) {
        const sectionElement = document.getElementById(sectionId);
        if (!sectionElement) return;

        const wrapper = sectionElement.querySelector('.horizontal-scroll-wrapper');
        const prevArrow = sectionElement.querySelector('.prev-arrow');
        const nextArrow = sectionElement.querySelector('.next-arrow');
        
        if (!wrapper || !prevArrow || !nextArrow) {
            return;
        }

        let scrollTimeout; 

        function updateArrowStates() {
            if (!wrapper) return; 
            const scrollLeft = wrapper.scrollLeft;
            const scrollWidth = wrapper.scrollWidth;
            const clientWidth = wrapper.clientWidth;

            prevArrow.classList.toggle('disabled', scrollLeft <= 0);
            nextArrow.classList.toggle('disabled', scrollLeft + clientWidth >= scrollWidth - 5);
        }

        prevArrow.addEventListener('click', () => {
            if (wrapper.scrollLeft > 0) {
                 wrapper.scrollBy({ left: -300, behavior: 'smooth' });
            }
        });

        nextArrow.addEventListener('click', () => {
            if (wrapper.scrollLeft + wrapper.clientWidth < wrapper.scrollWidth - 5) {
                wrapper.scrollBy({ left: 300, behavior: 'smooth' });
            }
        });

        wrapper.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(updateArrowStates, 50); 
        });
        
        setTimeout(updateArrowStates, 100); 
        window.addEventListener('resize', () => {
             clearTimeout(scrollTimeout); 
             scrollTimeout = setTimeout(updateArrowStates, 100);
        });
    }

    setupHorizontalScroll('projects');
    setupHorizontalScroll('certifications');

    // Intersection Observer for animations
    function setupIntersectionObserver() {
        const options = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, options);
        document.querySelectorAll('section, .timeline-item').forEach(el => observer.observe(el));
    }

    // Initialize Functions
    initTheme(); 
    setupIntersectionObserver();

    // Event Listeners
    window.addEventListener('scroll', () => {
        setActiveLink();
        toggleScrollToTopBtn();
    });
    
    setActiveLink();
    toggleScrollToTopBtn();
    };
});
