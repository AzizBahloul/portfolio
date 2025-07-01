// Working Locomotive Scroll Implementation
console.log('Initializing Locomotive Scroll...');

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Initialize Locomotive Scroll
let locoScroll;

document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all resources to load
    setTimeout(() => {
        initializeScroll();
    }, 100);
});

function initializeScroll() {
    console.log('Setting up Locomotive Scroll...');
    
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (!scrollContainer) {
        console.error('No scroll container found!');
        return;
    }
    
    // Initialize Locomotive Scroll
    locoScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        multiplier: 1,
        class: 'is-inview',
        getSpeed: true,
        getDirection: true,
        touchMultiplier: 2,
        firefoxMultiplier: 50
    });
    
    // Setup ScrollTrigger integration
    locoScroll.on("scroll", ScrollTrigger.update);
    
    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
            return arguments.length ? 
                locoScroll.scrollTo(value, 0, 0) : 
                locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        pinType: scrollContainer.style.transform ? "transform" : "fixed"
    });
    
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
    
    console.log('Locomotive Scroll initialized successfully!');
    
    // Setup navigation
    setupNavigation();
    
    // Force an update after everything is ready
    setTimeout(() => {
        if (locoScroll) {
            locoScroll.update();
            ScrollTrigger.refresh();
        }
    }, 200);
}

function setupNavigation() {
    // Mobile navigation
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
}
        document.body.style.overflow = 'auto';
        container.style.height = 'auto';
        container.style.overflow = 'visible';
        return;
    }
    
    try {
        console.log('Initializing Locomotive Scroll...');
        
        const scroll = new LocomotiveScroll({
            el: container,
            smooth: true,
            multiplier: 0.8,
            smartphone: {
                smooth: true
            },
            tablet: {
                smooth: true
            }
        });
        
        console.log('Locomotive Scroll initialized successfully:', scroll);
        
        // Listen for scroll events
        scroll.on('scroll', (instance) => {
            console.log('Scrolling:', instance.scroll.y);
        });
        
        // Update on resize
        window.addEventListener('resize', () => {
            console.log('Resizing, updating scroll...');
            scroll.update();
        });
        
        // Make globally available
        window.locomotiveScroll = scroll;
        
        console.log('Setup complete!');
        
    } catch (error) {
        console.error('Failed to initialize Locomotive Scroll:', error);
        // Fallback to native scrolling
        document.documentElement.style.overflow = 'auto';
        document.body.style.overflow = 'auto';
        container.style.height = 'auto';
        container.style.overflow = 'visible';
    }
});

// Test native scrolling
console.log('Testing native scroll capabilities...');
console.log('HTML overflow:', getComputedStyle(document.documentElement).overflow);
console.log('Body overflow:', getComputedStyle(document.body).overflow);
