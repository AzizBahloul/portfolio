// Neural Network Contact Visualization
class NeuralContact {
    constructor() {
        this.canvas = document.getElementById('neuralCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        this.hub = document.querySelector('.neural-hub');
        this.nodes = document.querySelectorAll('.neural-node');
        this.connections = [];
        this.particles = [];
        this.animationId = null;
        
        if (this.canvas && this.ctx) {
            this.init();
        }
    }
    
    init() {
        this.setupCanvas();
        this.createConnections();
        this.setupEventListeners();
        this.animate();
    }
    
    setupCanvas() {
        const resizeCanvas = () => {
            const container = this.canvas.parentElement;
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }
    
    createConnections() {
        if (!this.hub || !this.nodes.length) return;
        
        const hubRect = this.hub.getBoundingClientRect();
        const containerRect = this.canvas.getBoundingClientRect();
        
        const hubCenter = {
            x: hubRect.left + hubRect.width / 2 - containerRect.left,
            y: hubRect.top + hubRect.height / 2 - containerRect.top
        };
        
        this.nodes.forEach(node => {
            const nodeRect = node.getBoundingClientRect();
            const nodeCenter = {
                x: nodeRect.left + nodeRect.width / 2 - containerRect.left,
                y: nodeRect.top + nodeRect.height / 2 - containerRect.top
            };
            
            this.connections.push({
                start: hubCenter,
                end: nodeCenter,
                active: false,
                pulseOffset: Math.random() * Math.PI * 2
            });
        });
    }
    
    setupEventListeners() {
        // Add hover effects for nodes
        this.nodes.forEach((node, index) => {
            node.addEventListener('mouseenter', () => {
                if (this.connections[index]) {
                    this.connections[index].active = true;
                }
                this.createParticles(this.connections[index]);
            });
            
            node.addEventListener('mouseleave', () => {
                if (this.connections[index]) {
                    this.connections[index].active = false;
                }
            });
        });
        
        // Add hub hover effect
        if (this.hub) {
            this.hub.addEventListener('mouseenter', () => {
                this.connections.forEach(conn => conn.active = true);
                this.createHubParticles();
            });
            
            this.hub.addEventListener('mouseleave', () => {
                this.connections.forEach(conn => conn.active = false);
            });
        }
    }
    
    createParticles(connection) {
        if (!connection) return;
        
        for (let i = 0; i < 3; i++) {
            this.particles.push({
                x: connection.start.x,
                y: connection.start.y,
                targetX: connection.end.x,
                targetY: connection.end.y,
                progress: 0,
                speed: 0.02 + Math.random() * 0.03,
                life: 1,
                size: 2 + Math.random() * 3
            });
        }
    }
    
    createHubParticles() {
        this.connections.forEach(connection => {
            this.createParticles(connection);
        });
    }
    
    drawConnection(connection, time) {
        const { start, end, active, pulseOffset } = connection;
        
        // Base connection line
        this.ctx.beginPath();
        this.ctx.moveTo(start.x, start.y);
        this.ctx.lineTo(end.x, end.y);
        
        // Dynamic styling based on activity
        if (active) {
            this.ctx.strokeStyle = `rgba(88, 186, 255, ${0.6 + Math.sin(time * 0.005 + pulseOffset) * 0.3})`;
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([5, 10]);
            this.ctx.lineDashOffset = -time * 0.1;
        } else {
            this.ctx.strokeStyle = 'rgba(88, 186, 255, 0.2)';
            this.ctx.lineWidth = 1;
            this.ctx.setLineDash([2, 8]);
            this.ctx.lineDashOffset = -time * 0.05;
        }
        
        this.ctx.stroke();
        
        // Add glow effect for active connections
        if (active) {
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = '#58baff';
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.progress += particle.speed;
            particle.life -= 0.02;
            
            if (particle.progress >= 1 || particle.life <= 0) {
                return false;
            }
            
            // Bezier curve for particle movement
            const t = particle.progress;
            const controlX = (particle.x + particle.targetX) / 2 + Math.sin(t * Math.PI) * 20;
            const controlY = (particle.y + particle.targetY) / 2 - Math.sin(t * Math.PI) * 30;
            
            particle.x = (1 - t) * (1 - t) * particle.x + 2 * (1 - t) * t * controlX + t * t * particle.targetX;
            particle.y = (1 - t) * (1 - t) * particle.y + 2 * (1 - t) * t * controlY + t * t * particle.targetY;
            
            return true;
        });
    }
    
    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(177, 8, 189, ${particle.life * 0.8})`;
            this.ctx.fill();
            
            // Add glow
            this.ctx.shadowBlur = 8;
            this.ctx.shadowColor = '#b108bd';
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });
    }
    
    animate() {
        if (!this.ctx) return;
        
        const time = Date.now();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => {
            this.drawConnection(connection, time);
        });
        
        // Update and draw particles
        this.updateParticles();
        this.drawParticles();
        
        // Continue animation
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
}

// Enhanced Node Interactions
class NodeInteractions {
    constructor() {
        this.nodes = document.querySelectorAll('.neural-node');
        this.init();
    }
    
    init() {
        this.nodes.forEach(node => {
            this.setupNodeEffects(node);
        });
    }
    
    setupNodeEffects(node) {
        const card = node.querySelector('.node-card');
        if (!card) return;
        
        // 3D tilt effect
        node.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            card.style.transform = `translateZ(20px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        node.addEventListener('mouseleave', () => {
            card.style.transform = 'translateZ(0) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Click ripple effect
        node.addEventListener('click', (e) => {
            this.createRipple(e, card);
        });
    }
    
    createRipple(e, element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(88, 186, 255, 0.6);
            border-radius: 50%;
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            animation: ripple-expand 0.6s ease-out forwards;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if neural network elements exist
    if (document.querySelector('.neural-network')) {
        new NeuralContact();
        new NodeInteractions();
    }
});

// Add ripple animation CSS
const rippleCSS = `
@keyframes ripple-expand {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    100% {
        transform: translate(-50%, -50%) scale(25);
        opacity: 0;
    }
}
`;

// Inject ripple CSS
const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);
