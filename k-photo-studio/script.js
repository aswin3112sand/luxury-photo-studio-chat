/* =========================================
   K PHOTO STUDIO | LUXURY GSAP & 3D LOGIC
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const Lenis = window.Lenis;
    const hasGsap = Boolean(gsap && ScrollTrigger);
    const hasLenis = typeof Lenis === "function";
    const supportsClipPath = typeof CSS !== "undefined"
        && typeof CSS.supports === "function"
        && (
            CSS.supports("clip-path", "polygon(0 0, 50% 0, 50% 100%, 0 100%)")
            || CSS.supports("-webkit-clip-path", "polygon(0 0, 50% 0, 50% 100%, 0 100%)")
        );

    if (!supportsClipPath) {
        document.body.classList.add("no-clip-path");
    }

    // --- 1. PRELOADER ---
    const preloaderOverlay = document.getElementById("preloader-overlay");
    const logo = document.querySelector(".preloader-logo");
    const topShutter = document.querySelector(".top-shutter");
    const bottomShutter = document.querySelector(".bottom-shutter");
    let preloaderResolved = false;
    let animationsStarted = false;

    const hidePreloader = () => {
        if (!preloaderOverlay || preloaderResolved) {
            return;
        }

        preloaderResolved = true;
        preloaderOverlay.style.display = "none";
    };

    const startAnimations = () => {
        if (animationsStarted || !hasGsap) {
            return;
        }

        animationsStarted = true;
        initAnimations();
    };

    // Prevent the overlay from trapping the page when opening the file directly
    // or when third-party scripts fail to load.
    window.setTimeout(hidePreloader, 2500);

    if (preloaderOverlay) {
        window.addEventListener("load", () => {
            if (preloaderResolved || !hasGsap || !logo || !topShutter || !bottomShutter) {
                hidePreloader();
                startAnimations();
                return;
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    hidePreloader();
                    startAnimations();
                }
            });
            
            tl.to(logo, { opacity: 1, duration: 0.8, ease: "power2.out" })
              .to(logo, { opacity: 0, duration: 0.5, delay: 0.5, ease: "power2.in" })
              .to(topShutter, { scaleY: 0, duration: 0.8, ease: "power4.inOut" }, "-=0.2")
              .to(bottomShutter, { scaleY: 0, duration: 0.8, ease: "power4.inOut" }, "<");
        });
    } else {
        window.addEventListener("load", startAnimations);
    }

    // --- 2. LENIS SMOOTH SCROLL ---
    const lenis = hasLenis
        ? new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 2,
        })
        : null;

    function raf(time) {
        if (!lenis) {
            return;
        }

        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    if (lenis) {
        requestAnimationFrame(raf);
    }

    // --- 3. CUSTOM CURSOR ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorRing = document.querySelector('.cursor-ring');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Move dot instantly
        if (cursorDot) {
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        }
    });

    // Smooth ring follow
    function renderCursor() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        if (cursorRing) {
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
        }
        requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover Effects
    const linkHoverElements = document.querySelectorAll('a, button, .magnetic-btn, .service-orb, .g-item');
    linkHoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorRing) {
                cursorRing.style.width = '60px';
                cursorRing.style.height = '60px';
                cursorRing.style.backgroundColor = 'rgba(212, 175, 55, 0.1)';
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorRing) {
                cursorRing.style.width = '40px';
                cursorRing.style.height = '40px';
                cursorRing.style.backgroundColor = 'transparent';
            }
        });
    });

    // --- 4. NAVBAR SCROLL ---
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (!navbar) {
            return;
        }

        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 5. INITIALIZE GSAP ANIMATIONS ---
    function initAnimations() {
        if (!hasGsap) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // --- HERO ANIMATIONS ---
        const tl = gsap.timeline();
        
        tl.fromTo('.hero-title', 
            { y: 100, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out" }
        )
        .fromTo('.hero-desc', 
            { y: 30, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8"
        )
        .fromTo('.btn-whatsapp', 
            { scale: 0.9, opacity: 0 }, 
            { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6"
        )
        .fromTo('.navbar', 
            { y: -100 }, 
            { y: 0, duration: 1, ease: "power3.out" }, "-=1"
        );

        // Spline Parallax / Fade on scroll
        gsap.to('.spline-wrapper', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            },
            y: 200,
            opacity: 0.2
        });

        // --- GLOBAL SECTION REVEALS ---
        const sections = document.querySelectorAll('.section');
        sections.forEach(sec => {
            const head = sec.querySelector('.section-head');
            const tag = sec.querySelector('.section-tag');
            
            if (head) {
                gsap.fromTo(head, 
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: sec,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0, opacity: 1, duration: 1, ease: "power3.out"
                    }
                );
            }
            if (tag) {
                gsap.fromTo(tag,
                    { x: -30, opacity: 0 },
                    {
                        scrollTrigger: { trigger: sec, start: "top 80%" },
                        x: 0, opacity: 1, duration: 0.8, ease: "power2.out"
                    }
                );
            }
        });

        // --- STICKY SERVICES SCROLL ---
        const serviceBlocks = gsap.utils.toArray('.s-content-block');
        const visualItems = gsap.utils.toArray('.s-visual-item');
        
        if (serviceBlocks.length > 0 && visualItems.length > 0) {
            serviceBlocks.forEach((block, i) => {
                ScrollTrigger.create({
                    trigger: block,
                    start: "top 60%",
                    end: "bottom 60%",
                    onEnter: () => updateServiceVisual(i),
                    onEnterBack: () => updateServiceVisual(i),
                });
            });
            
            function updateServiceVisual(index) {
                serviceBlocks.forEach(b => b.classList.remove('active'));
                visualItems.forEach(v => v.classList.remove('active'));
                
                if (serviceBlocks[index]) serviceBlocks[index].classList.add('active');
                if (visualItems[index]) visualItems[index].classList.add('active');
            }
        }

        // --- 3D ALBUM FLIP ---
        const book = document.getElementById('book-3d');
        if (book) {
            ScrollTrigger.create({
                trigger: '.albums-3d-section',
                start: "top 50%",
                onEnter: () => book.classList.add('open'),
                onLeaveBack: () => book.classList.remove('open')
            });
        }

        // --- GALLERY MASONRY STAGGER ---
        gsap.fromTo('.g-item',
            { y: 80, opacity: 0, scale: 0.9 },
            {
                scrollTrigger: {
                    trigger: '.gallery-grid',
                    start: "top 80%"
                },
                y: (i, target) => {
                    // Re-apply nth-child CSS offset mentally
                    return target.matches(':nth-child(2n)') ? 60 : 0;
                },
                opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: "power2.out"
            }
        );

        // --- TESTIMONIAL BUBBLES ---
        gsap.fromTo('.test-bubble',
            { y: 100, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.test-bubbles-container',
                    start: "top 85%"
                },
                y: 0, opacity: 1, duration: 1, stagger: 0.3, ease: "power3.out"
            }
        );

        // --- PRICING CARDS ---
        gsap.fromTo('.p-card',
            { y: 80, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: '.pricing-cards',
                    start: "top 80%"
                },
                y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power3.out"
            }
        );

        // --- JOURNEY PATH ANIMATION ---
        const jPath = document.getElementById('journey-path');
        if (jPath) {
            gsap.to('#j-line-fill', {
                scrollTrigger: {
                    trigger: jPath,
                    start: "top 50%",
                    end: "bottom 60%",
                    scrub: true
                },
                height: "100%",
                ease: "none"
            });
            
            const steps = gsap.utils.toArray('.j-step');
            steps.forEach(step => {
                gsap.fromTo(step,
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%"
                        },
                        opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.2)"
                    }
                );
            });
        }
    }

    // --- 6. GALLERY FILTERS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.g-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-cat') === filterValue) {
                    if (hasGsap) {
                        gsap.to(item, { scale: 1, opacity: 1, duration: 0.5, display: 'block', ease: "power2.out" });
                    } else {
                        item.style.display = 'block';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }
                } else {
                    if (hasGsap) {
                        gsap.to(item, { scale: 0.8, opacity: 0, duration: 0.5, display: 'none', ease: "power2.in" });
                    } else {
                        item.style.display = 'none';
                        item.style.opacity = '0';
                        item.style.transform = 'scale(0.8)';
                    }
                }
            });
            // Update ScrollTrigger to recalculate heights
            if (hasGsap) {
                setTimeout(() => ScrollTrigger.refresh(), 600);
            }
        });
    });

    // --- 7. MAGNETIC BUTTONS ---
    const magneticBtns = document.querySelectorAll('.magnetic-btn');
    if (hasGsap) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const h = rect.width / 2;
                const y = rect.height / 2;
                const x = e.clientX - rect.left - h;
                const yPos = e.clientY - rect.top - y;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: yPos * 0.3,
                    duration: 0.5,
                    ease: "power2.out"
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    // --- 8. CONTACT FORM ---
    const form = document.getElementById('booking-form');
    const whatsappCta = document.querySelector('.btn-whatsapp[href*="wa.me/"]');
    const whatsappHref = whatsappCta ? whatsappCta.getAttribute('href') : '';
    const whatsappMatch = whatsappHref ? whatsappHref.match(/wa\.me\/(\d+)/) : null;
    const whatsappNumber = whatsappMatch ? whatsappMatch[1] : '';

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-btn span');
            if (!btn) {
                return;
            }

            const originalText = btn.innerText;
            const name = form.querySelector('#name')?.value.trim() || '';
            const email = form.querySelector('#email')?.value.trim() || '';
            const date = form.querySelector('#date')?.value.trim() || '';
            const story = form.querySelector('#message')?.value.trim() || 'Not provided';

            if (!whatsappNumber) {
                btn.innerText = "Update WhatsApp Link";
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 2500);
                return;
            }

            const enquiryMessage = [
                'Hello K Photo Studio, I would like to book a consultation.',
                '',
                `Name: ${name}`,
                `Email: ${email}`,
                `Tentative Date: ${date}`,
                `Story: ${story}`
            ].join('\n');

            btn.innerText = "Opening WhatsApp...";
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiryMessage)}`, '_blank', 'noopener');
            form.reset();

            setTimeout(() => {
                btn.innerText = "WhatsApp Opened";
                setTimeout(() => {
                    btn.innerText = originalText;
                }, 2500);
            }, 400);
        });
    }

    // --- 9. AUDIO TOGGLE ---
    const audioBtn = document.getElementById('audio-toggle');
    const bgAudio = document.getElementById('bg-audio');
    if (audioBtn && bgAudio) {
        audioBtn.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play();
                audioBtn.classList.remove('muted');
            } else {
                bgAudio.pause();
                audioBtn.classList.add('muted');
            }
        });
        // Default visual state
        audioBtn.classList.add('muted');
    }

    // --- 10. BEFORE/AFTER SLIDER ---
    const nativeSlider = document.getElementById('native-slider');
    const sliderHandle = document.getElementById('slider-handle');
    const layerGraded = document.getElementById('layer-graded');
    
    if (nativeSlider && sliderHandle && layerGraded) {
        nativeSlider.addEventListener('input', (e) => {
            const val = e.target.value;
            if (supportsClipPath) {
                layerGraded.style.clipPath = `polygon(0 0, ${val}% 0, ${val}% 100%, 0 100%)`;
            } else {
                layerGraded.style.width = `${val}%`;
            }
            sliderHandle.style.left = `${val}%`;
        });
    }

    // --- 11. FAQ ACCORDION ---
    const faqBtns = document.querySelectorAll('.faq-btn');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const content = btn.nextElementSibling;
            const isActive = item.classList.contains('active');
            
            // Close all
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-content').style.maxHeight = null;
            });
            
            if (!isActive) {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + "px";
            }
            
            // Refresh scroll trigger after expanding
            if (hasGsap) {
                setTimeout(() => ScrollTrigger.refresh(), 400);
            }
        });
    });

    // --- 12. SCROLL TOP ---
    const scrollTopBtn = document.getElementById('scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            if (lenis) {
                lenis.scrollTo(0, { duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }

});
