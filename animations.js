import gsap from 'gsap';

// Smooth scroll to sections
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);

        gsap.to(window, { duration: 1, scrollTo: { y: targetSection.offsetTop } });

        // Trigger animation for the target section
        gsap.from(targetSection, { opacity: 0, duration: 1, y: 50 });
    });
});

// Animate project cards on load
window.addEventListener('load', () => {
    gsap.from('.card', { opacity: 0, duration: 1, y: 50, stagger: 0.2 });
    gsap.from('.card2', { opacity: 0, duration: 1, y: 50, stagger: 0.2 });
});
