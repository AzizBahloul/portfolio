// ============================================
// TROLL LOGIN BUTTON FEATURE 😂
// ============================================

(function() {
  'use strict';

  // Wait for DOM to be ready
  function initTrollButton() {
    // Create the troll login button wrapper (fixed position at right edge)
    const li = document.createElement('div');
    li.className = 'troll-nav-item';

    // Create the button
    const trollButton = document.createElement('button');
    trollButton.className = 'troll-login-btn';
    trollButton.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
      </svg>
      <span>Login</span>
    `;
    
    li.appendChild(trollButton);
    document.body.appendChild(li);
    
    // Base offset from the right edge (matches navbar spacing)
    const initialRight = 30;
    
    // Wait a frame for the element to be rendered
    requestAnimationFrame(() => {
      const nav = document.querySelector('.glass-nav-menu');
      const navRect = nav ? nav.getBoundingClientRect() : null;

      const rightPosition = navRect
        ? window.innerWidth - navRect.left - initialRight - li.offsetWidth
        : window.innerWidth - li.offsetWidth - initialRight;

      // Left target roughly aligned with the left side of the navbar
      const leftPosition = navRect ? navRect.left + 10 : 30;

      li.style.left = rightPosition + 'px';
      li.style.right = 'auto';
      
      let trollPhase = 0; // 0 = first hover, 1 = zoomed left, 2 = can click
      let isAnimating = false;

      // PHASE 1: ZOOM FAR LEFT
      function zoomToLeft() {
        if (isAnimating) return;
        isAnimating = true;
        trollPhase = 1;
        
        trollButton.classList.add('zoom-car');
        
        // Animate using left property for smooth movement
        li.style.transition = 'left 0.3s cubic-bezier(0.1, 0, 0.9, 0)';
        li.style.left = leftPosition + 'px';
        
        showTooltip('Not this one.');
        
        setTimeout(() => {
          trollButton.classList.remove('zoom-car');
          isAnimating = false;
        }, 320);
      }

      // PHASE 2: ZOOM back to RIGHT
      function zoomBackToRight() {
        if (isAnimating) return;
        isAnimating = true;
        trollPhase = 2;

        trollButton.classList.add('zoom-car-reverse');
        
        // Animate back to right using current navbar position
        const nav = document.querySelector('.glass-nav-menu');
        const navRect = nav ? nav.getBoundingClientRect() : null;

        const currentRightPos = navRect
          ? window.innerWidth - navRect.left - initialRight - li.offsetWidth
          : window.innerWidth - li.offsetWidth - initialRight;

        li.style.transition = 'left 0.3s cubic-bezier(0.1, 0, 0.9, 0)';
        li.style.left = currentRightPos + 'px';
        
        showTooltip('Coming back.');
        
        setTimeout(() => {
          trollButton.classList.remove('zoom-car-reverse');
          isAnimating = false;
          // Now user can click!
          showTooltip('Now you can click.');
        }, 320);
      }
      
      // Update position on window resize
      window.addEventListener('resize', () => {
        if (trollPhase === 0 || trollPhase === 2) {
          li.style.transition = 'none';
          li.style.left = (window.innerWidth - li.offsetWidth - initialRight) + 'px';
        }
      });

      function showTooltip(text) {
        // Remove any existing tooltips first
        document.querySelectorAll('.troll-tooltip').forEach(t => t.remove());
        
        const tooltip = document.createElement('div');
        tooltip.className = 'troll-tooltip';
        tooltip.textContent = text;
        document.body.appendChild(tooltip);
        
        // Position in center of screen for visibility
        tooltip.style.left = '50%';
        tooltip.style.top = '80px';
        
        setTimeout(() => {
          tooltip.classList.add('show');
        }, 10);
        
        setTimeout(() => {
          tooltip.classList.remove('show');
          setTimeout(() => tooltip.remove(), 300);
        }, 1200);
      }

      // Mouse enter - trigger the phases
      trollButton.addEventListener('mouseenter', () => {
        if (isAnimating) return;
        
        if (trollPhase === 0) {
          // First hover: ZOOM to the LEFT! 🚗💨
          zoomToLeft();
        } else if (trollPhase === 1) {
          // Second hover (button is on left): ZOOM back to RIGHT! 💨🚗
          zoomBackToRight();
        }
        // Phase 2: button is clickable, do nothing on hover
      });

      // Click handler
      trollButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (trollPhase === 0) {
          // Clicked before hovering much - zoom away!
          zoomToLeft();
        } else if (trollPhase === 1) {
          // Clicked while on left - zoom back
          zoomBackToRight();
        } else if (trollPhase === 2) {
          // Phase 2 - they can finally click! Go to troll page
          trollButton.style.transition = 'transform 0.3s ease';
          trollButton.style.transform = 'scale(0) rotate(360deg)';
          setTimeout(() => {
            window.location.href = 'troll.html';
          }, 300);
        }
      });

      // Touch support for mobile
      trollButton.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        
        if (trollPhase === 0) {
          e.preventDefault();
          zoomToLeft();
        } else if (trollPhase === 1) {
          e.preventDefault();
          zoomBackToRight();
        }
        // Phase 2: allow click through
      });

      // Pulse animation to attract attention
      setInterval(() => {
        if (!isAnimating && trollPhase !== 1) {
          trollButton.classList.add('pulse');
          setTimeout(() => {
            trollButton.classList.remove('pulse');
          }, 1000);
        }
      }, 4000);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTrollButton);
  } else {
    initTrollButton();
  }

})();
