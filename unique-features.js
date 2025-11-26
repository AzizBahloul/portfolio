// ============================================
// UNIQUE INTERACTIVE FEATURES
// ============================================

(function() {
  'use strict';

  // ============================================
  // 1. LOADING SCREEN WITH PROGRESS
  // ============================================
  const loadingScreen = document.createElement('div');
  loadingScreen.className = 'loading-screen';
  loadingScreen.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Loading Portfolio...</div>
    <div class="loading-progress">
      <div class="loading-progress-bar"></div>
    </div>
  `;
  document.body.appendChild(loadingScreen);

  let progress = 0;
  const progressBar = loadingScreen.querySelector('.loading-progress-bar');
  const loadingInterval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress > 100) progress = 100;
    progressBar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => loadingScreen.remove(), 500);
      }, 300);
    }
  }, 200);

  window.addEventListener('load', () => {
    progress = 100;
    progressBar.style.width = '100%';
  });

  // ============================================
  // 2. MAGNETIC CURSOR EFFECT
  // ============================================
  const cursor = document.createElement('div');
  cursor.className = 'magnetic-cursor';
  document.body.appendChild(cursor);

  const cursorFollower = document.createElement('div');
  cursorFollower.className = 'magnetic-cursor-follower';
  document.body.appendChild(cursorFollower);

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    cursor.classList.add('active');
    cursorFollower.classList.add('active');
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Magnetic effect on interactive elements
  const magneticElements = document.querySelectorAll('a, button, .card, .panel');
  magneticElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      cursor.style.borderColor = '#58baff';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      cursor.style.borderColor = '#b108bd';
    });
  });

  // ============================================
  // 3. SCROLL PROGRESS INDICATOR
  // ============================================
  const scrollProgress = document.createElement('div');
  scrollProgress.className = 'scroll-progress';
  document.body.appendChild(scrollProgress);

  window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    scrollProgress.style.width = progress + '%';
  });

  // ============================================
  // 4. PARTICLE SYSTEM BACKGROUND
  // ============================================
  const particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'particle-canvas';
  document.body.appendChild(particleCanvas);
  const ctx = particleCanvas.getContext('2d');

  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;

  const particles = [];
  const particleCount = 50;

  class Particle {
    constructor() {
      this.x = Math.random() * particleCanvas.width;
      this.y = Math.random() * particleCanvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = Math.random() * 0.5 - 0.25;
      this.speedY = Math.random() * 0.5 - 0.25;
      this.color = Math.random() > 0.5 ? 'rgba(177, 8, 189, 0.5)' : 'rgba(88, 186, 255, 0.5)';
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > particleCanvas.width) this.x = 0;
      if (this.x < 0) this.x = particleCanvas.width;
      if (this.y > particleCanvas.height) this.y = 0;
      if (this.y < 0) this.y = particleCanvas.height;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });

    // Draw connections
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach(p2 => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          ctx.strokeStyle = `rgba(88, 186, 255, ${0.2 * (1 - distance / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });

    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('resize', () => {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
  });

//   // ============================================
//   // 5. FLOATING ACTION BUTTON (FAB)
//   // ============================================
//   const fabContainer = document.createElement('div');
//   fabContainer.className = 'fab-container';
//   fabContainer.innerHTML = `
//     <div class="fab-actions">
//       <button class="fab-action" data-tooltip="Scroll to Top" id="fab-top">
//         <svg viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
//       </button>
//       <button class="fab-action" data-tooltip="Toggle Theme" id="fab-theme">
//         <svg viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
//       </button>
//       <button class="fab-action" data-tooltip="Share Portfolio" id="fab-share">
//         <svg viewBox="0 0 24 24"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
//       </button>
//     </div>
//     <button class="fab-main" id="fab-toggle">
//       <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
//     </button>
//   `;
//   document.body.appendChild(fabContainer);
// 
//   document.getElementById('fab-toggle').addEventListener('click', () => {
//     fabContainer.classList.toggle('active');
//   });
// 
//   document.getElementById('fab-top').addEventListener('click', () => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//     fabContainer.classList.remove('active');
//   });
// 
//   document.getElementById('fab-theme').addEventListener('click', () => {
//     document.body.classList.toggle('dark-mode');
//     fabContainer.classList.remove('active');
//   });
// 
//   document.getElementById('fab-share').addEventListener('click', () => {
//     if (navigator.share) {
//       navigator.share({
//         title: 'Si Aziz Bahloul - Portfolio',
//         text: 'Check out my portfolio!',
//         url: window.location.href
//       });
//     } else {
//       copyToClipboard(window.location.href);
//       showToast('Link copied to clipboard!');
//     }
//     fabContainer.classList.remove('active');
//   });

  // ============================================
  // 6. COMMAND PALETTE (Ctrl+K)
  // ============================================
  const commandPalette = document.createElement('div');
  commandPalette.className = 'command-palette';
  commandPalette.innerHTML = `
    <input type="text" class="command-palette-input" placeholder="Type a command or search..." />
    <div class="command-palette-results">
      <div class="command-item" data-action="home">
        <svg class="command-item-icon" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        <span class="command-item-text">Go to Home</span>
        <span class="command-item-shortcut">Alt+H</span>
      </div>
      <div class="command-item" data-action="about">
        <svg class="command-item-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        <span class="command-item-text">Go to About</span>
        <span class="command-item-shortcut">Alt+A</span>
      </div>
      <div class="command-item" data-action="projects">
        <svg class="command-item-icon" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>
        <span class="command-item-text">Go to Projects</span>
        <span class="command-item-shortcut">Alt+P</span>
      </div>
      <div class="command-item" data-action="contact">
        <svg class="command-item-icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        <span class="command-item-text">Go to Contact</span>
        <span class="command-item-shortcut">Alt+C</span>
      </div>
      <div class="command-item" data-action="theme">
        <svg class="command-item-icon" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        <span class="command-item-text">Toggle Theme</span>
        <span class="command-item-shortcut">Ctrl+T</span>
      </div>
    </div>
  `;
  document.body.appendChild(commandPalette);

  const commandInput = commandPalette.querySelector('.command-palette-input');
  const commandItems = commandPalette.querySelectorAll('.command-item');

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      commandPalette.classList.toggle('active');
      if (commandPalette.classList.contains('active')) {
        commandInput.focus();
      }
    }
    if (e.key === 'Escape') {
      commandPalette.classList.remove('active');
    }
  });

  commandItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      executeCommand(action);
      commandPalette.classList.remove('active');
    });
  });

  function executeCommand(action) {
    switch(action) {
      case 'home':
        document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'about':
        document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'projects':
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'contact':
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        break;
      case 'theme':
        document.body.classList.toggle('dark-mode');
        break;
    }
  }

  // ============================================
  // 7. KONAMI CODE EASTER EGG
  // ============================================
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  const konamiSuccess = document.createElement('div');
  konamiSuccess.className = 'konami-success';
  konamiSuccess.textContent = '🎮 You found the secret! 🎮';
  document.body.appendChild(konamiSuccess);

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        activateKonamiCode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });

  function activateKonamiCode() {
    konamiSuccess.classList.add('active');
    // Add matrix rain effect
    const matrixRain = document.createElement('canvas');
    matrixRain.className = 'matrix-rain active';
    matrixRain.width = window.innerWidth;
    matrixRain.height = window.innerHeight;
    document.body.appendChild(matrixRain);

    const matrixCtx = matrixRain.getContext('2d');
    const chars = '01アイウエオカキクケコサシスセソ';
    const fontSize = 16;
    const columns = matrixRain.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
      matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      matrixCtx.fillRect(0, 0, matrixRain.width, matrixRain.height);
      matrixCtx.fillStyle = '#0F0';
      matrixCtx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        matrixCtx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > matrixRain.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const matrixInterval = setInterval(drawMatrix, 33);

    setTimeout(() => {
      konamiSuccess.classList.remove('active');
      matrixRain.classList.remove('active');
      setTimeout(() => {
        matrixRain.remove();
        clearInterval(matrixInterval);
      }, 500);
    }, 3000);
  }

  // ============================================
  // 8. COPY TO CLIPBOARD FUNCTIONALITY
  // ============================================
  const copyToast = document.createElement('div');
  copyToast.className = 'copy-toast';
  copyToast.textContent = 'Copied to clipboard!';
  document.body.appendChild(copyToast);

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied to clipboard!');
    });
  }

  function showToast(message) {
    copyToast.textContent = message;
    copyToast.classList.add('active');
    setTimeout(() => {
      copyToast.classList.remove('active');
    }, 2000);
  }

  // Add copy functionality to contact links
  document.querySelectorAll('.neural-link').forEach(link => {
    link.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const text = link.querySelector('span').textContent;
      copyToClipboard(text);
    });
  });

  // ============================================
  // 9. KEYBOARD SHORTCUTS
  // ============================================
  document.addEventListener('keydown', (e) => {
    if (e.altKey) {
      switch(e.key) {
        case 'h':
          e.preventDefault();
          document.getElementById('home').scrollIntoView({ behavior: 'smooth' });
          break;
        case 'a':
          e.preventDefault();
          document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
          break;
        case 'p':
          e.preventDefault();
          document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
          break;
        case 'c':
          e.preventDefault();
          document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
          break;
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
      e.preventDefault();
      document.body.classList.toggle('dark-mode');
    }
  });

  // ============================================
  // 10. 3D TILT EFFECT ON CARDS
  // ============================================
  const cards = document.querySelectorAll('.card, .certificate-card, .panel');
  cards.forEach(card => {
    card.classList.add('tilt-card');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
  });

  // ============================================
  // 11. SMOOTH REVEAL ANIMATIONS ON SCROLL
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  document.querySelectorAll('.certificate-card, .experience-card, .card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

})();
