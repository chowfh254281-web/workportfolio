'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function VideoPage() {
  // Refs to store players and observer
  const playersRef = useRef<any[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Video Data
  const videos = [
    { id: 'DOp19wtL28w', title: 'Cinematic Travel Vlog', year: '2025 TOKYO' },
    { id: 'Dc3phLpndD0', title: 'Japanese Culture Festival', year: '2025' },
    { id: 'rJBpYguoROg', title: 'GoldenFish Bowl', year: '2024' },
    { id: 'cKj_WzwWvfQ', title: 'East Coast Boardwalk', year: '2025' }
  ];

  useEffect(() => {
    let lenis: any;

    // 1. Initialize Lenis Smooth Scroll
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

    // 2. YouTube API & Player Logic
    const initPlayers = () => {
        // @ts-ignore
        if (!window.YT || !window.YT.Player) return;

        videos.forEach((vid, index) => {
            // Prevent duplicate initialization
            if (playersRef.current[index]) return;

            // @ts-ignore
            playersRef.current[index] = new window.YT.Player(`player-${index}`, {
                videoId: vid.id,
                playerVars: {
                    'autoplay': 0,
                    'controls': 0,
                    'rel': 0,
                    'showinfo': 0,
                    'modestbranding': 1,
                    'loop': 1,
                    'playlist': vid.id,
                    'mute': 1, // Essential for autoplay
                    'playsinline': 1,
                },
                events: {
                    'onReady': (event: any) => {
                        event.target.mute(); // Force mute
                        setupObserver(); // Setup observer only when players are ready
                    }
                }
            });
        });
    };

    // 3. Load YouTube Script dynamically
    if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        
        // Define global callback
        (window as any).onYouTubeIframeAPIReady = () => initPlayers();
    } else {
        // If API already exists (navigated back from another page), init immediately
        initPlayers();
    }

    // 4. Intersection Observer Logic
    const setupObserver = () => {
        if (observerRef.current) return; // Already setup

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.25
        };

        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const elementId = entry.target.id; 
                const index = parseInt(elementId.split('-')[1]);
                const player = playersRef.current[index];

                if (player && typeof player.playVideo === 'function') {
                    if (entry.isIntersecting) {
                        player.playVideo();
                    } else {
                        player.pauseVideo();
                    }
                }
            });
        }, observerOptions);

        // Observe all video blocks
        document.querySelectorAll('.video-block').forEach(block => {
            observerRef.current?.observe(block);
        });
    };

    // Navbar Logic
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    const toggleMenu = () => {
        if (window.innerWidth > 768) {
            navbar?.classList.toggle('force-expand');
        } else {
            mobileMenu?.classList.toggle('active');
            menuBtn?.classList.toggle('open');
        }
    };

    const handleScroll = () => {
        if (window.scrollY > 50) navbar?.classList.add('collapsed');
        else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
        }
    };

    menuBtn?.addEventListener('click', toggleMenu);
    window.addEventListener('scroll', handleScroll);

    return () => {
        if (lenis) lenis.destroy();
        if (observerRef.current) observerRef.current.disconnect();
        menuBtn?.removeEventListener('click', toggleMenu);
        window.removeEventListener('scroll', handleScroll);
        // Note: We don't destroy players on unmount strictly to keep transitions smooth, 
        // but normally you might use player.destroy() here.
    };
  }, []);

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        /* PERFORMANCE & RESET */
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); min-height: 100vh; overflow-x: hidden; }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }
        
        /* NAVBAR */
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); height: 60px; padding: 0 30px; display: flex; justify-content: space-between; align-items: center; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: 30px; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; opacity: 1; max-width: 900px; }
        .nav-item { text-decoration: none; color: #ccc; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; margin-left: 40px; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: width 0.3s ease; }
        .smart-nav.collapsed { min-width: 150px; background: rgba(255, 255, 255, 0.05); padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; gap: 0; pointer-events: none; } 
        .smart-nav.collapsed .nav-logo { margin-right: 10px; } 
        .smart-nav.collapsed .menu-icon { margin-left: 0; }
        .smart-nav:hover, .smart-nav.force-expand { min-width: 500px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
        .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; gap: 25px !important; pointer-events: auto !important; display: flex !important; } 
        .mobile-menu-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 1500; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 30px; opacity: 0; pointer-events: none; transition: opacity 0.4s ease; } .mobile-menu-overlay.active { opacity: 1; pointer-events: auto; }
        .mobile-link { font-size: 30px; font-weight: 700; color: #888; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; transform: translateY(20px); opacity: 0; transition: all 0.4s ease; } .mobile-link:hover { color: #fff; } .mobile-menu-overlay.active .mobile-link { transform: translateY(0); opacity: 1; }
        @media (max-width: 768px) { .nav-links { display: none !important; } .smart-nav { min-width: 0 !important; width: 90% !important; max-width: 350px; top: 20px; padding: 0 20px !important; } }
        
        /* HEADER */
        .header-section { padding: 220px 40px 100px 40px; text-align: center; position: relative; z-index: 10; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.2s; color: #fff; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; opacity: 0; animation: fadeInUp 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards; animation-delay: 0.4s; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        
        /* YOUTUBE FEED */
        .video-feed { width: 100%; display: flex; flex-direction: column; gap: 0; padding-bottom: 100px; }
        .video-block { width: 100%; height: 90vh; position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); background: #000; }
        .video-wrapper { width: 100%; height: 100%; position: relative; pointer-events: auto; }
        /* iframe handling via CSS */
        .video-wrapper iframe { position: absolute; top: 50%; left: 50%; width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; transform: translate(-50%, -50%); opacity: 1; transition: opacity 0.5s ease; pointer-events: none; }
        
        .video-info-overlay { position: absolute; bottom: 80px; left: 60px; z-index: 20; pointer-events: auto; max-width: 600px; }
        .video-title { font-size: 3vw; font-weight: 800; line-height: 1.1; margin-bottom: 10px; text-shadow: 0 4px 20px rgba(0,0,0,0.8); }
        .video-meta { font-size: 14px; color: #aaa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }
        .yt-btn { display: inline-flex; align-items: center; gap: 10px; padding: 12px 24px; background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 30px; color: #fff; text-decoration: none; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s ease; }
        .yt-btn:hover { background: #fff; color: #000; padding-right: 30px; }
        @media (max-width: 768px) { .video-title { font-size: 40px; } .video-info-overlay { bottom: 60px; left: 20px; right: 20px; } .video-block { height: 70vh; } }

        /* CONTACT WIDGET */
        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; }
        .contact-widget:hover, .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget:hover .contact-details, .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }
      `}</style>

      <div className="noise-overlay"></div>

      <nav className="smart-nav" id="navbar">
        <Link href="/" className="nav-logo">SAM CHOW.</Link>
        <div className="nav-links">
          <Link href="/uiux" className="nav-item">UI/UX</Link>
          <Link href="/graphic" className="nav-item">Graphic</Link>
          <Link href="/3d" className="nav-item">3D</Link>
          <Link href="/photography" className="nav-item">Photography</Link>
          <Link href="/video" className="nav-item active">Video</Link>
          <Link href="/ai" className="nav-item">AI Generative</Link>
        </div>
        <div className="menu-icon" id="menu-btn">
          <div className="menu-line"></div>
          <div className="menu-line"></div>
          <div className="menu-line"></div>
        </div>
      </nav>

      <div className="mobile-menu-overlay" id="mobile-menu">
        <Link href="/uiux" className="mobile-link">UI/UX</Link>
        <Link href="/graphic" className="mobile-link">Graphic</Link>
        <Link href="/3d" className="mobile-link">3D</Link>
        <Link href="/photography" className="mobile-link">Photography</Link>
        <Link href="/video" className="mobile-link">Video</Link>
        <Link href="/ai" className="mobile-link">AI Generative</Link>
      </div>

      <div className="header-section">
        <h1 className="page-title">Video</h1>
        <div className="page-desc">Motion, pacing, and storytelling through the timeline.</div>
      </div>

      <div className="video-feed" id="video-feed">
        {videos.map((vid, index) => (
            <div key={index} className="video-block" id={`block-${index}`}>
                <div className="video-wrapper">
                    <div id={`player-${index}`}></div>
                </div>
                <div className="video-info-overlay">
                    <div className="video-title">{vid.title}</div>
                    <div className="video-meta">{vid.year}</div>
                    <a href={`https://www.youtube.com/watch?v=${vid.id}`} target="_blank" className="yt-btn">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                        Watch on YouTube
                    </a>
                </div>
            </div>
        ))}
      </div>

      <div className="contact-widget" id="contact-bubble">
        <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
        <div className="contact-details">
            <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}><span className="label">WA</span>+852 6701 2420</a>
            <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
        </div>
      </div>
    </>
  );
}