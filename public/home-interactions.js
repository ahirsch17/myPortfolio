(function () {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const App = {
        taglinePhrases: [
            'Human-centered Interfaces',
            'Playful Product Experiences',
            'Motion-led Storytelling',
            'Inclusive Design Systems',
            'Data-rich Visual Narratives'
        ],
        taglineIndex: 0,
        taglineTimer: null,
        carouselTimer: null,
        carouselAutoDelay: 5200,
        themePalette: {
            light: {
                '--bg-color': '#f5f6fb',
                '--card-bg': '#ffffff',
                '--text-color': '#1f2933',
                '--primary-color': '#6d7bff',
                '--secondary-color': '#a855f7',
                '--accent-color': '#ec4899',
                '--shadow-color': 'rgba(17, 24, 39, 0.12)'
            },
            dusk: {
                '--bg-color': '#141527',
                '--card-bg': 'rgba(15, 23, 42, 0.85)',
                '--text-color': '#f5f3ff',
                '--primary-color': '#8b5cf6',
                '--secondary-color': '#ec4899',
                '--accent-color': '#f97316',
                '--shadow-color': 'rgba(15, 23, 42, 0.35)'
            },
            midnight: {
                '--bg-color': '#0b1220',
                '--card-bg': 'rgba(15, 23, 42, 0.9)',
                '--text-color': '#e2e8f0',
                '--primary-color': '#38bdf8',
                '--secondary-color': '#6366f1',
                '--accent-color': '#c084fc',
                '--shadow-color': 'rgba(8, 145, 178, 0.25)'
            }
        },
        init() {
            this.setupMotionObserver();
            this.setupTaglineAnimation();
            this.setupHeroField();
            this.setupFloatingToolbar();
            this.setupCarousel();
            this.setupScrollTargets();
            this.setupTiltCards();
            this.setupRippleButtons();
            this.setupThemeToggle();
            this.setupCursorGlow();
            this.setupScrollDemo();
        },
        setupMotionObserver() {
            const sections = document.querySelectorAll('.motion-section');
            if (!sections.length) return;

            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            entry.target.classList.add('is-visible');
                        } else if (!prefersReducedMotion) {
                            entry.target.classList.remove('is-visible');
                        }
                    });
                },
                { threshold: 0.2 }
            );

            sections.forEach((section) => observer.observe(section));
        },
        setupTaglineAnimation() {
            const taglineEl = document.getElementById('taglineText');
            if (!taglineEl) return;

            taglineEl.textContent = this.taglinePhrases[0];
            if (prefersReducedMotion) return;

            const cycle = () => {
                this.taglineIndex = (this.taglineIndex + 1) % this.taglinePhrases.length;
                taglineEl.classList.remove('is-entering');
                taglineEl.classList.add('is-leaving');

                setTimeout(() => {
                    taglineEl.textContent = this.taglinePhrases[this.taglineIndex];
                    taglineEl.classList.remove('is-leaving');
                    taglineEl.classList.add('is-entering');
                }, 260);
            };

            this.taglineTimer = window.setInterval(cycle, 3200);
        },
        setupHeroField() {
            const canvas = document.getElementById('heroCanvas');
            const hero = document.querySelector('.hero');
            if (!canvas || !hero) return;

            const ctx = canvas.getContext('2d');
            const state = {
                points: [],
                mouse: { x: null, y: null, active: false },
                width: 0,
                height: 0,
                ratio: window.devicePixelRatio || 1
            };

            const resize = () => {
                const rect = hero.getBoundingClientRect();
                state.ratio = window.devicePixelRatio || 1;
                canvas.width = rect.width * state.ratio;
                canvas.height = rect.height * state.ratio;
                canvas.style.width = `${rect.width}px`;
                canvas.style.height = `${rect.height}px`;
                ctx.setTransform(state.ratio, 0, 0, state.ratio, 0, 0);
                state.width = rect.width;
                state.height = rect.height;
                state.points = createPoints();
            };

            const createPoints = () => {
                const count = Math.min(110, Math.floor((state.width * state.height) / 6000));
                return Array.from({ length: count }, () => ({
                    x: Math.random() * state.width,
                    y: Math.random() * state.height,
                    vx: (Math.random() - 0.5) * 0.2,
                    vy: (Math.random() - 0.5) * 0.2,
                    offset: Math.random() * Math.PI * 2
                }));
            };

            const draw = () => {
                ctx.clearRect(0, 0, state.width, state.height);

                const gradient = ctx.createLinearGradient(0, 0, state.width, state.height);
                gradient.addColorStop(0, 'rgba(109, 123, 255, 0.35)');
                gradient.addColorStop(0.5, 'rgba(236, 72, 153, 0.25)');
                gradient.addColorStop(1, 'rgba(56, 189, 248, 0.18)');

                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, state.width, state.height);

                state.points.forEach((point, index) => {
                    point.x += point.vx + Math.sin(Date.now() * 0.0007 + point.offset) * 0.15;
                    point.y += point.vy + Math.cos(Date.now() * 0.0006 + point.offset) * 0.15;

                    if (point.x < 0 || point.x > state.width) point.vx *= -1;
                    if (point.y < 0 || point.y > state.height) point.vy *= -1;

                    if (state.mouse.active) {
                        const dx = point.x - state.mouse.x;
                        const dy = point.y - state.mouse.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        const influence = 140;
                        if (dist < influence) {
                            const force = (influence - dist) / influence;
                            point.x += dx * force * 0.06;
                            point.y += dy * force * 0.06;
                        }
                    }

                    for (let j = index + 1; j < state.points.length; j++) {
                        const other = state.points[j];
                        const dx = point.x - other.x;
                        const dy = point.y - other.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 140) {
                            ctx.strokeStyle = `rgba(255, 255, 255, ${0.12 - dist / 1200})`;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(point.x, point.y);
                            ctx.lineTo(other.x, other.y);
                            ctx.stroke();
                        }
                    }

                    ctx.beginPath();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
                    ctx.arc(point.x, point.y, 2.2, 0, Math.PI * 2);
                    ctx.fill();
                });

                if (!prefersReducedMotion) {
                    window.requestAnimationFrame(draw);
                }
            };

            const handlePointerMove = (event) => {
                const rect = canvas.getBoundingClientRect();
                state.mouse.x = event.clientX - rect.left;
                state.mouse.y = event.clientY - rect.top;
                state.mouse.active = true;
            };

            const handlePointerLeave = () => {
                state.mouse.active = false;
            };

            resize();
            window.addEventListener('resize', resize, { passive: true });
            canvas.addEventListener('pointermove', handlePointerMove);
            canvas.addEventListener('pointerleave', handlePointerLeave);

            if (!prefersReducedMotion) {
                window.requestAnimationFrame(draw);
            } else {
                ctx.fillStyle = 'rgba(109, 123, 255, 0.15)';
                ctx.fillRect(0, 0, state.width, state.height);
            }
        },
        setupFloatingToolbar() {
            const toolbar = document.getElementById('floatingToolbar');
            if (!toolbar) return;

            let ticking = false;
            window.addEventListener(
                'scroll',
                () => {
                    if (!ticking) {
                        window.requestAnimationFrame(() => {
                            const shouldShow = window.scrollY > 120;
                            toolbar.classList.toggle('is-visible', shouldShow);
                            ticking = false;
                        });
                        ticking = true;
                    }
                },
                { passive: true }
            );
        },
        setupCarousel() {
            const track = document.getElementById('projectCarousel');
            const indicators = document.querySelectorAll('#carouselIndicators .indicator');
            const prevBtn = document.querySelector('.carousel-control.prev');
            const nextBtn = document.querySelector('.carousel-control.next');

            if (!track) return;

            const cards = Array.from(track.querySelectorAll('.preview-card'));
            if (cards.length === 0) return;

            const goToSlide = (index) => {
                const clamped = (index + cards.length) % cards.length;
                cards.forEach((card, idx) => {
                    card.classList.toggle('active', idx === clamped);
                });
                indicators.forEach((indicator, idx) => {
                    indicator.classList.toggle('active', idx === clamped);
                    indicator.setAttribute('aria-selected', idx === clamped ? 'true' : 'false');
                });
                track.setAttribute('data-active-index', String(clamped));
            };

            const next = () => {
                const current = Number(track.getAttribute('data-active-index')) || 0;
                goToSlide(current + 1);
            };

            const prev = () => {
                const current = Number(track.getAttribute('data-active-index')) || 0;
                goToSlide(current - 1);
            };

            if (!prefersReducedMotion) {
                this.carouselTimer = window.setInterval(next, this.carouselAutoDelay);
            }

            const pause = () => {
                if (this.carouselTimer) {
                    window.clearInterval(this.carouselTimer);
                    this.carouselTimer = null;
                }
            };

            const resume = () => {
                if (!prefersReducedMotion && !this.carouselTimer) {
                    this.carouselTimer = window.setInterval(next, this.carouselAutoDelay);
                }
            };

            track.addEventListener('pointerenter', pause);
            track.addEventListener('pointerleave', resume);

            cards.forEach((card) => {
                card.addEventListener('focusin', pause);
                card.addEventListener('focusout', resume);
            });

            indicators.forEach((indicator, idx) => {
                indicator.addEventListener('click', () => {
                    pause();
                    goToSlide(idx);
                });

                indicator.addEventListener('pointerenter', pause);
                indicator.addEventListener('pointerleave', resume);
            });

            prevBtn?.addEventListener('click', () => {
                pause();
                prev();
            });
            nextBtn?.addEventListener('click', () => {
                pause();
                next();
            });

            let pointerStart = null;
            track.addEventListener('pointerdown', (event) => {
                pointerStart = event.clientX;
                track.setPointerCapture(event.pointerId);
                pause();
            });
            track.addEventListener('pointerup', (event) => {
                if (pointerStart !== null) {
                    const delta = event.clientX - pointerStart;
                    if (Math.abs(delta) > 40) {
                        if (delta < 0) {
                            next();
                        } else {
                            prev();
                        }
                    }
                }
                pointerStart = null;
                resume();
            });
            track.addEventListener('pointercancel', () => {
                pointerStart = null;
                resume();
            });

            goToSlide(0);
        },
        setupScrollTargets() {
            document.querySelectorAll('[data-scroll-target]').forEach((trigger) => {
                const targetId = trigger.getAttribute('data-scroll-target');
                if (!targetId) return;

                trigger.addEventListener('click', () => {
                    const target = document.getElementById(targetId);
                    if (target) {
                        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
                    }
                });
            });
        },
        setupTiltCards() {
            const tiltCards = document.querySelectorAll('[data-tilt]');
            tiltCards.forEach((card) => {
                const bounds = () => card.getBoundingClientRect();
                card.addEventListener('pointermove', (event) => {
                    const rect = bounds();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    const rotateX = ((y - centerY) / centerY) * -6;
                    const rotateY = ((x - centerX) / centerX) * 6;
                    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
                });
                card.addEventListener('pointerleave', () => {
                    card.style.transform = '';
                });
            });
        },
        setupRippleButtons() {
            const rippleButtons = document.querySelectorAll('[data-ripple]');
            rippleButtons.forEach((button) => {
                button.addEventListener('pointerdown', (event) => {
                    const rect = button.getBoundingClientRect();
                    const ripple = document.createElement('span');
                    ripple.className = 'ripple';
                    ripple.style.left = `${event.clientX - rect.left}px`;
                    ripple.style.top = `${event.clientY - rect.top}px`;
                    button.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 600);
                });
            });
        },
        setupThemeToggle() {
            const chips = document.querySelectorAll('.theme-chip');
            if (!chips.length) return;

            const applyPalette = (theme) => {
                const palette = this.themePalette[theme];
                if (!palette) return;
                Object.entries(palette).forEach(([key, value]) => {
                    document.documentElement.style.setProperty(key, value);
                });
            };

            chips.forEach((chip) => {
                chip.addEventListener('click', () => {
                    chips.forEach((c) => c.classList.remove('active'));
                    chip.classList.add('active');
                    applyPalette(chip.dataset.theme || 'light');
                });
            });
        },
        setupCursorGlow() {
            const glow = document.getElementById('cursorGlow');
            if (!glow) return;

            const interactiveSelectors = 'a, button, .hero-preview-card, .preview-card';
            const interactiveElements = document.querySelectorAll(interactiveSelectors);

            const moveGlow = (event) => {
                glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
            };

            document.addEventListener('pointermove', moveGlow);
            document.addEventListener('pointerleave', () => {
                glow.style.opacity = '0';
            });
            document.addEventListener('pointerenter', () => {
                glow.style.opacity = '1';
            });

            interactiveElements.forEach((el) => {
                el.addEventListener('pointerenter', () => glow.classList.add('is-active'));
                el.addEventListener('pointerleave', () => glow.classList.remove('is-active'));
            });
        },
        setupScrollDemo() {
            const cards = document.querySelectorAll('.scroll-demo-card');
            if (!cards.length) return;

            cards.forEach((card, index) => {
                card.style.transitionDelay = `${index * 0.08}s`;
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();

