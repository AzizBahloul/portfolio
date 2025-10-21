// Enhanced FullPage.js-like Scroll Implementation with Advanced Parallax
console.log('🚀 Initializing Enhanced FullPage Scroll System...');

class FullPageScroll {
    constructor(options = {}) {
        this.options = {
            duration: 600,
            easing: 'power2.out',
            autoScrolling: true,
            scrollHorizontally: false,
            navigation: true,
            navigationPosition: 'right',
            scrollBar: false,
            parallax: true,
            touchSensitivity: 3,
            wheelSensitivity: 0.8,
            animateAnchor: true,
            continuousVertical: false,
            ...options
        };

        this.currentSection = 0;
        this.totalSections = 0;
        this.isScrolling = false;
        this.touchStartY = 0;
        this.touchEndY = 0;
        this.scrollDirection = 0;
        this.sections = [];
        this.parallaxElements = [];
        this.wheelDelta = 0;
        this.lastWheelTime = 0;
        
        this.init();
    }

    init() {
        console.log('🔧 Initializing Enhanced FullPage scroll system...');
        
        // Check for GSAP
        if (typeof gsap === 'undefined') {
            console.error('❌ GSAP is required for FullPage scroll');
            return;
        }

        // Register GSAP plugins
        if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
        if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

        this.setupDOM();
    this.setVhCssVariable();
        this.setupSections();
        this.setupParallax();
        this.setupNavigation();
        this.bindEvents();
        this.goToSection(0, false); // Start at first section
        this.setupSectionAnimations();
        this.setupLottieAnimations(); // Add this line
        
        console.log('✅ Enhanced FullPage scroll system initialized');
    }

    // Ensure CSS --vh variable is set and update on visualViewport resize
    setVhCssVariable() {
        const setVh = () => {
            try {
                const vh = (window.innerHeight || document.documentElement.clientHeight) * 0.01;
                document.documentElement.style.setProperty('--vh', `${vh}px`);
                // update our internal fullVh
                this.fullVh = `calc(var(--vh, 1vh) * 100)`;
            } catch (e) { /* ignore */ }
        };

        setVh();
        window.addEventListener('resize', setVh);
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', setVh);
        }
    }

    setupDOM() {
        // Set body and html styles for fullpage behavior
        gsap.set(['html', 'body'], {
            height: '100%',
            overflow: 'hidden',
            margin: 0,
            padding: 0
        });

        // Create main container if it doesn't exist
        let container = document.querySelector('.fullpage-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'fullpage-container';
            
            // Move all sections into the container
            const sections = document.querySelectorAll('section');
            sections.forEach(section => {
                container.appendChild(section);
            });
            
            // Insert container after header if it exists
            const header = document.querySelector('header');
            if (header) {
                header.parentNode.insertBefore(container, header.nextSibling);
            } else {
                document.body.appendChild(container);
            }
        }

        // Use CSS variable --vh for robust mobile/secondary-monitor behavior
        this.fullVh = 'calc(var(--vh, 1vh) * 100)';
        gsap.set(container, {
            position: 'relative',
            height: this.fullVh,
            width: '100%',
            overflow: 'hidden'
        });
    }

    setupSections() {
        this.sections = document.querySelectorAll('section');
        this.totalSections = this.sections.length;

        console.log(`📋 Found ${this.totalSections} sections`);

        this.sections.forEach((section, index) => {
            // Set section styles
            gsap.set(section, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: this.fullVh,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: this.totalSections - index,
                willChange: 'transform'
            });

            // Initially position all sections below the viewport except the first
            if (index > 0) {
                gsap.set(section, { y: this.fullVh });
            }

            // Add section data
            section.setAttribute('data-section-index', index);
            section.classList.add('fp-section');
            
            // Add unique identifier for each section
            if (!section.id) {
                section.id = `fp-section-${index}`;
            }
        });
    }

    setupSectionAnimations() {
        // Setup entrance animations for each section
        this.sections.forEach((section, index) => {
            const content = section.querySelector('.section-content');
            const parallaxElements = section.querySelectorAll('[data-parallax]');
            
            if (content) {
                const children = content.children;
                gsap.set(children, {
                    opacity: 0,
                    y: 50,
                    scale: 0.95
                });
            }
            
            // Setup parallax elements initial state
            parallaxElements.forEach(el => {
                gsap.set(el, {
                    opacity: 0,
                    y: 30
                });
            });
        });
        
        // Animate first section on load
        this.animateSectionIn(0);
    }

    animateSectionIn(index) {
        const section = this.sections[index];
        if (!section) return;
        
        const content = section.querySelector('.section-content');
        const parallaxElements = section.querySelectorAll('[data-parallax]');
        
        const tl = gsap.timeline();
        
        if (content) {
            const children = Array.from(content.children);
            
            tl.to(children, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.5,
                stagger: 0.05,
                ease: 'back.out(1.7)'
            });
        }
        
        // Animate parallax elements
        if (parallaxElements.length > 0) {
            tl.to(parallaxElements, {
                opacity: 1,
                y: 0,
                duration: 0.4,
                stagger: 0.03,
                ease: 'power2.out'
            }, '-=0.3');
        }
    }

    animateSectionOut(index) {
        const section = this.sections[index];
        if (!section) return;
        
        const content = section.querySelector('.section-content');
        const parallaxElements = section.querySelectorAll('[data-parallax]');
        
        const tl = gsap.timeline();
        
        if (content) {
            const children = Array.from(content.children);
            
            tl.to(children, {
                opacity: 0.7,
                scale: 0.95,
                duration: 0.25,
                ease: 'power2.in'
            });
        }
    }

    setupParallax() {
        // Find all parallax elements
        this.parallaxElements = document.querySelectorAll('[data-parallax]');
        
        console.log(`🎨 Found ${this.parallaxElements.length} parallax elements`);

        this.parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            element.parallaxSpeed = speed;
            element.initialY = 0;
        });

        // Setup background parallax layers
        const parallaxBgs = document.querySelectorAll('.parallax-bg, [class*="parallax-bg-"]');
        parallaxBgs.forEach((bg, index) => {
            gsap.set(bg, {
                position: 'absolute',
                top: '-10%',
                left: 0,
                width: '100%',
                height: '120%',
                zIndex: -1,
                willChange: 'transform'
            });
        });
    }

    setupNavigation() {
        if (!this.options.navigation) return;

        // Remove existing navigation if any
        const existingNav = document.querySelector('.fp-navigation');
        if (existingNav) existingNav.remove();

        // Create navigation dots
        const nav = document.createElement('div');
        nav.className = 'fp-navigation';
        nav.innerHTML = Array.from({ length: this.totalSections }, (_, i) => {
            const sectionId = this.sections[i].id || `section-${i}`;
            const sectionName = this.getSectionName(i);
            return `<a href="#${sectionId}" data-section="${i}" class="fp-nav-dot ${i === 0 ? 'active' : ''}" title="${sectionName}">
                        <span class="fp-nav-tooltip">${sectionName}</span>
                    </a>`;
        }).join('');

        document.body.appendChild(nav);

        // Style navigation with enhanced effects
        gsap.set(nav, {
            position: 'fixed',
            [this.options.navigationPosition]: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            gap: '15px'
        });

        this.navigationDots = nav.querySelectorAll('.fp-nav-dot');
        
        // Enhanced navigation interaction
        this.navigationDots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                this.goToSection(index);
            });
            
            // Add hover effects
            dot.addEventListener('mouseenter', () => {
                gsap.to(dot, {
                    scale: 1.2,
                    duration: 0.2,
                    ease: 'back.out(1.7)'
                });
            });
            
            dot.addEventListener('mouseleave', () => {
                if (!dot.classList.contains('active')) {
                    gsap.to(dot, {
                        scale: 1,
                        duration: 0.2,
                        ease: 'back.out(1.7)'
                    });
                }
            });
        });
    }

    getSectionName(index) {
        const section = this.sections[index];
        return section.id.charAt(0).toUpperCase() + section.id.slice(1) || `Section ${index + 1}`;
    }

    bindEvents() {
        // Enhanced mouse wheel event with momentum
        document.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        
        // Touch events for mobile with improved sensitivity
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Keyboard events
        document.addEventListener('keydown', this.handleKeyDown.bind(this));

        // Navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = href.substring(1);
                const section = document.getElementById(target);
                if (section) {
                    const index = parseInt(section.getAttribute('data-section-index'));
                    if (!isNaN(index)) {
                        this.goToSection(index);
                    }
                }
            });
        });

        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));
        
        // Handle browser back/forward
        window.addEventListener('popstate', this.handlePopState.bind(this));
    }

    handleWheel(e) {
        if (this.isScrolling) {
            e.preventDefault();
            return;
        }

        e.preventDefault();

        const currentTime = Date.now();
        const timeDiff = currentTime - this.lastWheelTime;
        
        // Prevent too rapid scrolling
        if (timeDiff < 30) return;
        
        this.lastWheelTime = currentTime;
        
        const delta = e.deltaY;
        const threshold = 5;

        if (Math.abs(delta) > threshold) {
            if (delta > 0) {
                this.nextSection();
            } else {
                this.prevSection();
            }
        }
    }

    handleTouchStart(e) {
        this.touchStartY = e.touches[0].clientY;
        this.touchStartTime = Date.now();
    }
    
    handleTouchMove(e) {
        // Prevent default to avoid page bouncing
        e.preventDefault();
    }

    handleTouchEnd(e) {
        if (this.isScrolling) return;

        this.touchEndY = e.changedTouches[0].clientY;
        const deltaY = this.touchStartY - this.touchEndY;
        const deltaTime = Date.now() - this.touchStartTime;
        
        const threshold = 30;
        const maxTime = 200;

        if (Math.abs(deltaY) > threshold && deltaTime < maxTime) {
            if (deltaY > 0) {
                this.nextSection();
            } else {
                this.prevSection();
            }
        }
    }

    handleKeyDown(e) {
        if (this.isScrolling) return;

        switch (e.key) {
            case 'ArrowDown':
            case 'PageDown':
            case ' ':
                e.preventDefault();
                this.nextSection();
                break;
            case 'ArrowUp':
            case 'PageUp':
                e.preventDefault();
                this.prevSection();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSection(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSection(this.totalSections - 1);
                break;
        }
    }

    handleResize() {
        // Recalculate section positions on resize
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            this.setupSections();
            this.goToSection(this.currentSection, false);
        }, 250);
    }
    
    handlePopState(e) {
        // Handle browser back/forward navigation
        const hash = window.location.hash.substring(1);
        if (hash) {
            const section = document.getElementById(hash);
            if (section) {
                const index = parseInt(section.getAttribute('data-section-index'));
                if (!isNaN(index)) {
                    this.goToSection(index, false);
                }
            }
        }
    }

    nextSection() {
        if (this.currentSection < this.totalSections - 1) {
            this.goToSection(this.currentSection + 1);
        } else if (this.options.continuousVertical) {
            this.goToSection(0);
        }
    }

    prevSection() {
        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        } else if (this.options.continuousVertical) {
            this.goToSection(this.totalSections - 1);
        }
    }

    goToSection(index, animate = true) {
        if (index < 0 || index >= this.totalSections || this.isScrolling) return;

        console.log(`🎯 Going to section ${index}`);

        const direction = index > this.currentSection ? 1 : -1;
        const prevSection = this.currentSection;
        this.currentSection = index;
        this.isScrolling = true;

        // Update navigation
        this.updateNavigation(index);

        if (!animate) {
            this.sections.forEach((section, i) => {
                let yPos = '0%';
                if (i < index) yPos = '-100vh';
                if (i > index) yPos = '100vh';
                gsap.set(section, { y: yPos });
            });
            this.updateParallax(0);
            this.isScrolling = false;
            this.animateSectionIn(index);
            return;
        }

        // Animate out current section
        if (prevSection !== index) {
            this.animateSectionOut(prevSection);
        }

        // Create main transition timeline
        const tl = gsap.timeline({
            duration: this.options.duration / 1000,
            ease: this.options.easing,
            onComplete: () => {
                this.isScrolling = false;
                this.onSectionChange(index, prevSection);
                this.animateSectionIn(index);
            }
        });

        // Animate sections with staggered effect
        this.sections.forEach((section, i) => {
            let yPos = '0%';
            if (i < index) yPos = '-100vh';
            if (i > index) yPos = '100vh';

            const delay = Math.abs(i - prevSection) * 0.02;

            tl.to(section, {
                y: yPos,
                duration: this.options.duration / 1000,
                ease: this.options.easing,
                delay: delay
            }, 0);
        });

        // Animate parallax elements during transition
        if (this.options.parallax) {
            tl.to({}, {
                duration: this.options.duration / 1000,
                onUpdate: () => {
                    const progress = tl.progress();
                    this.updateParallax(progress * direction);
                }
            }, 0);
        }

        // Update URL hash
        this.updateURL(index);
    }

    updateNavigation(activeIndex) {
        if (!this.navigationDots) return;

        this.navigationDots.forEach((dot, i) => {
            const isActive = i === activeIndex;
            dot.classList.toggle('active', isActive);
            
            gsap.to(dot, {
                scale: isActive ? 1.3 : 1,
                duration: 0.25,
                ease: 'back.out(1.7)'
            });
        });
    }

    updateParallax(progress) {
        this.parallaxElements.forEach(element => {
            const speed = element.parallaxSpeed || 0.5;
            const offset = progress * speed * 100;
            gsap.set(element, { 
                y: `${element.initialY + offset}vh`,
                rotationX: offset * 0.1,
                rotationY: offset * 0.05
            });
        });

        // Update background parallax with different speeds for depth
        const parallaxBgs = document.querySelectorAll('.parallax-bg, [class*="parallax-bg-"]');
        parallaxBgs.forEach((bg, index) => {
            const speed = 0.2 + (index * 0.1);
            const offset = progress * speed * 30;
            gsap.set(bg, { 
                y: `${offset}vh`,
                scale: 1 + (Math.abs(offset) * 0.001)
            });
        });
    }

    updateURL(index) {
        const targetSection = this.sections[index];
        if (targetSection.id && this.options.animateAnchor) {
            const newURL = `${window.location.pathname}#${targetSection.id}`;
            history.pushState(null, null, newURL);
        }
    }

    onSectionChange(newIndex, oldIndex) {
        console.log(`📍 Section changed from ${oldIndex} to ${newIndex}`);
        
        // Trigger custom event
        const event = new CustomEvent('sectionChange', {
            detail: { 
                newIndex, 
                oldIndex, 
                section: this.sections[newIndex],
                direction: newIndex > oldIndex ? 'down' : 'up'
            }
        });
        document.dispatchEvent(event);

        // Add/remove active classes
        this.sections.forEach((section, i) => {
            section.classList.toggle('active', i === newIndex);
        });
    }

    // Add Lottie animation initialization and debugging
    setupLottieAnimations() {
        console.log('🎬 Setting up Lottie animations...');
        
        // Wait for Lottie player component to be ready
        setTimeout(() => {
            const lottieElements = document.querySelectorAll('dotlottie-player');
            console.log(`Found ${lottieElements.length} Lottie players`);
            
            lottieElements.forEach((player, index) => {
                // Ensure player is visible
                player.style.visibility = 'visible';
                player.style.opacity = '1';
                player.style.display = 'block';
                
                // Add loading event listeners
                player.addEventListener('ready', () => {
                    console.log(`✅ Lottie player ${index + 1} ready`);
                    player.play();
                });
                
                player.addEventListener('load', () => {
                    console.log(`📽️ Lottie player ${index + 1} loaded`);
                });
                
                player.addEventListener('error', (e) => {
                    console.error(`❌ Lottie player ${index + 1} error:`, e);
                });
                
                // Force play if not already playing
                setTimeout(() => {
                    if (player.currentState !== 'playing') {
                        player.play();
                    }
                }, 1000);
            });
        }, 500);
    }

    // Public API methods
    moveTo(index) {
        this.goToSection(index);
    }

    moveDown() {
        this.nextSection();
    }

    moveUp() {
        this.prevSection();
    }

    getCurrentSection() {
        return this.currentSection;
    }

    getTotalSections() {
        return this.totalSections;
    }

    setScrollingSpeed(speed) {
        this.options.duration = speed;
    }

    setAllowScrolling(allow) {
        this.options.autoScrolling = allow;
    }

    destroy() {
        // Remove event listeners
        document.removeEventListener('wheel', this.handleWheel);
        document.removeEventListener('touchstart', this.handleTouchStart);
        document.removeEventListener('touchmove', this.handleTouchMove);
        document.removeEventListener('touchend', this.handleTouchEnd);
        document.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('popstate', this.handlePopState);
        
        // Remove navigation
        const nav = document.querySelector('.fp-navigation');
        if (nav) nav.remove();
        
        // Reset styles
        gsap.set(['html', 'body'], { clearProps: 'all' });
        gsap.set(this.sections, { clearProps: 'all' });
        
        console.log('🗑️ FullPage scroll system destroyed');
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM ready, initializing Enhanced FullPage scroll...');
    
    // Wait for other resources to load
    setTimeout(() => {
        window.fullPageScroll = new FullPageScroll({
            duration: 500,
            easing: 'power2.out',
            navigation: true,
            navigationPosition: 'right',
            parallax: true,
            touchSensitivity: 3,
            wheelSensitivity: 0.8,
            animateAnchor: true,
            continuousVertical: false
        });
        
        // Add loading complete event
        document.dispatchEvent(new CustomEvent('fullPageReady', {
            detail: { instance: window.fullPageScroll }
        }));
    }, 100);
});

// Export for manual initialization
window.FullPageScroll = FullPageScroll;
