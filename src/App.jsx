import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from '@studio-freight/lenis';
import { Mail, MapPin, MessageCircle, Phone, Sun } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const container = useRef(null);
  const cursorDot = useRef(null);
  const cursorRing = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useGSAP(() => {
    gsap.to('.preloader', {
      opacity: 0,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.style.display = 'none';
        initScrollAnimations();
      },
    });

    const initScrollAnimations = () => {
      const timeline = gsap.timeline();

      timeline
        .fromTo('.hero-title', { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: 'power4.out' })
        .fromTo('.hero-desc', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.8')
        .fromTo('.btn-whatsapp', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.6')
        .fromTo('.navbar', { y: -100 }, { y: 0, duration: 1, ease: 'power3.out' }, '-=1');

      gsap.to('.spline-wrapper', {
        scrollTrigger: { trigger: '.hero-section', start: 'top top', end: 'bottom top', scrub: true },
        y: 200,
        opacity: 0.2,
      });

      gsap.utils.toArray('.section').forEach((section) => {
        const heading = section.querySelector('.section-head');
        const tag = section.querySelector('.section-tag');

        if (heading) {
          gsap.fromTo(
            heading,
            { y: 50, opacity: 0 },
            {
              scrollTrigger: { trigger: section, start: 'top 80%', toggleActions: 'play none none reverse' },
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
            }
          );
        }

        if (tag) {
          gsap.fromTo(
            tag,
            { x: -30, opacity: 0 },
            {
              scrollTrigger: { trigger: section, start: 'top 80%' },
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: 'power2.out',
            }
          );
        }
      });

      gsap.fromTo(
        '.service-orb',
        { y: 100, opacity: 0, rotationX: -15 },
        {
          scrollTrigger: { trigger: '.services-orbs-container', start: 'top 85%' },
          y: 0,
          opacity: 1,
          rotationX: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'back.out(1.2)',
        }
      );

      gsap.fromTo(
        '.test-bubble',
        { y: 100, opacity: 0 },
        {
          scrollTrigger: { trigger: '.test-bubbles-container', start: 'top 85%' },
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.3,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.p-card',
        { y: 80, opacity: 0 },
        {
          scrollTrigger: { trigger: '.pricing-cards', start: 'top 80%' },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );

      gsap.fromTo(
        '.contact-card, .contact-form-wrapper',
        { y: 80, opacity: 0 },
        {
          scrollTrigger: { trigger: '.contact-grid', start: 'top 80%' },
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    };
  }, { scope: container });

  useGSAP(() => {
    gsap.fromTo(
      '.g-item',
      { y: 80, opacity: 0, scale: 0.9 },
      {
        scrollTrigger: { trigger: '.gallery-grid', start: 'top 80%' },
        y: (index, target) => (window.innerWidth > 768 && target.matches(':nth-child(2n)') ? 60 : 0),
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      }
    );
  }, { scope: container, dependencies: [activeFilter] });

  useGSAP(() => {
    const magneticButtons = gsap.utils.toArray('.magnetic-btn');

    magneticButtons.forEach((button) => {
      button.addEventListener('mousemove', (event) => {
        const rect = button.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        gsap.to(button, { x: x * 0.3, y: y * 0.3, duration: 0.5, ease: 'power2.out' });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
      });
    });

    const hoverElements = document.querySelectorAll('a, button, .magnetic-btn, .service-orb, .g-item, .contact-card');
    hoverElements.forEach((element) => {
      element.addEventListener('mouseenter', () => {
        if (cursorRing.current) {
          gsap.to(cursorRing.current, { width: 60, height: 60, backgroundColor: 'rgba(212, 175, 55, 0.1)', duration: 0.3 });
        }
      });

      element.addEventListener('mouseleave', () => {
        if (cursorRing.current) {
          gsap.to(cursorRing.current, { width: 40, height: 40, backgroundColor: 'transparent', duration: 0.3 });
        }
      });
    });
  }, { scope: container });

  useEffect(() => {
    const handleScroll = () => {
      const nav = document.getElementById('navbar');
      if (!nav) return;

      if (window.scrollY > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };

    window.addEventListener('scroll', handleScroll);

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    const handleMouseMove = (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;

      if (cursorDot.current && cursorRing.current) {
        cursorDot.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        cursorRing.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }

      animationFrameId = requestAnimationFrame(renderCursor);
    };

    renderCursor();

    if (cursorDot.current) {
      cursorDot.current.style.left = '0';
      cursorDot.current.style.top = '0';
    }

    if (cursorRing.current) {
      cursorRing.current.style.left = '0';
      cursorRing.current.style.top = '0';
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      lenis.destroy();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const galleryItems = [
    { cat: 'weddings', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800', text: 'Mandap Details' },
    { cat: 'candid', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800', text: 'Reception Smiles' },
    { cat: 'weddings', img: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&q=80&w=800', text: 'Holy Rituals' },
    { cat: 'weddings', img: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800', text: 'Venue Setup' },
    { cat: 'candid', img: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=800', text: 'Bridal Glow' },
  ];

  const contactCards = [
    {
      title: 'Electronic Mail',
      value: 'booking@kphotostudio.in',
      note: 'For proposals, bookings, and package requests.',
      icon: Mail,
      className: 'card-mail',
    },
    {
      title: 'Direct Line',
      value: '+91 98765 43210',
      note: 'Quickest way to confirm dates and availability.',
      icon: Phone,
      className: 'card-phone',
    },
    {
      title: 'Studio Base',
      value: 'Boat Club Road, Chennai',
      note: 'Private consultations by prior appointment only.',
      icon: MapPin,
      className: 'card-studio',
    },
  ];

  return (
    <div ref={container}>
      <div className="cursor-dot" ref={cursorDot}></div>
      <div className="cursor-ring" ref={cursorRing}></div>

      <div
        className="preloader"
        style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <h2 style={{ color: '#D4AF37', fontFamily: '"Playfair Display", serif', fontStyle: 'italic', fontSize: '3rem' }}>K.</h2>
      </div>

      <nav className="navbar" id="navbar">
        <a href="#" className="logo">K<span className="dot">.</span></a>
        <ul className="nav-links">
          <li><a href="#about" className="nav-link">About</a></li>
          <li><a href="#services" className="nav-link">Services</a></li>
          <li><a href="#gallery" className="nav-link">Gallery</a></li>
          <li><a href="#pricing" className="nav-link">Pricing</a></li>
        </ul>
        <div className="nav-actions">
          <button className="icon-btn theme-toggle" aria-label="Toggle Theme"><Sun size={20} /></button>
          <a href="#contact" className="btn-primary magnetic-btn"><span>Book Free Consultation</span></a>
        </div>
      </nav>

      <main>
        <section id="hero" className="hero-section">
          <div className="spline-wrapper">
            <div className="spline-fallback"></div>
            <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" loading-anim></spline-viewer>
            <div className="hero-vignette"></div>
          </div>

          <div className="hero-content">
            <div className="title-overflow"><h1 className="hero-title">Eternal Moments</h1></div>
            <div className="title-overflow"><h1 className="hero-title italic">Captured</h1></div>
            <p className="hero-desc">Cinematic Wedding Photography & Visual Storytelling in Chennai</p>
            <a href="https://wa.me/910000000000" className="btn-whatsapp gold-glow magnetic-btn" target="_blank" rel="noreferrer">
              <MessageCircle size={20} />
              <span>Connect on WhatsApp</span>
            </a>
          </div>

          <div className="scroll-down">
            <div className="mouse"></div>
            <p>Scroll to explore</p>
          </div>
        </section>

        <section id="about" className="section about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-content">
                <span className="section-tag gold">Studio Journey</span>
                <h2 className="section-head">A Legacy of<br /><span>Light & Shadow</span></h2>
                <p className="section-text">
                  Welcome to K Photo Studio. For over a decade, we have been weaving the raw, candid emotions of
                  Chennai&apos;s most luxurious weddings into timeless art. Our approach transcends photography - it is an
                  immersive, cinematic experience.
                </p>

                <div className="timeline" id="timeline">
                  <div className="timeline-item"><h3>2015</h3><p>Studio Founded</p></div>
                  <div className="timeline-item"><h3>2020</h3><p>Awwwards Honoree</p></div>
                  <div className="timeline-item"><h3>2026</h3><p>500+ Luxury Sets</p></div>
                </div>
              </div>

              <div className="about-visuals 3d-container">
                <div className="carousel-3d" id="about-carousel">
                  <div className="carousel-ring">
                    {[
                      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
                      'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&q=80&w=800',
                      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&q=80&w=800',
                      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&q=80&w=800',
                    ].map((image, index) => (
                      <div key={index} className="c-item" style={{ '--i': index + 1 }}>
                        <div className="img-wrap"><img src={image} alt="Gallery" /></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="services" className="section services-section">
          <div className="container">
            <div className="center-content">
              <span className="section-tag gold">Expertise</span>
              <h2 className="section-head">Our <span>Mastercraft</span></h2>
              <p className="section-text text-center">We offer an array of specialized photography services, each treated as a high-end cinematic production.</p>
            </div>

            <div className="services-orbs-container" id="services-orbs">
              {[
                { num: '01', title: 'Luxury Weddings', img: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&q=80&w=600' },
                { num: '02', title: 'Candid Shoots', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600' },
                { num: '03', title: 'Portraits', img: 'https://images.unsplash.com/photo-1623091410901-00e2d268901f?auto=format&fit=crop&q=80&w=600' },
                { num: '04', title: 'Baby Shoots', img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600' },
              ].map((service, index) => (
                <div key={index} className="service-orb s_orb">
                  <div className="orb-content">
                    <h3>{service.num}</h3>
                    <h4>{service.title}</h4>
                  </div>
                  <div className="orb-bg" style={{ backgroundImage: `url(${service.img})` }}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section gallery-section">
          <div className="container">
            <div className="gallery-header flex-between">
              <h2 className="section-head">Curated <span>Folio</span></h2>
              <div className="gallery-filters">
                {['all', 'weddings', 'candid'].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
                    onClick={() => {
                      setActiveFilter(filter);
                      setTimeout(() => ScrollTrigger.refresh(), 300);
                    }}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="gallery-grid">
              {galleryItems
                .filter((item) => activeFilter === 'all' || item.cat === activeFilter)
                .map((item, index) => (
                  <div key={index} className="g-item" data-cat={item.cat}>
                    <div className="g-inner">
                      <img src={item.img} alt={item.text} />
                      <div className="g-overlay"><span>{item.text}</span></div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="center-content m-t">
              <button className="btn-outline">View Complete Archive</button>
            </div>
          </div>
        </section>

        <section id="testimonials" className="section testimonial-section">
          <div className="test-fog-base"></div>
          <div className="container">
            <span className="section-tag gold">Words of Love</span>
            <h2 className="section-head text-center">Client <span>Echoes</span></h2>

            <div className="test-bubbles-container">
              {[
                { quote: `"K Photo Studio didn't just take pictures; they immortalized our bond. The cinematic video still gives me goosebumps."`, client: 'Anjali & Vikram' },
                { quote: `"Every detail, from the grand decor to a fleeting smile, was captured with pristine clarity. Absolute perfection."`, client: 'Sneha R.' },
                { quote: `"The 3D gallery they provided us post-wedding blew our minds. They are true visionaries of modern photography."`, client: 'Rahul & Priya' },
              ].map((testimonial, index) => (
                <div key={index} className="test-bubble">
                  <p className="quote">{testimonial.quote}</p>
                  <h4 className="client-name">- {testimonial.client}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="section pricing-section">
          <div className="container">
            <h2 className="section-head text-center">Curated <span>Experiences</span></h2>

            <div className="pricing-cards">
              <div className="p-card">
                <div className="p-bg"></div>
                <span className="p-badge">Silver Tier</span>
                <h3>Intimate</h3>
                <p className="p-price">Rs. 1.5L <span>/ event</span></p>
                <ul className="p-features">
                  <li>2 Master Photographers</li>
                  <li>1 Cinematographer</li>
                  <li>Candid & Traditional Covers</li>
                  <li>Premium Wedding Album</li>
                </ul>
                <button className="btn-primary w-100 p-btn">Select Tier</button>
              </div>

              <div className="p-card featured">
                <div className="p-bg gold-glow-bg"></div>
                <span className="p-badge gold">Gold / Most Loved</span>
                <h3>Cinematic</h3>
                <p className="p-price">Rs. 3.0L <span>/ event</span></p>
                <ul className="p-features">
                  <li>4 Master Photographers</li>
                  <li>2 Drone Operators</li>
                  <li>Next-Day Teaser Reel</li>
                  <li>3D Digital Gallery</li>
                  <li>2 Premium Leather Albums</li>
                </ul>
                <button className="btn-primary w-100 p-btn">Select Tier</button>
              </div>

              <div className="p-card">
                <div className="p-bg"></div>
                <span className="p-badge">Platinum Tier</span>
                <h3>Immersive</h3>
                <p className="p-price">Rs. 5.0L <span>/ event</span></p>
                <ul className="p-features">
                  <li>Unlimited Coverage Team</li>
                  <li>Spatial 3D Video Coverage</li>
                  <li>Pre-wedding Shoot Included</li>
                  <li>Live Editing & Screenings</li>
                  <li>VIP Album Bundle</li>
                </ul>
                <button className="btn-primary w-100 p-btn">Select Tier</button>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container">
            <div className="contact-grid">
              <div className="contact-copy">
                <span className="section-tag gold">Consultation Desk</span>
                <h2 className="section-head">Make Your <span>First Move</span></h2>
                <p className="section-text contact-text">
                  The contact area has been reworked for stronger readability, clearer labels, and better separation
                  from the black background. The cards now sit on richer surfaces so the text is visible immediately.
                </p>

                <div className="contact-cards">
                  {contactCards.map((card) => {
                    const Icon = card.icon;

                    return (
                      <article key={card.title} className={`contact-card ${card.className}`}>
                        <div className="contact-card-icon">
                          <Icon size={18} />
                        </div>
                        <p className="contact-card-label">{card.title}</p>
                        <h3 className="contact-card-value">{card.value}</h3>
                        <p className="contact-card-note">{card.note}</p>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="contact-form-wrapper">
                <div className="contact-form-header">
                  <span className="contact-form-tag">Booking Form</span>
                  <h3>Reserve the Date</h3>
                  <p>Every field now has cleaner contrast, calmer spacing, and placeholder text that reads clearly on dark backgrounds.</p>
                </div>

                <form className="c-form">
                  <div className="input-group">
                    <label htmlFor="name">Your Name</label>
                    <input type="text" id="name" placeholder="E.g., Ananya & Rahul" />
                    <span className="input-line"></span>
                  </div>

                  <div className="input-group">
                    <label htmlFor="email">Email Address</label>
                    <input type="email" id="email" placeholder="hello@example.com" />
                    <span className="input-line"></span>
                  </div>

                  <div className="input-group">
                    <label htmlFor="date">Tentative Date</label>
                    <input type="text" id="date" inputMode="numeric" placeholder="DD-MM-YYYY" />
                    <span className="input-line"></span>
                  </div>

                  <div className="input-group">
                    <label htmlFor="message">Your Story</label>
                    <textarea id="message" rows="4" placeholder="Tell us about your wedding vision..."></textarea>
                    <span className="input-line"></span>
                  </div>

                  <button type="submit" className="btn-primary magnetic-btn submit-btn">
                    <span>Reserve the Date</span>
                  </button>

                  <p className="razorpay-notice">Secure payment via Razorpay will be initiated upon confirmation.</p>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="container">
            <div className="footer-top">
              <div className="footer-brand">
                <div className="f-logo">K.</div>
                <p className="footer-copy">Luxury wedding photography and cinematic storytelling from Chennai.</p>
              </div>

              <div className="f-links">
                <a href="#">Instagram</a>
                <a href="#">Behance</a>
                <a href="#">Facebook</a>
              </div>
            </div>

            <div className="footer-bottom">
              <p>&copy; 2026 K Photo Studio. All Rights Reserved.</p>
              <div className="f-legal">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <button className="scroll-top" id="scroll-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Back to top
                </button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
