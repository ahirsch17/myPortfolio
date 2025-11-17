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
                '--primary-color': '#6d7bff',
                '--secondary-color': '#a855f7',
                '--accent-color': '#ec4899',
                '--bg-color': '#f5f6fb',
                '--surface-color': 'rgba(255, 255, 255, 0.94)',
                '--surface-soft': 'rgba(255, 255, 255, 0.85)',
                '--card-bg': 'rgba(255, 255, 255, 0.92)',
                '--card-border': 'rgba(148, 163, 184, 0.18)',
                '--nav-bg': 'rgba(255, 255, 255, 0.85)',
                '--nav-border': 'rgba(148, 163, 184, 0.18)',
                '--toolbar-bg': 'rgba(15, 23, 42, 0.45)',
                '--toolbar-border': 'rgba(255, 255, 255, 0.12)',
                '--toolbar-text': '#f8fafc',
                '--heading-color': '#0f172a',
                '--text-primary': '#111827',
                '--text-secondary': 'rgba(30, 41, 59, 0.72)',
                '--text-muted': 'rgba(71, 85, 105, 0.68)',
                '--pill-bg': 'rgba(255, 255, 255, 0.65)',
                '--preview-overlay': 'linear-gradient(180deg, rgba(15, 23, 42, 0.08), rgba(15, 23, 42, 0.78))',
                '--contact-surface': 'linear-gradient(135deg, rgba(109, 123, 255, 0.12), rgba(236, 72, 153, 0.12))',
                '--scroll-preview-bg': 'rgba(15, 23, 42, 0.06)',
                '--shadow-color': 'rgba(17, 24, 39, 0.12)',
                '--footer-bg': '#0f172a',
                '--footer-text': 'rgba(226, 232, 240, 0.8)'
            },
            dusk: {
                '--primary-color': '#8b5cf6',
                '--secondary-color': '#ec4899',
                '--accent-color': '#f97316',
                '--bg-color': '#111827',
                '--surface-color': 'rgba(26, 32, 58, 0.9)',
                '--surface-soft': 'rgba(30, 41, 72, 0.82)',
                '--card-bg': 'rgba(20, 30, 54, 0.88)',
                '--card-border': 'rgba(99, 102, 241, 0.35)',
                '--nav-bg': 'rgba(17, 24, 39, 0.7)',
                '--nav-border': 'rgba(99, 102, 241, 0.28)',
                '--toolbar-bg': 'rgba(79, 70, 229, 0.25)',
                '--toolbar-border': 'rgba(148, 163, 184, 0.38)',
                '--toolbar-text': '#e2e8f0',
                '--heading-color': '#f5f3ff',
                '--text-primary': '#e2e8f0',
                '--text-secondary': 'rgba(203, 213, 225, 0.85)',
                '--text-muted': 'rgba(148, 163, 184, 0.7)',
                '--pill-bg': 'rgba(99, 102, 241, 0.22)',
                '--preview-overlay': 'linear-gradient(180deg, rgba(15, 23, 42, 0.35), rgba(15, 23, 42, 0.8))',
                '--contact-surface': 'linear-gradient(135deg, rgba(99, 102, 241, 0.22), rgba(236, 72, 153, 0.16))',
                '--scroll-preview-bg': 'rgba(17, 24, 39, 0.55)',
                '--shadow-color': 'rgba(15, 23, 42, 0.4)',
                '--footer-bg': 'rgba(10, 14, 26, 0.95)',
                '--footer-text': 'rgba(226, 232, 240, 0.85)'
            },
            midnight: {
                '--primary-color': '#38bdf8',
                '--secondary-color': '#6366f1',
                '--accent-color': '#c084fc',
                '--bg-color': '#050711',
                '--surface-color': 'rgba(8, 12, 24, 0.92)',
                '--surface-soft': 'rgba(12, 18, 32, 0.82)',
                '--card-bg': 'rgba(10, 17, 31, 0.88)',
                '--card-border': 'rgba(56, 189, 248, 0.28)',
                '--nav-bg': 'rgba(5, 8, 17, 0.75)',
                '--nav-border': 'rgba(56, 189, 248, 0.24)',
                '--toolbar-bg': 'rgba(56, 189, 248, 0.22)',
                '--toolbar-border': 'rgba(148, 163, 184, 0.25)',
                '--toolbar-text': '#e0f2fe',
                '--heading-color': '#f0f9ff',
                '--text-primary': 'rgba(226, 232, 240, 0.96)',
                '--text-secondary': 'rgba(203, 213, 225, 0.85)',
                '--text-muted': 'rgba(148, 163, 184, 0.6)',
                '--pill-bg': 'rgba(56, 189, 248, 0.22)',
                '--preview-overlay': 'linear-gradient(180deg, rgba(8, 12, 24, 0.4), rgba(5, 8, 17, 0.85))',
                '--contact-surface': 'linear-gradient(135deg, rgba(56, 189, 248, 0.22), rgba(99, 102, 241, 0.25))',
                '--scroll-preview-bg': 'rgba(6, 11, 24, 0.7)',
                '--shadow-color': 'rgba(8, 145, 178, 0.28)',
                '--footer-bg': 'rgba(3, 6, 15, 0.95)',
                '--footer-text': 'rgba(226, 232, 240, 0.82)'
            }
        },
        init() {
            this.setupMotionObserver();
            this.setupTaglineAnimation();
            this.setupHeroField();
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
                            // Stop observing once visible to prevent re-triggering
                            observer.unobserve(entry.target);
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
        setupCarousel() {
            const track = document.getElementById('projectCarousel');
            const indicators = document.querySelectorAll('#carouselIndicators .indicator');
            const prevBtn = document.querySelector('.carousel-control.prev');
            const nextBtn = document.querySelector('.carousel-control.next');

            if (!track) return;

            const cards = Array.from(track.querySelectorAll('.preview-card'));
            if (cards.length === 0) return;

            let currentIndex = 0;

            const centerActiveCard = (index, behavior = prefersReducedMotion ? 'auto' : 'smooth') => {
                const activeCard = cards[index];
                if (!activeCard) return;

                const trackRect = track.getBoundingClientRect();
                const cardRect = activeCard.getBoundingClientRect();
                const offset = (cardRect.left - trackRect.left) - (trackRect.width / 2 - cardRect.width / 2);
                const targetScroll = track.scrollLeft + offset;

                track.scrollTo({
                    left: targetScroll,
                    behavior
                });
            };

            const goToSlide = (index, options = {}) => {
                const clamped = (index + cards.length) % cards.length;
                cards.forEach((card, idx) => {
                    card.classList.toggle('active', idx === clamped);
                });
                indicators.forEach((indicator, idx) => {
                    indicator.classList.toggle('active', idx === clamped);
                    indicator.setAttribute('aria-selected', idx === clamped ? 'true' : 'false');
                });
                track.setAttribute('data-active-index', String(clamped));
                currentIndex = clamped;
                const behavior = options.behavior ?? (prefersReducedMotion ? 'auto' : 'smooth');
                centerActiveCard(clamped, behavior);
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

            cards.forEach((card) => {
                const link = card.querySelector('.preview-link');
                if (!link) return;

                card.addEventListener('click', (event) => {
                    const anchor = event.target.closest('a');
                    if (anchor) {
                        pause();
                        return;
                    }
                    window.location.href = link.href;
                });
            });

            window.addEventListener('resize', () => {
                centerActiveCard(currentIndex);
            });

            goToSlide(0, { behavior: 'auto' });
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
                    // Don't apply tilt effect if hovering over links
                    if (event.target.closest('a')) {
                        card.style.transform = '';
                        return;
                    }
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
                document.documentElement.setAttribute('data-theme', theme);
            };

            const initialTheme = document.documentElement.getAttribute('data-theme') || 'light';

            chips.forEach((chip) => {
                const isActive = chip.dataset.theme === initialTheme;
                chip.classList.toggle('active', isActive);
                chip.setAttribute('aria-pressed', isActive ? 'true' : 'false');
                chip.addEventListener('click', () => {
                    chips.forEach((c) => c.classList.remove('active'));
                    chip.classList.add('active');
                    chips.forEach((c) => c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'));
                    applyPalette(chip.dataset.theme || 'light');
                });
            });
            applyPalette(initialTheme);
        },
        setupCursorGlow() {
            const glow = document.getElementById('cursorGlow');
            if (!glow) return;

            const interactiveSelectors = 'a, button, .hero-preview-card, .preview-card, .preview-link';
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
            const simulators = document.querySelectorAll('.scroll-simulator');
            if (!simulators.length) return;

            simulators.forEach((simulator) => {
                const controls = simulator.querySelectorAll('.scroll-control');
                const items = simulator.querySelectorAll('.scroll-item');

                const setEffect = (effect) => {
                    simulator.dataset.effect = effect;
                    controls.forEach((control) => {
                        control.classList.toggle('active', control.dataset.effect === effect);
                    });

                    if (prefersReducedMotion) {
                        items.forEach((item) => {
                            item.style.animation = 'none';
                            item.style.opacity = '1';
                            item.style.transform = 'none';
                        });
                        return;
                    }

                    items.forEach((item) => {
                        item.style.animation = 'none';
                        void item.offsetWidth;
                        item.style.animation = '';
                    });
                };

                controls.forEach((control) => {
                    control.addEventListener('click', () => {
                        const effect = control.dataset.effect || 'fade';
                        setEffect(effect);
                    });
                });

                const defaultEffect = simulator.dataset.effect || 'fade';
                setEffect(defaultEffect);
            });
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => App.init());
    } else {
        App.init();
    }
})();

