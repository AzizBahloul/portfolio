// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mobile navbar toggle functionality
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

// Enhanced scroll effects for navbar
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Parallax Scrolling Implementation
if (!prefersReducedMotion && window.innerWidth > 768) {
    // Background parallax layers
    gsap.utils.toArray('.parallax-layer').forEach((layer, i) => {
        const speed = layer.dataset.speed || (i + 1) * 0.2;
        gsap.to(layer, {
            yPercent: -50 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    // Section background parallax
    gsap.utils.toArray(['.parallax-bg-home', '.parallax-bg-about', '.parallax-bg-projects']).forEach(bg => {
        gsap.to(bg, {
            yPercent: -30,
            ease: "none",
            scrollTrigger: {
                trigger: bg.closest('section'),
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // Text parallax elements
    gsap.utils.toArray('.parallax-text').forEach(text => {
        const speed = text.dataset.speed || 0.5;
        gsap.to(text, {
            y: () => -100 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: text,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // Card parallax elements
    gsap.utils.toArray('.parallax-element').forEach(element => {
        const speed = element.dataset.speed || 0.3;
        gsap.to(element, {
            y: () => -50 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: element,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
    });

    // Parallax rotation effect for avatar container
    gsap.to('#avatar-container', {
        rotationY: 360,
        ease: "none",
        scrollTrigger: {
            trigger: '#avatar-container',
            start: "top center",
            end: "bottom center",
            scrub: 2
        }
    });

    // Depth-based parallax for cards with enhanced effects
    gsap.utils.toArray('.card').forEach((card, i) => {
        gsap.to(card, {
            y: () => -20 - (i * 8),
            rotationX: () => 1 + (i * 0.5),
            rotationY: () => 1 + (i * 0.3),
            ease: "none",
            scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1
            }
        });
        
        // Enhanced animation for lottie players
        const lottiePlayer = card.querySelector('dotlottie-player');
        if (lottiePlayer) {
            gsap.to(lottiePlayer, {
                rotationY: () => 5 + (i * 2),
                scale: () => 1.05 + (i * 0.02),
                ease: "none",
                scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2
                }
            });
        }
    });

    // Terminal loader parallax with typewriter reveal
    gsap.to('.terminal-loader', {
        y: -40,
        scale: 1.05,
        ease: "none",
        scrollTrigger: {
            trigger: '.terminal-loader',
            start: "top bottom",
            end: "bottom top",
            scrub: 1
        }
    });
}

// Enhanced reveal animations
gsap.utils.toArray('.parallax-section').forEach((section, i) => {
    const elements = section.querySelectorAll('.section-content > *');
    
    gsap.set(elements, { 
        y: 60, 
        opacity: 0,
        scale: 0.9
    });

    ScrollTrigger.create({
        trigger: section,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
            gsap.to(elements, {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out"
            });
        },
        onLeaveBack: () => {
            gsap.to(elements, {
                y: 60,
                opacity: 0,
                scale: 0.9,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.in"
            });
        }
    });
});

// Smooth morphing background
gsap.to('body', {
    background: "linear-gradient(180deg, #1a0b2e 0%, #16213e 50%, #0f3460 100%)",
    ease: "none",
    scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 3
    }
});

// Active link detection and highlighting
function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Update active link on scroll
window.addEventListener('scroll', updateActiveLink);

// Enhanced smooth scroll to sections
document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
            // Add click animation
            gsap.to(this, { 
                duration: 0.1, 
                scale: 0.95,
                yoyo: true,
                repeat: 1
            });

            // Calculate offset for parallax sections
            const offset = targetSection.classList.contains('parallax-section') ? 100 : 80;
            const targetTop = targetSection.offsetTop - offset;
            
            // Smooth scroll with easing
            gsap.to(window, {
                scrollTo: { y: targetTop, autoKill: false },
                duration: 1.5,
                ease: "power2.inOut"
            });

            // Animate target section with parallax-aware scaling
            gsap.fromTo(targetSection, 
                { opacity: 0.8, scale: 0.98, rotationX: 2 },
                { 
                    opacity: 1, 
                    scale: 1,
                    rotationX: 0,
                    duration: 1.2, 
                    ease: "power3.out",
                    delay: 0.3
                }
            );
        }
    });
});

// Navbar entrance animation with parallax effect
gsap.fromTo('header', 
    { y: -100, opacity: 0, rotationX: -90 },
    { 
        y: 0, 
        opacity: 1, 
        rotationX: 0,
        duration: 1.2,
        ease: "back.out(1.7)",
        delay: 0.2
    }
);

// Animate nav items with staggered parallax
gsap.fromTo('.nav-item', 
    { y: -30, opacity: 0, rotationY: -45 },
    { 
        y: 0, 
        opacity: 1, 
        rotationY: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        delay: 0.6
    }
);

// Enhanced project cards animation with 3D parallax
window.addEventListener('load', () => {
    gsap.from('.card', { 
        opacity: 0, 
        duration: 1.2, 
        y: 80, 
        rotationX: 45,
        scale: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
            trigger: "#projects",
            start: "top 80%"
        }
    });
    
    gsap.from('.card2', { 
        opacity: 0, 
        duration: 1.2, 
        y: 80,
        rotationX: -45, 
        scale: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        delay: 0.3,
        scrollTrigger: {
            trigger: "#projects",
            start: "top 80%"
        }
    });
});

// Interactive parallax cursor effect
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    const dx = mouseX - cursorX;
    const dy = mouseY - cursorY;
    
    cursorX += dx * 0.1;
    cursorY += dy * 0.1;
    
    // Apply subtle parallax to background elements based on cursor
    gsap.set('.parallax-layer', {
        x: cursorX * -0.01,
        y: cursorY * -0.01
    });
    
    requestAnimationFrame(animateCursor);
}

if (!prefersReducedMotion) {
    animateCursor();
}

// Magnetic effect for interactive elements
document.querySelectorAll('.card, .card2, .resume-btn').forEach(element => {
    element.addEventListener('mouseenter', (e) => {
        if (!prefersReducedMotion) {
            gsap.to(element, {
                scale: 1.05,
                rotationY: 5,
                rotationX: 5,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    element.addEventListener('mouseleave', (e) => {
        if (!prefersReducedMotion) {
            gsap.to(element, {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
});

// Performance monitoring and optimization
let ticking = false;

function updateParallax() {
    if (!ticking && !prefersReducedMotion) {
        requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            ticking = false;
        });
        ticking = true;
    }
}

// Debounced resize handler
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
    }, 250);
});

// Initialize ScrollTrigger
ScrollTrigger.refresh();
