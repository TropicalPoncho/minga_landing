document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Account for fixed header
                    behavior: 'smooth'
                });
            }
        });
    });

    // Sticky header shadow on scroll
    const header = document.querySelector('.header');
    const updateHeaderShadow = () => {
        if (!header) return;
        if (window.scrollY > 2) header.classList.add('scrolled');
        else header.classList.remove('scrolled');
    };
    updateHeaderShadow();
    window.addEventListener('scroll', updateHeaderShadow, { passive: true });

    // Theme toggle (Amber <-> Rose)
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const applyTheme = (theme) => {
        const isRose = theme === 'rose';
        root.classList.toggle('theme-rose', isRose);
        if (toggleBtn) {
            toggleBtn.textContent = isRose ? 'Amber' : 'Rose';
            toggleBtn.setAttribute('aria-pressed', String(isRose));
        }
    };
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'rose' ? 'rose' : 'amber');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const next = root.classList.contains('theme-rose') ? 'amber' : 'rose';
            applyTheme(next);
            localStorage.setItem('theme', next);
        });
    }

    // Dark mode toggle
    const modeBtn = document.getElementById('modeToggle');
    const applyMode = (mode) => {
        const isDark = mode === 'dark';
        root.classList.toggle('theme-dark', isDark);
        if (modeBtn) {
            modeBtn.textContent = isDark ? 'Light' : 'Dark';
            modeBtn.setAttribute('aria-pressed', String(isDark));
        }
    };
    const savedMode = localStorage.getItem('mode');
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    if (savedMode === 'dark' || savedMode === 'light') {
        // Use user's saved choice
        applyMode(savedMode);
    } else {
        // First visit: respect system preference and follow changes until user chooses
        applyMode(media.matches ? 'dark' : 'light');
        const systemChangeHandler = (e) => {
            // Only follow system until user explicitly chooses (i.e., until we have localStorage value)
            if (!localStorage.getItem('mode')) {
                applyMode(e.matches ? 'dark' : 'light');
            } else {
                media.removeEventListener('change', systemChangeHandler);
            }
        };
        media.addEventListener('change', systemChangeHandler);
    }
    if (modeBtn) {
        modeBtn.addEventListener('click', () => {
            const next = root.classList.contains('theme-dark') ? 'light' : 'dark';
            applyMode(next);
            localStorage.setItem('mode', next);
        });
    }

    // Form submission handling
    const forms = document.querySelectorAll('.cta-form');
    
    forms.forEach(form => {
        const emailInput = form.querySelector('.email-input');
        const submitButton = form.querySelector('.cta-button');
        
        if (emailInput && submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                const email = emailInput.value.trim();
                
                if (!email) {
                    showNotification('Please enter your email address', 'error');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showNotification('Please enter a valid email address', 'error');
                    return;
                }
                
                // Here you would typically send the email to your server
                // For now, we'll just show a success message
                showNotification('Thank you! We\'ll be in touch soon!', 'success');
                emailInput.value = '';
                
                // Log the email (in a real app, you would send this to your server)
                console.log('New signup:', email);
            });
        }
    });
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // Add to the page
        document.body.appendChild(notification);
        
        // Position and animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateY(-100%)';
            notification.style.opacity = '0';
            
            // Remove from DOM after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }
    
    // Add styles for the notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 1rem;
            right: 1rem;
            padding: 1rem 1.5rem;
            border-radius: 0.375rem;
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            z-index: 1000;
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease-in-out;
        }
        
        .notification.success {
            background-color: #10B981;
        }
        
        .notification.error {
            background-color: #EF4444;
        }
        
        .notification.info {
            background-color: #3B82F6;
        }
    `;
    document.head.appendChild(style);

    // Reveal-on-scroll using IntersectionObserver
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!prefersReduced && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const delay = parseInt(el.getAttribute('data-delay')) || 0;
                    setTimeout(() => {
                        el.classList.add('in-view');
                    }, delay);
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    } else {
        // Fallback: show reveals immediately
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    }

    // Button ripple effect
    document.querySelectorAll('.cta-button').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.width = ripple.style.height = size + 'px';
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});
