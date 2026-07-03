/* ============================================
   UKF SERVICES - ABOUT SECTION CAROUSEL
   Logic for smooth image transitions
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.querySelector('.about-image-carousel');
    
    // Only run if the carousel exists on the current page
    if (!carousel) return;
    
    const images = carousel.querySelectorAll('.carousel-image');
    const indicators = carousel.querySelectorAll('.indicator');
    let currentIndex = 0;
    let autoRotateInterval;

    function showSlide(index) {
        // 1. Reset all elements
        images.forEach(img => {
            img.classList.remove('active');
            img.style.opacity = "0"; // Backup for CSS
        });
        indicators.forEach(ind => ind.classList.remove('active'));
        
        // 2. Activate target elements
        images[index].classList.add('active');
        images[index].style.opacity = "1"; 
        indicators[index].classList.add('active');
        
        currentIndex = index;
    }

    function nextSlide() {
        let next = (currentIndex + 1) % images.length;
        showSlide(next);
    }

    function startAutoRotate() {
        // Change image every 5 seconds
        autoRotateInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoRotate() {
        clearInterval(autoRotateInterval);
    }

    // Allow manual clicking on dots
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            stopAutoRotate();
            showSlide(index);
            startAutoRotate(); // Restart timer after manual click
        });
    });

    // Pause rotation if user isn't looking at the tab (Performance)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stopAutoRotate();
        else startAutoRotate();
    });

    // Initialize
    startAutoRotate();
});