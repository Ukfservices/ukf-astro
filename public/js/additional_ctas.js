/* ========================================
   UKF SERVICES - ADDITIONAL CTA FUNCTIONS
   Lead capture for DDP, rates, specialist
   ======================================== */

// DDP/DDU Pricing Form
function openDDPForm() {
    document.getElementById('checklistModal').style.display = 'flex';
    
    // Track in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'Lead Generation',
            'event_label': 'ddp_pricing',
            'value': 1
        });
    }
    
    // Track in Clarity
    if (typeof clarity !== 'undefined') {
        clarity('set', 'cta_clicked', 'ddp_pricing');
    }
}

// Get Shipping Rates Form
function openRatesForm(serviceType) {
    document.getElementById('checklistModal').style.display = 'flex';
    
    // Pre-fill service type if field exists
    if (document.getElementById('serviceType')) {
        document.getElementById('serviceType').value = serviceType;
    }
    
    // Track in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'Lead Generation',
            'event_label': 'get_rates_' + serviceType,
            'value': 1
        });
    }
    
    // Track in Clarity
    if (typeof clarity !== 'undefined') {
        clarity('set', 'cta_clicked', 'get_rates_' + serviceType);
    }
}

// Speak to Specialist Form
function openSpecialistForm() {
    document.getElementById('checklistModal').style.display = 'flex';
    
    // Track in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'Lead Generation',
            'event_label': 'speak_to_specialist',
            'value': 1
        });
    }
    
    // Track in Clarity
    if (typeof clarity !== 'undefined') {
        clarity('set', 'cta_clicked', 'speak_to_specialist');
    }
}

// Customs Support Form
function openCustomsForm() {
    document.getElementById('checklistModal').style.display = 'flex';
    
    // Pre-fill service type if field exists
    if (document.getElementById('serviceType')) {
        document.getElementById('serviceType').value = 'customs';
    }
    
    // Track in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'Lead Generation',
            'event_label': 'customs_support',
            'value': 1
        });
    }
    
    // Track in Clarity
    if (typeof clarity !== 'undefined') {
        clarity('set', 'cta_clicked', 'customs_support');
    }
}

// Start Shipment Form
function openShipmentForm() {
    document.getElementById('checklistModal').style.display = 'flex';
    
    // Track in GA4
    if (typeof gtag !== 'undefined') {
        gtag('event', 'cta_click', {
            'event_category': 'Lead Generation',
            'event_label': 'start_shipment',
            'value': 1
        });
    }
    
    // Track in Clarity
    if (typeof clarity !== 'undefined') {
        clarity('set', 'cta_clicked', 'start_shipment');
    }
}
