'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

const items = [
  { type: 'image', src: '/images/AI_optimized/victoriahabour_1.png', year: 'Victoria Harbour' },
  { type: 'video', src: '/images/AI_optimized/chanel ring.mp4', year: 'Chanel Ring' },
  { type: 'video', src: '/images/AI_optimized/iPhone .mp4', year: 'iPhone 17 Pro Max', responsive: true },
  { type: 'video', src: '/images/AI_optimized/pickleball.mp4', year: 'Pickleball', responsive: true },
  { 
    type: 'pickleball_images', 
    images: [
      '/images/AI_optimized/pickleball_character.jpg', 
      '/images/AI_optimized/pickleball_home.png', 
      '/images/AI_optimized/pickleball_scene.png'
    ] 
  },
  { type: 'video', src: '/images/AI_optimized/gundam.mp4', year: 'AI GENERATED' },
  { type: 'image', src: "/images/AI_optimized/cocacola.png", year: 'Coca Cola' },
  { type: 'casio' }, 
  { type: 'video', src: "/images/AI_optimized/ai_1.mp4", year: 'AI GENERATED' },
  { type: 'video', src: "/images/muji.mov", year: 'AI GENERATED' },
  { type: 'image', src: "/images/AI_optimized/ai_img2.png", year: 'AI GENERATED' },
  { type: 'video_with_text', src: '/images/AI_optimized/girlreading.mp4', }
];

export default function AiPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(false);
  const [currentPickleballImageIndex, setCurrentPickleballImageIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    let lenis: any;

    import('@studio-freight/lenis').then((Lenis) => {
      lenis = new Lenis.default({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target as HTMLVideoElement;
            const container = video.closest('.video-block') || video.closest('.mixed-block');
            
            if (entry.isIntersecting) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => { });
                }
                if (container) container.classList.add('in-view');
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.auto-play-video').forEach(vid => videoObserver.observe(vid));

    const casioObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.casio-card').forEach(card => casioObserver.observe(card));

    const navbar = document.getElementById('navbar');
    const scrollPrompt = document.getElementById('scroll-prompt');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            if (navbar && !navbar.classList.contains('mobile-active')) {
                navbar.classList.add('collapsed');
            }
            scrollPrompt?.classList.add('hide');
        } else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
            scrollPrompt?.classList.remove('hide');
        }

        const isAtBottom = (window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 50);
        setIsContactExpanded(isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
        clearTimeout(timer);
        if (lenis) lenis.destroy();
        videoObserver.disconnect();
        casioObserver.disconnect();
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const sliderItems = items.filter(item => item.type === 'pickleball_images');
    if (sliderItems.length === 0 || sliderItems[0].type !== 'pickleball_images') return;

    const totalImages = (sliderItems[0] as any).images.length;
    let intervalId: any;

    const startSlider = () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(() => {
            setCurrentPickleballImageIndex((prevIndex) => (prevIndex + 1) % totalImages);
        }, 3000); 
    };

    const stopSlider = () => {
        if (intervalId) clearInterval(intervalId);
    };

    const sliderObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startSlider();
            } else {
                stopSlider();
            }
        });
    }, { threshold: 0.15 });

    const sliderElement = document.querySelector('.pickleball-slider');
    if (sliderElement) {
        sliderObserver.observe(sliderElement);
    }

    return () => {
        stopSlider();
        if (sliderElement) {
            sliderObserver.unobserve(sliderElement);
        }
        sliderObserver.disconnect();
    };
  }, []); 

  const toggleMenu = (e: React.MouseEvent) => {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const target = e.target as HTMLElement;
    if (!navbar || !menuBtn) return;

    if (window.innerWidth <= 768) {
        const isActive = navbar.classList.contains('mobile-active');
        const isLogo = target.closest('.nav-logo');
        if (isLogo && !isActive) return;

        if (isActive) {
            navbar.classList.remove('mobile-active');
            menuBtn.classList.remove('open');
            document.body.style.overflow = ''; 
        } else {
            navbar.classList.remove('collapsed'); 
            navbar.classList.add('mobile-active');
            menuBtn.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        }
    } else {
        navbar.classList.toggle('force-expand');
    }
  };

  const toggleContact = () => {
    setIsContactExpanded(!isContactExpanded);
  };

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; transition: opacity 0.8s ease-in-out; pointer-events: none; }
        .preloader.hidden { opacity: 0; }

        /* NAVBAR */
        .smart-nav { 
            position: fixed; top: 30px; left: 50%; transform: translateX(-50%); 
            padding: 0 30px; display: flex; align-items: center; justify-content: space-between;
            z-index: 2000; background: rgba(255, 255, 255, 0.05); 
            backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); 
            border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); 
            width: auto; min-width: 450px; height: 60px;
            transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); 
            overflow: hidden; cursor: pointer;
        }
        .nav-header { display: contents; }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: auto; cursor: pointer; order: 1; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; order: 2; margin: 0 40px; }
        .nav-item { text-decoration: none; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; pointer-events: none; z-index: 2005; order: 3; margin-left: 0; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: all 0.3s ease; transform-origin: center; }
        .menu-icon.open .menu-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .menu-icon.open .menu-line:nth-child(2) { opacity: 0; }
        .menu-icon.open .menu-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }

        @media (min-width: 769px) {
            .smart-nav:hover, .smart-nav.force-expand { min-width: 650px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
            .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; gap: 25px !important; pointer-events: auto !important; display: flex !important; } 
        }
        .smart-nav.collapsed { min-width: 150px; background: rgba(255, 255, 255, 0.05); padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; gap: 0; pointer-events: none; } 
        .smart-nav.collapsed .nav-logo { margin-right: 10px; } 
        .smart-nav.collapsed .menu-icon { margin-left: 0; }

        .video-hero { position: relative; width: 100%; height: 100vh; height: 100svh; overflow: hidden; }
        .video-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.15); z-index: 1; pointer-events: none; }
        .hero-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; text-align: center; width: 100%; pointer-events: none; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.8); opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #ddd; max-width: 600px; display: inline-block; text-shadow: 0 2px 10px rgba(0,0,0,0.8); opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.4s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }

        .scroll-prompt { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 10; opacity: 0.7; transition: opacity 0.3s ease; pointer-events: none;}
        .scroll-prompt.hide { opacity: 0; }
        .scroll-text { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #fff; text-transform: uppercase; }
        .scroll-line { width: 1px; height: 40px; background: rgba(255,255,255,0.2); position: relative; overflow: hidden; }
        .scroll-line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; transform: translateY(-100%); animation: scrollFlow 2s cubic-bezier(0.77, 0, 0.175, 1) infinite; }
        @keyframes scrollFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        
        .video-feed { width: 100%; display: flex; flex-direction: column; gap: 0; padding-bottom: 100px; }
        
        /* 🟢 將 background 換成截圖裡的米白色 #E4E3DE */
        .casio-showcase-container { width: 100%; border-bottom: 1px solid rgba(255,255,255,0.05); background: #E4E3DE; }
        .casio-showcase { display: flex; justify-content: center; align-items: center; gap: 20px; padding: 100px 40px; width: 100%; max-width: 1200px; margin: 0 auto; }
        .casio-card { width: 25vw; max-width: 300px; aspect-ratio: 9/16; border-radius: 12px; overflow: hidden; position: relative; box-shadow: 0 20px 50px rgba(0,0,0,0.5); opacity: 0; transform: translateY(60px); transition: opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1), transform 1.8s cubic-bezier(0.22, 1, 0.36, 1); }
        .casio-card.visible { opacity: 1; transform: translateY(0); }
        .casio-media { width: 100%; height: 100%; object-fit: cover; }

        .video-block { width: 100%; height: 90vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); background: #000; }
        .cover-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0.8; transition: opacity 0.5s ease; }
        
        .video-block.responsive-block { height: auto; min-height: 50vh; display: block; overflow: hidden; }
        .cover-video.responsive-media { position: relative; height: auto; width: 100%; object-fit: contain; display: block; transform: scale(1.2); transform-origin: center center; }

        .video-info-overlay { position: absolute; bottom: 80px; left: 60px; z-index: 20; pointer-events: auto; max-width: 600px; }
        .video-meta { font-size: 18px; color: #fff; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }

        .cinematic-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.3); z-index: 10; pointer-events: none; }
        .cinematic-text { font-size: 3.5vw; font-weight: 700; color: #fff; text-align: center; opacity: 0; transform: translateY(30px); transition: opacity 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s, transform 1.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s; text-transform: uppercase; letter-spacing: 4px; text-shadow: 0 4px 30px rgba(0,0,0,0.9); padding: 0 20px; max-width: 80%; line-height: 1.2; }
        .video-block.in-view .cinematic-text { opacity: 1; transform: translateY(0); }
        
        .pickleball-slider { height: 90vh; }
        .slider-wrapper { position: relative; width: 100%; height: 100%; overflow: hidden; }
        .slider-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; opacity: 0; transition: opacity 1s ease-in-out; }
        .slider-image.active { opacity: 1; }

        @media (max-width: 768px) {
            .smart-nav { flex-direction: column !important; align-items: flex-start !important; width: 90% !important; max-width: 350px !important; height: 60px; overflow: hidden; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); min-width: 0 !important; }
            .smart-nav.mobile-active { position: fixed !important; top: 0 !important; left: 0 !important; transform: none !important; width: 100vw !important; max-width: none !important; height: 100vh !important; border-radius: 0 !important; background: #000 !important; border: none !important; padding: 30px !important; justify-content: flex-start !important; align-items: center !important; z-index: 9000 !important; }
            .nav-header { display: flex !important; width: 100%; justify-content: space-between; align-items: center; height: 60px; flex-shrink: 0; }
            .nav-logo { order: unset; margin-right: 0; }
            .menu-icon { order: unset; }
            .nav-links { display: flex !important; flex-direction: column !important; width: 100% !important; opacity: 0; transform: translateY(20px); transition: all 0.4s ease 0.1s; pointer-events: none; margin-top: 0; height: 100%; justify-content: center; align-items: center; gap: 40px !important; order: unset; margin: 0; }
            .smart-nav.mobile-active .nav-links { opacity: 1 !important; transform: translateY(0) !important; pointer-events: auto !important; visibility: visible !important; }
            .nav-item { font-size: 28px !important; font-weight: 700 !important; letter-spacing: 2px !important; }

            h1.page-title { font-size: 13vw; }
            .page-desc { font-size: 14px; padding: 0 20px; }
            .video-info-overlay { bottom: 60px; left: 20px; right: 20px; } 
            .video-block, .mixed-block { height: 70vh; }
            .video-block.responsive-block { height: auto; min-height: 30vh; }
            .casio-showcase { flex-direction: column; gap: 20px; padding: 50px 20px; }
            .casio-card { width: 80vw; max-width: none; }
            
            .pickleball-slider { height: 70vh; }
            .cinematic-text { font-size: 24px; letter-spacing: 2px; }
        }

        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; cursor: pointer; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }
        .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        @media (min-width: 769px) {
            .contact-widget:hover { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
            .contact-widget:hover .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        }
      `}</style>

      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}></div>
      <div className="noise-overlay"></div>

      <nav className="smart-nav" id="navbar" onClick={toggleMenu}>
        <div className="nav-header">
            <Link href="/" className="nav-logo">SAM CHOW.</Link>
            <div className="menu-icon" id="menu-btn">
                <div className="menu-line"></div>
                <div className="menu-line"></div>
                <div className="menu-line"></div>
            </div>
        </div>
        <div className="nav-links">
          <Link href="/uiux" className="nav-item">UI/UX</Link>
          <Link href="/graphic" className="nav-item">Graphic</Link>
          <Link href="/3d" className="nav-item">3D</Link>
          <Link href="/photography" className="nav-item">Photography</Link>
          <Link href="/video" className="nav-item">Video</Link>
          <Link href="/ai" className="nav-item active">AI Generative</Link>
        </div>
      </nav>

      <div className="video-hero">
        <div className="video-bg">
            <video 
                src="/images/AI_optimized/victoriahabour.mp4" 
                className="cover-video auto-play-video" 
                autoPlay muted loop playsInline 
                style={{ objectFit: 'cover', width: '100%', height: '100%', opacity: 1 }} 
            />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
            <h1 className="page-title">AI Generative</h1>
            <div className="page-desc">Exploring the frontier of machine creativity.</div>
        </div>
        <div className="scroll-prompt" id="scroll-prompt">
            <div className="scroll-text">SCROLL</div>
            <div className="scroll-line"></div>
        </div>
      </div>

      <div className="video-feed" id="video-feed">
        {items.map((item, index) => {
            if (item.type === 'casio') {
                return (
                    <div key={index} className="casio-showcase-container">
                        <div className="casio-showcase">
                            <div className="casio-card"><img src="/images/AI_optimized/casio normal.jpg" alt="Casio Normal" className="casio-media" /></div>
                            <div className="casio-card"><img src="/images/AI_optimized/casio decompose.jpeg" alt="Casio Decompose" className="casio-media" /></div>
                            <div className="casio-card">
                                <video src="/images/AI_optimized/Casio Watch.mp4" className="casio-media auto-play-video" muted loop playsInline/>
                            </div>
                        </div>
                    </div>
                );
            }
            
            if (item.type === 'video') {
                const isResponsive = (item as any).responsive;
                return (
                    <div key={index} className={`video-block ${isResponsive ? 'responsive-block' : ''}`}>
                        <video src={item.src} className={`cover-video auto-play-video ${isResponsive ? 'responsive-media' : ''}`} muted loop playsInline />
                        <div className="video-info-overlay">
                            <div className="video-meta">{item.year}</div>
                        </div>
                    </div>
                );
            }

            if (item.type === 'image') {
                return (
                    <div key={index} className="video-block">
                        <img src={item.src} className="cover-video" alt={item.year || "AI Generated"} />
                        <div className="video-info-overlay">
                            <div className="video-meta">{item.year}</div>
                        </div>
                    </div>
                );
            }
            
            if (item.type === 'pickleball_images') {
                return (
                    <div key={index} className="video-block pickleball-slider">
                        <div className="slider-wrapper">
                            {(item as any).images.map((imgSrc: string, imgIndex: number) => (
                                <img 
                                    key={imgIndex} 
                                    src={imgSrc} 
                                    alt={`Pickleball Image ${imgIndex + 1}`} 
                                    className={`slider-image ${currentPickleballImageIndex === imgIndex ? 'active' : ''}`}
                                />
                            ))}
                        </div>
                    </div>
                );
            }

            if (item.type === 'video_with_text') {
                return (
                    <div key={index} className="video-block">
                        <video src={item.src} className="cover-video auto-play-video" muted loop playsInline />
                        <div className="cinematic-overlay">
                            <h2 className="cinematic-text">{item.text}</h2>
                        </div>
                    </div>
                );
            }
        })}
      </div>

      <div 
        className={`contact-widget ${isContactExpanded ? 'expanded' : ''}`} 
        id="contact-bubble" 
        onClick={toggleContact}
      >
        <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#D4AF37' }}><span className="label">WHATSAPP</span>6701 2420</a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#D4AF37' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
        </div>
      </div>
    </>
  );
}