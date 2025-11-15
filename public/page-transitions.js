// Smooth Page Transitions
class PageTransitions {
    constructor() {
        this.transitioning = false;
        this.init();
    }
    
    init() {
        // Create transition overlay
        this.createOverlay();
        
        // Intercept navigation
        this.interceptLinks();
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            this.handleTransition();
        });
    }
    
    createOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'page-transition-overlay';
        overlay.id = 'pageTransitionOverlay';
        document.body.appendChild(overlay);
    }
    
    interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            
            if (!link) return;
            
            // Only handle internal navigation
            const href = link.getAttribute('href');
            if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }
            
            // Ignore if opening in new tab
            if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) {
                return;
            }
            
            e.preventDefault();
            this.transitionTo(href);
        });
    }
    
    transitionTo(url) {
        if (this.transitioning) return;
        
        this.transitioning = true;
        const overlay = document.getElementById('pageTransitionOverlay');
        const body = document.body;
        
        // Add transitioning class
        body.classList.add('page-transitioning');
        
        // Show overlay
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);
        
        // Navigate after transition
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }
    
    handleTransition() {
        const overlay = document.getElementById('pageTransitionOverlay');
        
        // Fade in overlay
        overlay.classList.add('active');
        
        // Fade out after page loads
        setTimeout(() => {
            overlay.classList.remove('active');
            document.body.classList.remove('page-transitioning');
        }, 100);
    }
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.pageTransitions = new PageTransitions();
    });
} else {
    window.pageTransitions = new PageTransitions();
}

// Handle page load
window.addEventListener('load', () => {
    const overlay = document.getElementById('pageTransitionOverlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.remove('active');
            document.body.classList.remove('page-transitioning');
        }, 300);
    }
});





