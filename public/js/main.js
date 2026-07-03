/* =============================================
   PRODUCTION-READY JAVASCRIPT
   Robust error handling and best practices
   ============================================= */

// 1. GLOBAL ERROR HANDLER
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // Log to analytics or error tracking service
    // Don't show technical errors to users
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    event.preventDefault(); // Prevent browser default error display
});

// 2. UTILITY FUNCTIONS

/**
 * Debounce function - prevents function from running too frequently
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Sanitize HTML to prevent XSS attacks
 * @param {string} str - String to sanitize
 */
const sanitizeHTML = (str) => {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

/**
 * Safe DOM query selector with error handling
 * @param {string} selector - CSS selector
 */
const safeQuerySelector = (selector) => {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.error(`Invalid selector: ${selector}`, error);
        return null;
    }
};

/**
 * Safe DOM query selector all with error handling
 * @param {string} selector - CSS selector
 */
const safeQuerySelectorAll = (selector) => {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.error(`Invalid selector: ${selector}`, error);
        return [];
    }
};

// 3. FORM HANDLING WITH VALIDATION

class FormHandler {
    constructor(formSelector) {
        this.form = safeQuerySelector(formSelector);
        if (!this.form) {
            console.warn(`Form not found: ${formSelector}`);
            return;
        }
        this.init();
    }

    init() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Add input validation
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }

        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number';
            }
        }

        this.showFieldError(field, isValid, errorMessage);
        return isValid;
    }

    showFieldError(field, isValid, message) {
        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        field.classList.remove('error');

        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentElement.appendChild(errorDiv);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Validate all fields
        const inputs = this.form.querySelectorAll('input[required], textarea[required], select[required]');
        let allValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                allValid = false;
            }
        });

        if (!allValid) {
            this.showMessage('Please fix the errors above', 'error');
            return;
        }

        // Get form data
        const formData = new FormData(this.form);
        
        // Sanitize all inputs
        const sanitizedData = {};
        for (let [key, value] of formData.entries()) {
            sanitizedData[key] = sanitizeHTML(value);
        }

        // Show loading state
        this.setLoading(true);

        try {
            // Submit to Netlify Forms
            const response = await fetch(this.form.action || '/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            this.showMessage('Thank you! We\'ll be in touch soon.', 'success');
            this.form.reset();

        } catch (error) {
            console.error('Form submission error:', error);
            this.showMessage('Sorry, something went wrong. Please try again or contact us directly.', 'error');
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        if (!submitButton) return;

        if (isLoading) {
            submitButton.disabled = true;
            submitButton.classList.add('loading');
            submitButton.setAttribute('data-original-text', submitButton.textContent);
            submitButton.textContent = 'Sending...';
        } else {
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            const originalText = submitButton.getAttribute('data-original-text');
            if (originalText) {
                submitButton.textContent = originalText;
            }
        }
    }

    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMsg = this.form.querySelector('.form-message');
        if (existingMsg) {
            existingMsg.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        this.form.insertBefore(messageDiv, this.form.firstChild);

        // Auto-remove after 5 seconds
        setTimeout(() => messageDiv.remove(), 5000);
    }
}

// 4. LAZY LOADING IMAGES

const lazyLoadImages = () => {
    const images = safeQuerySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => img.classList.add('loaded'));
    }
};

// 5. SMOOTH SCROLL WITH FALLBACK

const initSmoothScroll = () => {
    const links = safeQuerySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = safeQuerySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();

            // Smooth scroll with fallback
            try {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } catch (error) {
                // Fallback for browsers that don't support smooth scroll
                targetElement.scrollIntoView();
            }

            // Update URL without triggering navigation
            if (history.pushState) {
                history.pushState(null, null, targetId);
            }
        });
    });
};

// 6. MODAL HANDLER WITH ACCESSIBILITY

class Modal {
    constructor(modalId) {
        this.modal = safeQuerySelector(`#${modalId}`);
        if (!this.modal) {
            console.warn(`Modal not found: ${modalId}`);
            return;
        }
        this.init();
    }

    init() {
        // Close button
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });
    }

    open() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Set focus to first focusable element
        const focusable = this.modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) {
            focusable.focus();
        }

        // Trap focus within modal
        this.trapFocus();
    }

    close() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    trapFocus() {
        const focusableElements = this.modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        this.modal.addEventListener('keydown', (e) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        });
    }
}

// 7. API FETCH WITH ERROR HANDLING

class APIClient {
    constructor(baseURL = '') {
        this.baseURL = baseURL;
    }

    async fetch(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return { success: true, data };

        } catch (error) {
            console.error('API fetch error:', error);
            return { 
                success: false, 
                error: error.message || 'Something went wrong' 
            };
        }
    }

    async get(endpoint) {
        return this.fetch(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.fetch(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}

// 8. INITIALIZE EVERYTHING

const initApp = () => {
    try {
        // Initialize forms
        const contactForm = new FormHandler('#contactForm');
        const checklistForm = new FormHandler('#checklistForm');

        // Initialize lazy loading
        lazyLoadImages();

        // Initialize smooth scroll
        initSmoothScroll();

        // Initialize modals
        const checklistModal = new Modal('checklistModal');

        // Make modal accessible globally for buttons
        window.openChecklistModal = (source) => {
            const sourceInput = safeQuerySelector('#formSource');
            if (sourceInput) {
                sourceInput.value = source;
            }
            if (checklistModal) {
                checklistModal.open();
            }
        };

        window.closeChecklistModal = () => {
            if (checklistModal) {
                checklistModal.close();
            }
        };

        console.log('App initialized successfully');

    } catch (error) {
        console.error('Initialization error:', error);
        // Don't break the page if initialization fails
    }
};

// 9. START APP WHEN DOM IS READY

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already loaded
    initApp();
}