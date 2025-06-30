// Enhanced Locomotive Scroll Implementation with Debugging
console.log('🚀 Starting Locomotive Scroll initialization...');

// Check for dependencies
console.log('📦 GSAP available:', typeof gsap !== 'undefined');
console.log('📦 LocomotiveScroll available:', typeof LocomotiveScroll !== 'undefined');
console.log('📦 ScrollTrigger available:', typeof ScrollTrigger !== 'undefined');

// Register GSAP plugins if available
if (typeof gsap !== 'undefined') {
    if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
    if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);
}

let locoScroll;

// Initialize when everything is ready
function initializeLocomotiveScroll() {
    console.log('🔧 Initializing Locomotive Scroll...');
    
    const container = document.querySelector('[data-scroll-container]');
    if (!container) {
        console.error('❌ No data-scroll-container found!');
        enableNativeScrolling();
        return;
    }
    
    console.log('✅ Container found:', container);
    
    // Check if LocomotiveScroll is available
    if (typeof LocomotiveScroll === 'undefined') {
        console.error('❌ LocomotiveScroll not loaded!');
        enableNativeScrolling();
        return;
    }
    
    try {
        // Initialize Locomotive Scroll
        locoScroll = new LocomotiveScroll({
            el: container,
            smooth: true,
            multiplier: 1,
            class: 'is-inview',
            getSpeed: true,
            getDirection: true,
            touchMultiplier: 2,
            firefoxMultiplier: 50,
            smartphone: {
                smooth: true
            },
            tablet: {
                smooth: true
            }
        });
        
        console.log('✅ Locomotive Scroll initialized:', locoScroll);
        
        // Setup GSAP integration if available
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            setupGSAPIntegration();
        }
        
        // Setup navigation
        setupNavigation();
        
        // Log parallax elements
        logParallaxElements();
        
        // Force update after initialization
        setTimeout(() => {
            if (locoScroll) {
                locoScroll.update();
                console.log('🔄 Locomotive Scroll updated');
            }
        }, 100);
        
    } catch (error) {
        console.error('❌ Error initializing Locomotive Scroll:', error);
        enableNativeScrolling();
    }
}

function setupGSAPIntegration() {
    console.log('🎨 Setting up GSAP integration...');
    
    // Listen to scroll events
    locoScroll.on("scroll", ScrollTrigger.update);
    
    // Setup scroller proxy
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
        pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
    });
    
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
    
    console.log('✅ GSAP integration complete');
}

function setupNavigation() {
    console.log('🧭 Setting up navigation...');
    
    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            console.log('📱 Mobile menu toggled');
        });
    }
    
    // Navigation link smooth scrolling
    document.querySelectorAll('.nav-link[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            const targetElement = document.querySelector(target);
            
            if (targetElement && locoScroll) {
                console.log('🎯 Scrolling to:', target);
                locoScroll.scrollTo(targetElement);
            }
            
            // Close mobile menu
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    console.log('✅ Navigation setup complete');
}

function logParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-scroll-speed]');
    console.log(`🌊 Found ${parallaxElements.length} parallax elements:`);
    
    parallaxElements.forEach((el, index) => {
        const speed = el.dataset.scrollSpeed;
        const delay = el.dataset.scrollDelay || 'none';
        console.log(`  ${index + 1}. Speed: ${speed}, Delay: ${delay}`, el);
    });
}

function enableNativeScrolling() {
    console.log('⚠️  Falling back to native scrolling...');
    
    // Remove Locomotive Scroll restrictions
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';
    
    const container = document.querySelector('[data-scroll-container]');
    if (container) {
        container.style.height = 'auto';
        container.style.overflow = 'visible';
    }
    
    // Setup basic navigation
    setupNavigation();
    
    console.log('✅ Native scrolling enabled');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeLocomotiveScroll, 100);
    });
} else {
    setTimeout(initializeLocomotiveScroll, 100);
}

// Handle resize
window.addEventListener('resize', () => {
    if (locoScroll) {
        setTimeout(() => {
            locoScroll.update();
            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.refresh();
            }
            console.log('🔄 Updated on resize');
        }, 250);
    }
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    if (locoScroll) {
        locoScroll.destroy();
        console.log('🧹 Locomotive Scroll cleaned up');
    }
});
