// Code Adventure Game
// Interactive project exploration with game-like mechanics
// Demonstrates canvas manipulation, game state, and interactive UI design

class CodeAdventure {
    constructor() {
        this.projects = [
            {
                id: 'samepath',
                name: 'SamePath',
                icon: '📚',
                x: 100,
                y: 150,
                color: '#667eea',
                description: 'Student Collaboration Platform'
            },
            {
                id: 'realestatehirsch',
                name: 'RealEstateHirsch',
                icon: '🏠',
                x: 350,
                y: 300,
                color: '#f5576c',
                description: 'Professional Real Estate Website'
            },
            {
                id: 'sportspredictor',
                name: 'SportsPredictor',
                icon: '🏈',
                x: 600,
                y: 150,
                color: '#4facfe',
                description: 'ML-Powered Sports Analytics'
            }
        ];
        
        this.selectedProject = null;
        this.particles = [];
        this.init();
    }
    
    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }
    
    setup() {
        this.createCanvas();
        this.setupEventListeners();
        
        // Initialize canvas size
        const canvas = document.getElementById('adventureCanvas');
        if (canvas) {
            canvas.width = 800;
            canvas.height = 400;
            const ctx = canvas.getContext('2d');
            ctx.scale(1, 1);
        }
        
        this.animate();
    }
    
    createCanvas() {
        const container = document.querySelector('.projects-showcase');
        if (!container) return;
        
        // Create adventure view
        const adventureView = document.createElement('div');
        adventureView.className = 'adventure-view';
        adventureView.innerHTML = `
            <div class="adventure-header">
                <h2>Explore My Projects</h2>
                <button class="adventure-toggle" id="adventureToggle">
                    <span id="viewMode">Map View</span>
                    <span class="toggle-icon">⇄</span>
                </button>
            </div>
            <div class="adventure-canvas-container">
                <canvas id="adventureCanvas" width="800" height="400"></canvas>
                <div class="adventure-legend">
                    <p>👆 Click on a project to explore</p>
                    <p>✨ Hover to see details</p>
                </div>
            </div>
        `;
        
        container.insertBefore(adventureView, container.firstChild);
        
        // Add styles
        this.addAdventureStyles();
    }
    
    addAdventureStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .adventure-view {
                margin-bottom: 3rem;
                background: var(--card-bg);
                border-radius: 24px;
                padding: 2.2rem;
                border: 1px solid rgba(148, 163, 184, 0.18);
                box-shadow: 0 24px 55px rgba(15, 23, 42, 0.12);
                backdrop-filter: blur(12px);
            }
            
            .adventure-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 1.5rem;
            }
            
            .adventure-header h2 {
                color: #0f172a;
                margin: 0;
                font-size: 1.9rem;
                font-weight: 700;
            }
            
            .adventure-toggle {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.55rem 1.1rem;
                background: linear-gradient(135deg, rgba(109, 123, 255, 0.9), rgba(236, 72, 153, 0.9));
                color: #fff;
                border: none;
                border-radius: 999px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
                box-shadow: 0 14px 30px rgba(109, 123, 255, 0.25);
            }
            
            .adventure-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 0 20px 40px rgba(109, 123, 255, 0.32);
            }
            
            .toggle-icon {
                font-size: 1.2rem;
            }
            
            .adventure-canvas-container {
                position: relative;
                background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(30, 64, 175, 0.75));
                border-radius: 20px;
                padding: 2.2rem;
                overflow: hidden;
                border: 1px solid rgba(148, 163, 184, 0.15);
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05);
            }
            
            #adventureCanvas {
                display: block;
                width: 100%;
                height: auto;
                border-radius: 14px;
                cursor: pointer;
                box-shadow: 0 20px 40px rgba(15, 23, 42, 0.25);
            }
            
            .adventure-legend {
                margin-top: 1rem;
                text-align: center;
                color: rgba(148, 163, 184, 0.9);
                font-size: 0.95rem;
            }
            
            .adventure-legend p {
                margin: 0.25rem 0;
            }
            
            .project-card.adventure-mode {
                display: none;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        const canvas = document.getElementById('adventureCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Toggle between views
        const toggle = document.getElementById('adventureToggle');
        toggle?.addEventListener('click', () => {
            this.toggleView();
        });
        
        // Canvas interactions
        canvas.addEventListener('click', (e) => {
            this.handleClick(e, canvas, ctx);
        });
        
        canvas.addEventListener('mousemove', (e) => {
            this.handleHover(e, canvas, ctx);
        });
        
        // Window resize
        window.addEventListener('resize', () => {
            this.resizeCanvas(canvas);
        });
    }
    
    handleClick(e, canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Check which project was clicked
        for (const project of this.projects) {
            const distance = Math.sqrt(
                Math.pow(x - project.x, 2) + Math.pow(y - project.y, 2)
            );
            
            if (distance < 60) {
                this.selectProject(project);
                break;
            }
        }
    }
    
    handleHover(e, canvas, ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let hovered = null;
        for (const project of this.projects) {
            const distance = Math.sqrt(
                Math.pow(x - project.x, 2) + Math.pow(y - project.y, 2)
            );
            
            if (distance < 60) {
                hovered = project;
                canvas.style.cursor = 'pointer';
                break;
            }
        }
        
        if (!hovered) {
            canvas.style.cursor = 'default';
        }
    }
    
    selectProject(project) {
        this.selectedProject = project;
        
        // Show project modal (reuse existing modal logic)
        if (typeof openModal === 'function') {
            openModal(project.id);
        } else {
            // Fallback: scroll to project card
            const card = document.querySelector(`[data-project="${project.id}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                // Add highlight effect
                card.style.transform = 'scale(1.05)';
                card.style.transition = 'transform 0.3s ease';
                setTimeout(() => {
                    card.style.transform = '';
                }, 500);
            }
        }
        
        // Add particle explosion
        this.createParticleExplosion(project.x, project.y, project.color);
    }
    
    createParticleExplosion(x, y, color) {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                color: color,
                life: 1,
                decay: 0.02
            });
        }
    }
    
    toggleView() {
        const container = document.querySelector('.projects-showcase');
        const cards = container.querySelectorAll('.project-showcase-card');
        const viewMode = document.getElementById('viewMode');
        
        if (container.classList.contains('adventure-active')) {
            // Switch to card view
            container.classList.remove('adventure-active');
            cards.forEach(card => {
                card.classList.remove('adventure-mode');
            });
            viewMode.textContent = 'Map View';
        } else {
            // Switch to adventure view
            container.classList.add('adventure-active');
            cards.forEach(card => {
                card.classList.add('adventure-mode');
            });
            viewMode.textContent = 'Card View';
        }
    }
    
    resizeCanvas(canvas) {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = rect.width || 800;
        const height = rect.height || 400;
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
    }
    
    animate() {
        const canvas = document.getElementById('adventureCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const draw = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw background
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#1a1a2e');
            gradient.addColorStop(1, '#16213e');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw grid
            this.drawGrid(ctx, canvas);
            
            // Draw connections
            this.drawConnections(ctx);
            
            // Update and draw particles
            this.updateParticles(ctx);
            
            // Draw projects
            this.drawProjects(ctx);
            
            // Draw selected project highlight
            if (this.selectedProject) {
                this.drawHighlight(ctx, this.selectedProject);
            }
            
            requestAnimationFrame(draw);
        };
        
        draw();
    }
    
    drawGrid(ctx, canvas) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        
        const spacing = 40;
        for (let x = 0; x < canvas.width; x += spacing) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        for (let y = 0; y < canvas.height; y += spacing) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    drawConnections(ctx) {
        if (this.projects.length < 2) return;
        
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        
        for (let i = 0; i < this.projects.length - 1; i++) {
            for (let j = i + 1; j < this.projects.length; j++) {
                ctx.beginPath();
                ctx.moveTo(this.projects[i].x, this.projects[i].y);
                ctx.lineTo(this.projects[j].x, this.projects[j].y);
                ctx.stroke();
            }
        }
        
        ctx.setLineDash([]);
    }
    
    updateParticles(ctx) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            
            if (p.life <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    drawProjects(ctx) {
        this.projects.forEach((project, index) => {
            // Draw pulsing circle
            const time = Date.now() * 0.001;
            const pulse = Math.sin(time * 2 + index) * 0.3 + 1;
            
            // Outer glow
            const gradient = ctx.createRadialGradient(
                project.x, project.y, 0,
                project.x, project.y, 70 * pulse
            );
            gradient.addColorStop(0, project.color);
            gradient.addColorStop(0.5, project.color + '80');
            gradient.addColorStop(1, project.color + '00');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(project.x, project.y, 70 * pulse, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner circle
            ctx.fillStyle = project.color;
            ctx.beginPath();
            ctx.arc(project.x, project.y, 40, 0, Math.PI * 2);
            ctx.fill();
            
            // Icon
            ctx.font = '32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = 'white';
            ctx.fillText(project.icon, project.x, project.y);
            
            // Project name
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(project.name, project.x, project.y + 65);
        });
    }
    
    drawHighlight(ctx, project) {
        ctx.strokeStyle = project.color;
        ctx.lineWidth = 4;
        ctx.shadowBlur = 20;
        ctx.shadowColor = project.color;
        ctx.beginPath();
        ctx.arc(project.x, project.y, 50, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

// Initialize when projects page loads
function initAdventureGame() {
    const path = window.location.pathname;
    if (path === '/projects' || path.includes('projects') || path === '/projects.html') {
        window.codeAdventure = new CodeAdventure();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdventureGame);
} else {
    initAdventureGame();
}

