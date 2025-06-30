// Force Native Scrolling Test
console.log('Forcing native scrolling for testing...');

document.addEventListener('DOMContentLoaded', function() {
    // Force native scrolling
    const html = document.documentElement;
    const body = document.body;
    const container = document.querySelector('[data-scroll-container]');
    
    // Remove all scroll restrictions
    html.style.overflow = 'auto';
    body.style.overflow = 'auto';
    
    if (container) {
        container.style.height = 'auto';
        container.style.overflow = 'visible';
    }
    
    console.log('Native scrolling enabled');
    console.log('Page height:', document.body.scrollHeight);
    console.log('Viewport height:', window.innerHeight);
    console.log('Should scroll:', document.body.scrollHeight > window.innerHeight);
    
    // Test scroll
    window.scrollTo(0, 100);
    setTimeout(() => {
        console.log('Current scroll position:', window.scrollY);
    }, 100);
});
