// Theme Customization Sandbox
// Demonstrates React-like state management and DOM manipulation skills

class ThemeSandbox {
    constructor() {
        this.theme = {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            accentColor: '#2563eb',
            textColor: '#333',
            bgColor: '#fafafa',
            animationSpeed: 0.3,
            hoverScale: 1.05
        };
        
        this.loadSavedTheme();
        this.init();
    }
    
    loadSavedTheme() {
        const saved = localStorage.getItem('portfolio-theme');
        if (saved) {
            try {
                this.theme = { ...this.theme, ...JSON.parse(saved) };
            } catch (e) {
                console.error('Failed to load saved theme:', e);
            }
        }
    }
    
    saveTheme() {
        localStorage.setItem('portfolio-theme', JSON.stringify(this.theme));
    }
    
    init() {
        // Apply initial theme
        this.applyTheme();
        
        // Create sandbox UI
        this.createSandboxUI();
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    createSandboxUI() {
        const sandbox = document.createElement('div');
        sandbox.id = 'theme-sandbox';
        sandbox.innerHTML = `
            <div class="sandbox-toggle" id="sandboxToggle" title="Open Theme Customizer">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M12 1v6m0 6v6M1 12h6m6 0h6m-9.364-5.636l4.243 4.243m-4.243 4.243l4.243-4.243m-4.243-4.243l-4.243 4.243m4.243-4.243l-4.243-4.243"></path>
                </svg>
            </div>
            <div class="sandbox-panel" id="sandboxPanel">
                <div class="sandbox-header">
                    <h3>🎨 Theme Customizer</h3>
                    <button class="sandbox-close" id="sandboxClose">×</button>
                </div>
                <div class="sandbox-content">
                    <div class="sandbox-section">
                        <label>Primary Color</label>
                        <div class="control-group">
                            <input type="color" id="primaryColor" value="${this.theme.primaryColor}">
                            <input type="text" id="primaryColorText" value="${this.theme.primaryColor}">
                        </div>
                    </div>
                    <div class="sandbox-section">
                        <label>Secondary Color</label>
                        <div class="control-group">
                            <input type="color" id="secondaryColor" value="${this.theme.secondaryColor}">
                            <input type="text" id="secondaryColorText" value="${this.theme.secondaryColor}">
                        </div>
                    </div>
                    <div class="sandbox-section">
                        <label>Accent Color</label>
                        <div class="control-group">
                            <input type="color" id="accentColor" value="${this.theme.accentColor}">
                            <input type="text" id="accentColorText" value="${this.theme.accentColor}">
                        </div>
                    </div>
                    <div class="sandbox-section">
                        <label>Animation Speed: <span id="speedValue">${this.theme.animationSpeed}s</span></label>
                        <input type="range" id="animationSpeed" min="0.1" max="1" step="0.1" value="${this.theme.animationSpeed}">
                    </div>
                    <div class="sandbox-section">
                        <label>Hover Scale: <span id="scaleValue">${this.theme.hoverScale}x</span></label>
                        <input type="range" id="hoverScale" min="1" max="1.5" step="0.05" value="${this.theme.hoverScale}">
                    </div>
                    <div class="sandbox-actions">
                        <button class="btn-reset" id="resetTheme">Reset Default</button>
                        <button class="btn-export" id="exportTheme">Export Code</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(sandbox);
        
        // Add styles
        this.addSandboxStyles();
    }
    
    addSandboxStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #theme-sandbox {
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 9999;
            }
            
            .sandbox-toggle {
                width: 56px;
                height: 56px;
                background: var(--primary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }
            
            .sandbox-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
            }
            
            .sandbox-panel {
                position: fixed;
                bottom: 90px;
                right: 20px;
                width: 320px;
                max-height: 70vh;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
                transform: translateY(20px) scale(0.95);
                opacity: 0;
                pointer-events: none;
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                overflow: hidden;
            }
            
            .sandbox-panel.active {
                transform: translateY(0) scale(1);
                opacity: 1;
                pointer-events: all;
            }
            
            .sandbox-header {
                padding: 1.25rem;
                background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .sandbox-header h3 {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .sandbox-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s ease;
            }
            
            .sandbox-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }
            
            .sandbox-content {
                padding: 1.25rem;
                max-height: calc(70vh - 80px);
                overflow-y: auto;
            }
            
            .sandbox-section {
                margin-bottom: 1.5rem;
            }
            
            .sandbox-section label {
                display: block;
                font-weight: 600;
                color: var(--text-color);
                margin-bottom: 0.5rem;
                font-size: 0.9rem;
            }
            
            .control-group {
                display: flex;
                gap: 0.5rem;
                align-items: center;
            }
            
            .control-group input[type="color"] {
                width: 60px;
                height: 40px;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                cursor: pointer;
            }
            
            .control-group input[type="text"] {
                flex: 1;
                padding: 0.5rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-family: monospace;
                font-size: 0.85rem;
            }
            
            .sandbox-section input[type="range"] {
                width: 100%;
                height: 6px;
                border-radius: 3px;
                background: #e5e7eb;
                outline: none;
                -webkit-appearance: none;
            }
            
            .sandbox-section input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--primary-color);
                cursor: pointer;
            }
            
            .sandbox-section input[type="range"]::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: var(--primary-color);
                cursor: pointer;
                border: none;
            }
            
            .sandbox-actions {
                display: flex;
                gap: 0.75rem;
                margin-top: 1.5rem;
            }
            
            .btn-reset, .btn-export {
                flex: 1;
                padding: 0.75rem;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .btn-reset {
                background: #f3f4f6;
                color: var(--text-color);
            }
            
            .btn-reset:hover {
                background: #e5e7eb;
            }
            
            .btn-export {
                background: var(--primary-color);
                color: white;
            }
            
            .btn-export:hover {
                background: var(--secondary-color);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupEventListeners() {
        const toggle = document.getElementById('sandboxToggle');
        const close = document.getElementById('sandboxClose');
        const panel = document.getElementById('sandboxPanel');
        
        toggle?.addEventListener('click', () => {
            panel.classList.toggle('active');
        });
        
        close?.addEventListener('click', () => {
            panel.classList.remove('active');
        });
        
        // Color inputs
        ['primaryColor', 'secondaryColor', 'accentColor'].forEach(color => {
            const colorInput = document.getElementById(color);
            const textInput = document.getElementById(color + 'Text');
            
            colorInput?.addEventListener('input', (e) => {
                textInput.value = e.target.value;
                this.theme[color === 'primaryColor' ? 'primaryColor' : color === 'secondaryColor' ? 'secondaryColor' : 'accentColor'] = e.target.value;
                this.applyTheme();
            });
            
            textInput?.addEventListener('change', (e) => {
                if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                    colorInput.value = e.target.value;
                    this.theme[color === 'primaryColor' ? 'primaryColor' : color === 'secondaryColor' ? 'secondaryColor' : 'accentColor'] = e.target.value;
                    this.applyTheme();
                }
            });
        });
        
        // Animation speed
        const speedInput = document.getElementById('animationSpeed');
        speedInput?.addEventListener('input', (e) => {
            this.theme.animationSpeed = parseFloat(e.target.value);
            document.getElementById('speedValue').textContent = this.theme.animationSpeed + 's';
            this.applyTheme();
        });
        
        // Hover scale
        const scaleInput = document.getElementById('hoverScale');
        scaleInput?.addEventListener('input', (e) => {
            this.theme.hoverScale = parseFloat(e.target.value);
            document.getElementById('scaleValue').textContent = this.theme.hoverScale + 'x';
            this.applyTheme();
        });
        
        // Reset button
        document.getElementById('resetTheme')?.addEventListener('click', () => {
            this.resetTheme();
        });
        
        // Export button
        document.getElementById('exportTheme')?.addEventListener('click', () => {
            this.exportTheme();
        });
    }
    
    applyTheme() {
        const root = document.documentElement;
        root.style.setProperty('--primary-color', this.theme.primaryColor);
        root.style.setProperty('--secondary-color', this.theme.secondaryColor);
        root.style.setProperty('--accent-color', this.theme.accentColor);
        root.style.setProperty('--animation-speed', this.theme.animationSpeed + 's');
        root.style.setProperty('--hover-scale', this.theme.hoverScale);
        
        this.saveTheme();
    }
    
    resetTheme() {
        this.theme = {
            primaryColor: '#667eea',
            secondaryColor: '#764ba2',
            accentColor: '#2563eb',
            textColor: '#333',
            bgColor: '#fafafa',
            animationSpeed: 0.3,
            hoverScale: 1.05
        };
        
        // Update UI
        document.getElementById('primaryColor').value = this.theme.primaryColor;
        document.getElementById('primaryColorText').value = this.theme.primaryColor;
        document.getElementById('secondaryColor').value = this.theme.secondaryColor;
        document.getElementById('secondaryColorText').value = this.theme.secondaryColor;
        document.getElementById('accentColor').value = this.theme.accentColor;
        document.getElementById('accentColorText').value = this.theme.accentColor;
        document.getElementById('animationSpeed').value = this.theme.animationSpeed;
        document.getElementById('speedValue').textContent = this.theme.animationSpeed + 's';
        document.getElementById('hoverScale').value = this.theme.hoverScale;
        document.getElementById('scaleValue').textContent = this.theme.hoverScale + 'x';
        
        this.applyTheme();
    }
    
    exportTheme() {
        const css = `:root {
    --primary-color: ${this.theme.primaryColor};
    --secondary-color: ${this.theme.secondaryColor};
    --accent-color: ${this.theme.accentColor};
    --animation-speed: ${this.theme.animationSpeed}s;
    --hover-scale: ${this.theme.hoverScale};
}`;
        
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'custom-theme.css';
        a.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeSandbox = new ThemeSandbox();
    });
} else {
    window.themeSandbox = new ThemeSandbox();
}





