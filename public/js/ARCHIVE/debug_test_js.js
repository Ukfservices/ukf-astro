/**
 * ULTRA SIMPLE DEBUG VERSION
 * Put this FIRST in your HTML before any other scripts
 */

console.log('=== DEBUG TEST STARTED ===');

// Test 1: Check if script is loading
alert('Script is loading!');

// Test 2: Create the function IMMEDIATELY
window.openChecklistModal = function(source) {
    alert('Modal function called from: ' + source);
    const modal = document.getElementById('checklistModal');
    if (modal) {
        modal.style.display = 'flex';
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal opened');
    } else {
        alert('ERROR: Modal element not found!');
    }
};

window.closeChecklistModal = function() {
    const modal = document.getElementById('checklistModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
        document.body.style.overflow = '';
        console.log('✅ Modal closed');
    }
};

// Test 3: Wait for page to load, then attach handlers
window.addEventListener('load', function() {
    console.log('=== PAGE LOADED ===');
    
    // Find all buttons
    const heroBtn = document.querySelector('.btn-primary');
    const footerBtn = document.querySelector('.btn-footer-cta');
    const stickyBtn = document.querySelector('.sticky-cta-btn');
    
    console.log('Hero button:', heroBtn);
    console.log('Footer button:', footerBtn);
    console.log('Sticky button:', stickyBtn);
    
    // Attach click handlers
    if (heroBtn) {
        heroBtn.onclick = function(e) {
            e.preventDefault();
            alert('Hero button clicked!');
            openChecklistModal('Hero CTA');
        };
        console.log('✅ Hero button handler attached');
    } else {
        console.error('❌ Hero button NOT FOUND');
    }
    
    if (footerBtn) {
        footerBtn.onclick = function(e) {
            e.preventDefault();
            alert('Footer button clicked!');
            openChecklistModal('Footer CTA');
        };
        console.log('✅ Footer button handler attached');
    }
    
    if (stickyBtn) {
        stickyBtn.onclick = function(e) {
            e.preventDefault();
            alert('Sticky button clicked!');
            openChecklistModal('Sticky CTA');
        };
        console.log('✅ Sticky button handler attached');
    }
    
    // Test modal close button
    const closeBtn = document.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            closeChecklistModal();
        };
        console.log('✅ Close button handler attached');
    }
    
    // Test form submission
    const form = document.getElementById('checklistForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();
            alert('Form submitted!');
            const success = document.getElementById('checklistSuccess');
            if (success) {
                form.style.display = 'none';
                success.style.display = 'block';
                setTimeout(function() {
                    closeChecklistModal();
                    form.style.display = 'block';
                    success.style.display = 'none';
                    form.reset();
                }, 3000);
            }
        };
        console.log('✅ Form handler attached');
    }
    
    console.log('=== ALL HANDLERS ATTACHED ===');
});

console.log('=== DEBUG TEST COMPLETE ===');
