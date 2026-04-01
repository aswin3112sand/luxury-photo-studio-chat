/* =========================================
   K PHOTO STUDIO | LUXURY GSAP & 3D LOGIC
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const Lenis = window.Lenis;
    const hasGsap = Boolean(gsap && ScrollTrigger);
    const hasLenis = typeof Lenis === "function";

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const isCompactLayout = window.matchMedia("(max-width: 768px)").matches;
    const supportsClipPath = typeof CSS !== "undefined"
        && typeof CSS.supports === "function"
        && (
            CSS.supports("clip-path", "polygon(0 0, 50% 0, 50% 100%, 0 100%)")
            || CSS.supports("-webkit-clip-path", "polygon(0 0, 50% 0, 50% 100%, 0 100%)")
        );

    const body = document.body;
    const shouldUseLenis = hasLenis && !prefersReducedMotion && !isCompactLayout;
    const shouldLoadSpline = hasFinePointer && !prefersReducedMotion && !isCompactLayout;
    const enablePointerEffects = hasFinePointer && !prefersReducedMotion;

    if (!supportsClipPath) {
        body.classList.add("no-clip-path");
    }

    if (prefersReducedMotion) {
        body.classList.add("reduced-motion");
    }

    const preloaderOverlay = document.getElementById("preloader-overlay");
    const logo = document.querySelector(".preloader-logo");
    const topShutter = document.querySelector(".top-shutter");
    const bottomShutter = document.querySelector(".bottom-shutter");
    const navbar = document.getElementById("navbar");
    const heroSection = document.querySelector(".hero-section");
    const heroVideo = document.querySelector(".hero-video");
    const heroSplineStage = document.getElementById("hero-spline-stage");
    const splineWrapper = document.querySelector(".spline-wrapper");
    const cursorDot = document.querySelector(".cursor-dot");
    const cursorRing = document.querySelector(".cursor-ring");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const mobileNav = document.getElementById("mobile-nav");

    let preloaderResolved = false;
    let animationsStarted = false;

    const hidePreloader = () => {
        if (!preloaderOverlay || preloaderResolved) {
            return;
        }

        preloaderResolved = true;
        preloaderOverlay.style.display = "none";
    };

    const loadSplineViewer = () => {
        const splineUrl = splineWrapper?.dataset.splineUrl;

        if (!heroSplineStage || !splineUrl || !shouldLoadSpline) {
            body.classList.add("spline-disabled");
            return Promise.resolve();
        }

        const mountViewer = () => {
            if (heroSplineStage.querySelector("spline-viewer")) {
                return;
            }

            const viewer = document.createElement("spline-viewer");
            viewer.setAttribute("url", splineUrl);
            viewer.setAttribute("loading-anim", "");
            heroSplineStage.appendChild(viewer);
            body.classList.remove("spline-disabled");
        };

        if (window.customElements && window.customElements.get("spline-viewer")) {
            mountViewer();
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const finalize = (enabled) => {
                if (!enabled) {
                    body.classList.add("spline-disabled");
                    resolve();
                    return;
                }

                window.setTimeout(() => {
                    mountViewer();
                    resolve();
                }, 0);
            };

            const existingLoader = document.querySelector('script[data-spline-loader="true"]');

            if (existingLoader) {
                existingLoader.addEventListener("load", () => finalize(true), { once: true });
                existingLoader.addEventListener("error", () => finalize(false), { once: true });
                return;
            }

            const script = document.createElement("script");
            script.type = "module";
            script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
            script.dataset.splineLoader = "true";
            script.addEventListener("load", () => finalize(true), { once: true });
            script.addEventListener("error", () => finalize(false), { once: true });
            document.head.appendChild(script);
        });
    };

    const splineReady = loadSplineViewer();

    const startAnimations = () => {
        if (animationsStarted || !hasGsap || prefersReducedMotion) {
            return;
        }

        animationsStarted = true;
        initAnimations();
    };

    window.setTimeout(hidePreloader, 2500);

    if (preloaderOverlay) {
        window.addEventListener("load", async () => {
            await splineReady;

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
        window.addEventListener("load", async () => {
            await splineReady;
            startAnimations();
        });
    }

    const lenis = shouldUseLenis
        ? new Lenis({
            duration: 1.1,
            easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
            direction: "vertical",
            gestureDirection: "vertical",
            smooth: true,
            smoothTouch: false,
            touchMultiplier: 1.5,
        })
        : null;

    if (lenis) {
        if (hasGsap) {
            lenis.on("scroll", () => ScrollTrigger.update());
        }

        const raf = (time) => {
            lenis.raf(time);
            requestAnimationFrame(raf);
        };

        requestAnimationFrame(raf);
    }

    const setMobileNavState = (isOpen) => {
        if (!navbar || !mobileMenuBtn || !mobileNav) {
            return;
        }

        navbar.classList.toggle("nav-open", isOpen);
        body.classList.toggle("nav-open", isOpen);
        mobileMenuBtn.setAttribute("aria-expanded", String(isOpen));
        mobileNav.setAttribute("aria-hidden", String(!isOpen));
    };

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener("click", () => {
            setMobileNavState(!navbar?.classList.contains("nav-open"));
        });

        mobileNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", () => setMobileNavState(false));
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMobileNavState(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 768) {
                setMobileNavState(false);
            }
        });
    }

    const syncNavbarState = () => {
        if (!navbar) {
            return;
        }

        navbar.classList.toggle("scrolled", window.scrollY > 50);
    };

    window.addEventListener("scroll", syncNavbarState, { passive: true });
    syncNavbarState();

    if (enablePointerEffects && cursorDot && cursorRing) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let ringX = mouseX;
        let ringY = mouseY;

        const handleMouseMove = (event) => {
            mouseX = event.clientX;
            mouseY = event.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        };

        const renderCursor = () => {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = `${ringX}px`;
            cursorRing.style.top = `${ringY}px`;
            requestAnimationFrame(renderCursor);
        };

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        renderCursor();

        const hoverElements = document.querySelectorAll("a, button, .magnetic-btn, .g-item, .tilt-surface");
        hoverElements.forEach((element) => {
            element.addEventListener("mouseenter", () => {
                cursorRing.style.width = "60px";
                cursorRing.style.height = "60px";
                cursorRing.style.backgroundColor = "rgba(212, 175, 55, 0.1)";
            });

            element.addEventListener("mouseleave", () => {
                cursorRing.style.width = "40px";
                cursorRing.style.height = "40px";
                cursorRing.style.backgroundColor = "transparent";
            });
        });
    } else {
        if (cursorDot) cursorDot.style.display = "none";
        if (cursorRing) cursorRing.style.display = "none";
    }

    const attachPointerParallax = (container, layers) => {
        if (!enablePointerEffects || !container || layers.length === 0) {
            return;
        }

        let frameId = 0;

        const resetLayers = () => {
            layers.forEach(({ element, scale = 1 }) => {
                if (!element) {
                    return;
                }

                element.style.transform = `translate3d(0, 0, 0) scale(${scale})`;
            });
        };

        container.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") {
                return;
            }

            const rect = container.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;

            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                layers.forEach(({ element, moveX, moveY, scale = 1 }) => {
                    if (!element) {
                        return;
                    }

                    element.style.transform = `translate3d(${px * moveX}px, ${py * moveY}px, 0) scale(${scale})`;
                });
            });
        });

        container.addEventListener("pointerleave", resetLayers);
        resetLayers();
    };

    attachPointerParallax(heroSection, [
        { element: heroVideo, moveX: 16, moveY: 12, scale: 1.05 },
        { element: heroSplineStage, moveX: 28, moveY: 20, scale: 1.04 },
    ]);

    const attachTilt = (element, options) => {
        if (!element) {
            return;
        }

        const resetTilt = () => {
            element.style.setProperty("--tilt-x", "0deg");
            element.style.setProperty("--tilt-y", "0deg");
            element.style.setProperty("--tilt-z", "0px");
        };

        if (!enablePointerEffects) {
            resetTilt();
            return;
        }

        const { maxRotateX, maxRotateY, maxDepth = 0 } = options;
        let frameId = 0;

        element.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") {
                return;
            }

            const rect = element.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            const tiltX = `${(-py * maxRotateX).toFixed(2)}deg`;
            const tiltY = `${(px * maxRotateY).toFixed(2)}deg`;
            const tiltZ = `${(Math.max(Math.abs(px), Math.abs(py)) * maxDepth).toFixed(2)}px`;

            cancelAnimationFrame(frameId);
            frameId = requestAnimationFrame(() => {
                element.style.setProperty("--tilt-x", tiltX);
                element.style.setProperty("--tilt-y", tiltY);
                element.style.setProperty("--tilt-z", tiltZ);
            });
        });

        element.addEventListener("pointerleave", resetTilt);
        resetTilt();
    };

    attachTilt(document.getElementById("about-carousel"), { maxRotateX: 9, maxRotateY: 12, maxDepth: 12 });
    attachTilt(document.querySelector(".d-img-inner"), { maxRotateX: 8, maxRotateY: 10, maxDepth: 10 });
    attachTilt(document.getElementById("book-3d"), { maxRotateX: 7, maxRotateY: 10, maxDepth: 18 });
    attachTilt(document.querySelector(".slider-wrapper"), { maxRotateX: 4, maxRotateY: 6, maxDepth: 0 });

    function initAnimations() {
        if (!hasGsap) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        const tl = gsap.timeline();

        tl.fromTo(".hero-title",
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out" }
        )
            .fromTo(".hero-desc",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.8"
            )
            .fromTo(".btn-whatsapp",
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6"
            )
            .fromTo(".navbar",
                { y: -100 },
                { y: 0, duration: 1, ease: "power3.out" }, "-=1"
            );

        gsap.to(".spline-wrapper", {
            scrollTrigger: {
                trigger: ".hero-section",
                start: "top top",
                end: "bottom top",
                scrub: true
            },
            y: 120,
            opacity: 0.28
        });

        document.querySelectorAll(".section").forEach((section) => {
            const heading = section.querySelector(".section-head");
            const tag = section.querySelector(".section-tag");

            if (heading) {
                gsap.fromTo(heading,
                    { y: 50, opacity: 0 },
                    {
                        scrollTrigger: {
                            trigger: section,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        },
                        y: 0,
                        opacity: 1,
                        duration: 1,
                        ease: "power3.out"
                    }
                );
            }

            if (tag) {
                gsap.fromTo(tag,
                    { x: -30, opacity: 0 },
                    {
                        scrollTrigger: { trigger: section, start: "top 80%" },
                        x: 0,
                        opacity: 1,
                        duration: 0.8,
                        ease: "power2.out"
                    }
                );
            }
        });

        const serviceBlocks = gsap.utils.toArray(".s-content-block");
        const visualItems = gsap.utils.toArray(".s-visual-item");

        if (serviceBlocks.length > 0 && visualItems.length > 0) {
            const updateServiceVisual = (index) => {
                serviceBlocks.forEach((block) => block.classList.remove("active"));
                visualItems.forEach((visual) => visual.classList.remove("active"));

                if (serviceBlocks[index]) serviceBlocks[index].classList.add("active");
                if (visualItems[index]) visualItems[index].classList.add("active");
            };

            serviceBlocks.forEach((block, index) => {
                ScrollTrigger.create({
                    trigger: block,
                    start: "top 60%",
                    end: "bottom 60%",
                    onEnter: () => updateServiceVisual(index),
                    onEnterBack: () => updateServiceVisual(index),
                });
            });
        }

        const book = document.getElementById("book-3d");
        if (book) {
            ScrollTrigger.create({
                trigger: ".albums-3d-section",
                start: "top 50%",
                onEnter: () => book.classList.add("open"),
                onLeaveBack: () => book.classList.remove("open")
            });
        }

        gsap.fromTo(".g-item",
            { y: 80, opacity: 0, scale: 0.9 },
            {
                scrollTrigger: {
                    trigger: ".gallery-grid",
                    start: "top 80%"
                },
                y: (_, target) => {
                    const applyDesktopOffset = window.matchMedia("(min-width: 769px)").matches;
                    return applyDesktopOffset && target.matches(":nth-child(2n)") ? 60 : 0;
                },
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "power2.out"
            }
        );

        gsap.fromTo(".test-bubble",
            { y: 100, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".test-bubbles-container",
                    start: "top 85%"
                },
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.3,
                ease: "power3.out"
            }
        );

        gsap.fromTo(".p-card",
            { y: 80, opacity: 0 },
            {
                scrollTrigger: {
                    trigger: ".pricing-cards",
                    start: "top 80%"
                },
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            }
        );

        const journeyPath = document.getElementById("journey-path");
        if (journeyPath) {
            gsap.to("#j-line-fill", {
                scrollTrigger: {
                    trigger: journeyPath,
                    start: "top 50%",
                    end: "bottom 60%",
                    scrub: true
                },
                height: "100%",
                ease: "none"
            });

            gsap.utils.toArray(".j-step").forEach((step) => {
                gsap.fromTo(step,
                    { opacity: 0, y: 50 },
                    {
                        scrollTrigger: {
                            trigger: step,
                            start: "top 80%"
                        },
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "back.out(1.2)"
                    }
                );
            });
        }
    }

    const filterButtons = document.querySelectorAll(".filter-btn");
    const galleryItems = document.querySelectorAll(".g-item");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            filterButtons.forEach((item) => item.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            galleryItems.forEach((item) => {
                const isVisible = filterValue === "all" || item.getAttribute("data-cat") === filterValue;

                if (hasGsap) {
                    gsap.to(item, {
                        scale: isVisible ? 1 : 0.8,
                        opacity: isVisible ? 1 : 0,
                        duration: 0.45,
                        display: isVisible ? "block" : "none",
                        ease: isVisible ? "power2.out" : "power2.in"
                    });
                } else {
                    item.style.display = isVisible ? "block" : "none";
                    item.style.opacity = isVisible ? "1" : "0";
                    item.style.transform = isVisible ? "scale(1)" : "scale(0.8)";
                }
            });

            if (hasGsap) {
                window.setTimeout(() => ScrollTrigger.refresh(), 500);
            }
        });
    });

    const magneticButtons = document.querySelectorAll(".magnetic-btn");
    if (hasGsap && enablePointerEffects) {
        magneticButtons.forEach((button) => {
            button.addEventListener("mousemove", (event) => {
                const rect = button.getBoundingClientRect();
                const offsetX = event.clientX - rect.left - rect.width / 2;
                const offsetY = event.clientY - rect.top - rect.height / 2;

                gsap.to(button, {
                    x: offsetX * 0.22,
                    y: offsetY * 0.22,
                    duration: 0.45,
                    ease: "power2.out"
                });
            });

            button.addEventListener("mouseleave", () => {
                gsap.to(button, {
                    x: 0,
                    y: 0,
                    duration: 0.45,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }

    const form = document.getElementById("booking-form");
    const whatsappCta = document.querySelector('.btn-whatsapp[href*="wa.me/"]');
    const whatsappHref = whatsappCta ? whatsappCta.getAttribute("href") : "";
    const whatsappMatch = whatsappHref ? whatsappHref.match(/wa\.me\/(\d+)/) : null;
    const whatsappNumber = whatsappMatch ? whatsappMatch[1] : "";

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            const submitLabel = form.querySelector(".submit-btn span");
            if (!submitLabel) {
                return;
            }

            const originalText = submitLabel.innerText;
            const name = form.querySelector("#name")?.value.trim() || "";
            const email = form.querySelector("#email")?.value.trim() || "";
            const date = form.querySelector("#date")?.value.trim() || "";
            const story = form.querySelector("#message")?.value.trim() || "Not provided";

            if (!whatsappNumber) {
                submitLabel.innerText = "Update WhatsApp Link";
                window.setTimeout(() => {
                    submitLabel.innerText = originalText;
                }, 2500);
                return;
            }

            const enquiryMessage = [
                "Hello K Photo Studio, I would like to book a consultation.",
                "",
                `Name: ${name}`,
                `Email: ${email}`,
                `Tentative Date: ${date}`,
                `Story: ${story}`
            ].join("\n");

            submitLabel.innerText = "Opening WhatsApp...";
            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(enquiryMessage)}`, "_blank", "noopener");
            form.reset();

            window.setTimeout(() => {
                submitLabel.innerText = "WhatsApp Opened";
                window.setTimeout(() => {
                    submitLabel.innerText = originalText;
                }, 2500);
            }, 400);
        });
    }

    const audioButton = document.getElementById("audio-toggle");
    const backgroundAudio = document.getElementById("bg-audio");
    if (audioButton && backgroundAudio) {
        audioButton.addEventListener("click", () => {
            if (backgroundAudio.paused) {
                backgroundAudio.play();
                audioButton.classList.remove("muted");
            } else {
                backgroundAudio.pause();
                audioButton.classList.add("muted");
            }
        });

        audioButton.classList.add("muted");
    }

    const nativeSlider = document.getElementById("native-slider");
    const sliderHandle = document.getElementById("slider-handle");
    const layerGraded = document.getElementById("layer-graded");

    if (nativeSlider && sliderHandle && layerGraded) {
        nativeSlider.addEventListener("input", (event) => {
            const value = event.target.value;

            if (supportsClipPath) {
                layerGraded.style.clipPath = `polygon(0 0, ${value}% 0, ${value}% 100%, 0 100%)`;
            } else {
                layerGraded.style.width = `${value}%`;
            }

            sliderHandle.style.left = `${value}%`;
        });
    }

    const faqButtons = document.querySelectorAll(".faq-btn");
    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.parentElement;
            const content = button.nextElementSibling;
            const isActive = item?.classList.contains("active");

            document.querySelectorAll(".faq-item").forEach((faqItem) => {
                faqItem.classList.remove("active");
                faqItem.querySelector(".faq-content").style.maxHeight = null;
            });

            if (!isActive && item && content) {
                item.classList.add("active");
                content.style.maxHeight = `${content.scrollHeight}px`;
            }

            if (hasGsap) {
                window.setTimeout(() => ScrollTrigger.refresh(), 300);
            }
        });
    });

    const scrollTopButton = document.getElementById("scroll-top");
    if (scrollTopButton) {
        scrollTopButton.addEventListener("click", () => {
            if (lenis) {
                lenis.scrollTo(0, {
                    duration: 1.2,
                    easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time))
                });
            } else {
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    }
});
