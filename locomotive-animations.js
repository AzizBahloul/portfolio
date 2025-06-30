// Advanced Parallax Scrolling with Locomotive Scroll + GSAP Integration
// This combines the smoothest scrolling library (Locomotive) with powerful animations (GSAP)

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Initialize Locomotive Scroll
let locoScroll;

function initLocomotiveScroll() {
    locoScroll = new LocomotiveScroll({
        el: document.querySelector('[data-scroll-container]'),
        smooth: true,
        multiplier: 1.2,
        class: 'is-inview',
        scrollFromAnywhere: false,
        inertia: 0.8,
        getSpeed: true,
        getDirection: true,
        touchMultiplier: 2.5,
        firefoxMultiplier: 55,
        smartphone: {
            smooth: true,
            breakpoint: 767,
            multiplier: 1
        },
        tablet: {
            smooth: true,
            breakpoint: 1024,
            multiplier: 1.1
        },
        reloadOnContextChange: true,
        resetNativeScroll: true
    });

    // Each time Locomotive Scroll updates, tell ScrollTrigger to update too
    locoScroll.on("scroll", ScrollTrigger.update);

    // Tell ScrollTrigger to use these proxy methods for the "[data-scroll-container]" element
    ScrollTrigger.scrollerProxy("[data-scroll-container]", {
        scrollTop(value) {
            return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
            return {
                top: 0,
                left: 0,
                width: window.innerWidth,
                height: window.innerHeight
            };
        },
        // LocomotiveScroll handles things completely differently on mobile devices
        pinType: document.querySelector("[data-scroll-container]").style.transform ? "transform" : "fixed"
    });

    // Update ScrollTrigger when the page is first loaded
    ScrollTrigger.addEventListener("refresh", () => locoScroll.update());
    ScrollTrigger.refresh();
}

// Enhanced GSAP Animations with Locomotive Scroll Integration
function initAdvancedParallaxAnimations() {
    if (prefersReducedMotion) return;

    // Advanced text reveal animations with stagger
    gsap.utils.toArray('[data-scroll]').forEach((element, i) => {
        if (element.tagName === 'H1' || element.classList.contains('parallax-text')) {
            gsap.fromTo(element, 
                { 
                    y: 100,
                    opacity: 0,
                    rotationX: 90,
                    transformOrigin: "bottom center"
                },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: element,
                        scroller: "[data-scroll-container]",
                        start: "top 85%",
                        end: "top 15%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    });

    // Advanced card animations with 3D transforms
    gsap.utils.toArray('.card, .card2').forEach((card, i) => {
        // Floating animation
        gsap.to(card, {
            y: "random(-20, 20)",
            rotation: "random(-2, 2)",
            duration: "random(3, 5)",
            ease: "power1.inOut",
            yoyo: true,
            repeat: -1,
            delay: i * 0.2
        });

        // Scroll-triggered entrance
        gsap.fromTo(card, 
            {
                y: 150,
                opacity: 0,
                rotationY: 45,
                scale: 0.8
            },
            {
                y: 0,
                opacity: 1,
                rotationY: 0,
                scale: 1,
                duration: 1.5,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    scroller: "[data-scroll-container]",
                    start: "top 80%",
                    end: "top 20%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Magnetic hover effect
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.05,
                rotationY: 5,
                rotationX: 5,
                z: 50,
                duration: 0.3,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                rotationY: 0,
                rotationX: 0,
                z: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Advanced background parallax with morphing gradients
    gsap.to('body', {
        background: "linear-gradient(180deg, #0a0a23 0%, #1a0b2e 25%, #16213e 50%, #0f3460 75%, #0a0a23 100%)",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            scroller: "[data-scroll-container]",
            start: "top top",
            end: "bottom bottom",
            scrub: 2
        }
    });

    // Social links advanced animations
    gsap.utils.toArray('.github-link-1, .linkedin-link-1, .facebook-link-1').forEach((link, i) => {
        gsap.fromTo(link,
            {
                y: 50,
                opacity: 0,
                scale: 0.5,
                rotation: -180
            },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                rotation: 0,
                duration: 1,
                ease: "back.out(2)",
                delay: i * 0.1,
                scrollTrigger: {
                    trigger: link.closest('.card-container-1'),
                    scroller: "[data-scroll-container]",
                    start: "top 70%",
                    toggleActions: "play none none reverse"
                }
            }
        );

        // Advanced hover animations
        link.addEventListener('mouseenter', () => {
            gsap.to(link, {
                scale: 1.2,
                rotation: 360,
                duration: 0.6,
                ease: "back.out(1.7)"
            });
        });

        link.addEventListener('mouseleave', () => {
            gsap.to(link, {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });

    // Terminal loader with typewriter effect
    const terminalLoader = document.querySelector('.terminal-loader');
    if (terminalLoader) {
        gsap.fromTo(terminalLoader,
            {
                y: 100,
                opacity: 0,
                rotationX: -90
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 1.5,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: terminalLoader,
                    scroller: "[data-scroll-container]",
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // Avatar container special effects
    const avatarContainer = document.getElementById('avatar-container');
    if (avatarContainer) {
        gsap.to(avatarContainer, {
            rotationY: 360,
            ease: "none",
            scrollTrigger: {
                trigger: avatarContainer,
                scroller: "[data-scroll-container]",
                start: "top center",
                end: "bottom center",
                scrub: 1
            }
        });
    }

    // Advanced navbar animations
    gsap.fromTo('header', 
        { 
            y: -100, 
            opacity: 0, 
            backdropFilter: "blur(0px)" 
        },
        { 
            y: 0, 
            opacity: 1, 
            backdropFilter: "blur(20px)",
            duration: 1.5,
            ease: "power3.out",
            delay: 0.2
        }
    );

    gsap.fromTo('.nav-item', 
        { 
            y: -50, 
            opacity: 0, 
            rotationY: -90 
        },
        { 
            y: 0, 
            opacity: 1, 
            rotationY: 0,
            duration: 1,
            stagger: 0.1,
            ease: "back.out(1.7)",
            delay: 0.8
        }
    );

    // Parallax cursor interaction
    let mouse = { x: 0, y: 0 };
    let pos = { x: 0, y: 0 };

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    gsap.ticker.add(() => {
        pos.x += (mouse.x - pos.x) * 0.1;
        pos.y += (mouse.y - pos.y) * 0.1;

        gsap.set('.parallax-layer', {
            x: pos.x * -0.02,
            y: pos.y * -0.02,
            rotation: pos.x * -0.01
        });
    });
}

// Mobile navbar functionality
function initMobileNavigation() {
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

// Enhanced smooth scroll to sections with Locomotive integration
function initSmoothNavigation() {
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection && locoScroll) {
                locoScroll.scrollTo(targetSection, {
                    offset: -100,
                    duration: 1500,
                    easing: [0.25, 0.0, 0.35, 1.0]
                });
            }
        });
    });
}

// Active link detection with Locomotive Scroll
function initActiveLinkDetection() {
    if (!locoScroll) return;

    locoScroll.on('scroll', (args) => {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (args.scroll.y >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure all resources are loaded
    setTimeout(() => {
        initLocomotiveScroll();
        initAdvancedParallaxAnimations();
        initMobileNavigation();
        initSmoothNavigation();
        initActiveLinkDetection();
        
        // Force refresh after initialization
        setTimeout(() => {
            if (locoScroll) {
                locoScroll.update();
                ScrollTrigger.refresh();
            }
        }, 200);
    }, 100);
});

// Handle page resize
window.addEventListener('resize', () => {
    if (locoScroll) {
        setTimeout(() => {
            locoScroll.update();
            ScrollTrigger.refresh();
        }, 100);
    }
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (locoScroll) {
        locoScroll.destroy();
    }
});
