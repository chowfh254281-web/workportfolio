'use client'; 
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function VideoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  // Refs
  const playersRef = useRef<any[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Video Data (移除了 title 和 year，因為畫面上不再顯示)
  // 🟢 已將 Sheseido (nZvCxgonaKM) 更新並調前至第 3 條片
  const videos = [
    { id: '_yeHdBy8Wzs' },
    { id: 'Dc3phLpndD0' },
    { id: 'nZvCxgonaKM' }, // 第 3 條：Sheseido 
    { id: 'rJBpYguoROg' },
    { id: 'cKj_WzwWvfQ' },
    { id: 'DOp19wtL28w' }  // 最底：日本旅行
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    let lenis: any;

    import('@studio-freight/lenis').then((Lenis) => {
      lenis = new Lenis.default({
        // 🔴 1. 增加 Duration (滑動慣性時間變長，感覺更長氣)
        duration: 2.5, 
        
        // 🔴 2. 增加 Multiplier (減少阻力，輕輕一撥就去好遠)
        wheelMultiplier: 1.2, 
        touchMultiplier: 2.0, 
        
        // 使用更自然的 Easing
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
        
        infinite: false, 
        smoothWheel: true,
      });

      function raf(time: number) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    });

    // YouTube API Init
    const initPlayers = () => {
        // @ts-ignore
        if (!window.YT || !window.YT.Player) return;

        videos.forEach((vid, index) => {
            if (playersRef.current[index]) return;
            // @ts-ignore
            playersRef.current[index] = new window.YT.Player(`player-${index}`, {
                videoId: vid.id,
                playerVars: { 
                    'autoplay': 1, 
                    'controls': 0, 
                    'disablekb': 1, 
                    'fs': 0, 
                    'rel': 0, 
                    'showinfo': 0, 
                    'modestbranding': 1, 
                    'loop': 1, 
                    'playlist': vid.id, 
                    'mute': 1, 
                    'playsinline': 1,
                    'iv_load_policy': 3
                },
                events: {
                    'onReady': (event: any) => { 
                        event.target.mute();
                        setupObserver(); 
                    }
                }
            });
        });
    };

    if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        (window as any).onYouTubeIframeAPIReady = () => initPlayers();
    } else {
        initPlayers();
    }

    const setupObserver = () => {
        if (observerRef.current) return;
        
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const elementId = entry.target.id; 
                if (!elementId) return;
                const index = parseInt(elementId.split('-')[1]);
                if (isNaN(index)) return;
                const player = playersRef.current[index];
                
                if (player && typeof player.playVideo === 'function') {
                    if (entry.isIntersecting) {
                        player.mute(); 
                        player.playVideo(); 
                    } else {
                        player.pauseVideo();
                    }
                }
            });
        }, { root: null, rootMargin: '0px', threshold: 0.5 }); 

        document.querySelectorAll('.video-block').forEach(block => {
            observerRef.current?.observe(block);
        });
    };

    const navbar = document.getElementById('navbar');
    const scrollPrompt = document.getElementById('scroll-prompt');
    const contactBubble = document.getElementById('contact-bubble');

    const handleScroll = () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            if (navbar && !navbar.classList.contains('mobile-active')) navbar.classList.add('collapsed');
            scrollPrompt?.classList.add('hide');
        } else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
            scrollPrompt?.classList.remove('hide');
        }

        if (contactBubble) {
            if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 50) {
                contactBubble.classList.add('expanded');
            } else {
                contactBubble.classList.remove('expanded');
            }
        }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
        clearTimeout(timer);
        if (lenis) lenis.destroy();
        if (observerRef.current) observerRef.current.disconnect();
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = (e: React.MouseEvent) => {
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const target = e.target as HTMLElement;
    if (!navbar || !menuBtn) return;

    if (window.innerWidth <= 768) {
        const isActive = navbar.classList.contains('mobile-active');
        const isLogo = target.closest('.nav-logo');
        if (isLogo && !isActive) return;
        if (isActive) {
            navbar.classList.remove('mobile-active');
            menuBtn.classList.remove('open');
            if(mobileMenu) mobileMenu.classList.remove('active');
            document.body.style.overflow = ''; 
        } else {
            navbar.classList.remove('collapsed'); 
            navbar.classList.add('mobile-active');
            menuBtn.classList.add('open');
            if(mobileMenu) mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; 
        }
    } else {
        navbar.classList.toggle('force-expand');
    }
  };

  const toggleContact = () => setIsContactExpanded(!isContactExpanded);

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        
        /* 🔴 移除強制 Snap，改用純平滑滾動 */
        html { 
            /* scroll-snap-type: y mandatory;  <-- 移除這行，減少強制阻力 */
        }
        
        body { 
            margin: 0; padding: 0; color: #fff; 
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; 
            background-color: #050505; 
            background-image: radial-gradient(circle at 50% 30%, #1a1a1a 0%, #000000 70%); 
            min-height: 100vh; overflow-x: hidden; 
        }
        
        .noise-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 5; mix-blend-mode: overlay; opacity: 0.06; background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E"); }

        /* Preloader */
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.8s ease; pointer-events: none; }
        .preloader.hidden { opacity: 0; }
        .loader { width: 48px; height: 48px; border: 3px solid rgba(244, 208, 63, 0.2); border-radius: 50%; display: inline-block; position: relative; animation: rotation 1s linear infinite; }
        .loader::after { content: ''; box-sizing: border-box; position: absolute; left: 0; top: 0; background: #F4D03F; width: 12px; height: 12px; transform: translate(-50%, 50%); border-radius: 50%; }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .main-content { opacity: 0; transition: opacity 1s ease; }
        .main-content.loaded { opacity: 1; }

        /* Navbar */
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 0 30px; display: flex; align-items: center; justify-content: space-between; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; height: 60px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden; cursor: pointer; }
        .nav-header { display: contents; }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: auto; order: 1; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; max-width: 900px; order: 2; margin: 0 40px; }
        
        .nav-item { text-decoration: none; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; }
        .nav-item:hover, .nav-item.active { color: #F4D03F; }
        
        .menu-icon { width: 24px; height: 24px; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 5px; cursor: pointer; z-index: 2005; order: 3; }
        .menu-line { width: 100%; height: 1px; background-color: #fff; transition: all 0.3s ease; }
        .menu-icon.open .menu-line:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .menu-icon.open .menu-line:nth-child(2) { opacity: 0; }
        .menu-icon.open .menu-line:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        @media (min-width: 769px) {
            .smart-nav:hover, .smart-nav.force-expand { min-width: 650px !important; background: rgba(255, 255, 255, 0.1) !important; padding: 0 30px !important; } 
            .smart-nav:hover .nav-links, .smart-nav.force-expand .nav-links { max-width: 900px !important; opacity: 1 !important; display: flex !important; } 
        }
        .smart-nav.collapsed { min-width: 150px; padding: 0 20px; } 
        .smart-nav.collapsed .nav-links { max-width: 0; opacity: 0; } 

        /* HERO & VIDEO FEED */
        .video-hero { 
            position: relative; width: 100%; height: 100vh; overflow: hidden; 
            /* scroll-snap-align: start; <-- 移除 */
        }
        .video-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0; }
        
        iframe { 
            width: 100vw; height: 56.25vw; min-height: 100vh; min-width: 177.77vh; 
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
            pointer-events: none; 
        }
        
        .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.4); z-index: 1; pointer-events: none; }
        .hero-content { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 2; text-align: center; width: 100%; pointer-events: none; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.8); }
        .page-desc { margin-top: 20px; font-size: 16px; color: #ddd; max-width: 600px; display: inline-block; text-shadow: 0 2px 10px rgba(0,0,0,0.8); }

        .scroll-prompt { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; z-index: 10; opacity: 0.7; transition: opacity 0.3s ease; }
        .scroll-prompt.hide { opacity: 0; }
        .scroll-text { font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #fff; text-transform: uppercase; }
        .scroll-line { width: 1px; height: 40px; background: rgba(255,255,255,0.2); position: relative; overflow: hidden; }
        .scroll-line::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: #fff; transform: translateY(-100%); animation: scrollFlow 2s cubic-bezier(0.77, 0, 0.175, 1) infinite; }
        @keyframes scrollFlow { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

        .video-feed { width: 100%; display: flex; flex-direction: column; gap: 0; background: transparent; position: relative; z-index: 10; }
        
        /* VIDEO BLOCK */
        .video-block { 
            width: 100%; height: 100vh; position: relative;
            display: flex; align-items: center; justify-content: center; 
            overflow: hidden; border-bottom: 1px solid rgba(255,255,255,0.05); 
            background: #000;
        }
        
        .video-wrapper { width: 100%; height: 100%; position: relative; pointer-events: auto; }
        .video-wrapper > div { width: 100%; height: 100%; }
        
        .video-info-overlay { 
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            pointer-events: none; z-index: 20; 
            display: flex; flex-direction: column; 
            justify-content: flex-end; 
            align-items: center;
            padding-bottom: 18%; 
        }
        
        .yt-watch-btn { 
            position: absolute; bottom: 12%; left: 50%; transform: translateX(-50%);
            display: inline-flex; align-items: center; gap: 10px; padding: 12px 30px; 
            background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); 
            border: 1px solid rgba(255, 255, 255, 0.4); border-radius: 30px; 
            color: #fff; text-decoration: none; font-size: 11px; font-weight: 700; 
            text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; 
            pointer-events: auto; z-index: 30;
        }
        .yt-watch-btn:hover { background: #fff; color: #000; border-color: #fff; }

        .contact-widget { position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; cursor: pointer; }
        .contact-icon { width: 38px; height: 38px; background: #fff; color: #000; border-radius: 50%; display: flex; justify-content: center; align-items: center; flex-shrink: 0; }
        .contact-details { opacity: 0; white-space: nowrap; margin-left: 0; display: flex; flex-direction: column; justify-content: center; gap: 4px; pointer-events: none; transition: opacity 0.3s ease 0.1s, margin-left 0.4s ease; }
        .contact-link { color: #ccc; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 1px; display: flex; align-items: center; transition: color 0.3s; }
        .contact-link:hover { color: #fff; }
        .contact-link span.label { font-size: 9px; text-transform: uppercase; color: #666; margin-right: 10px; width: 60px; font-weight: 700; }
        .contact-widget:hover, .contact-widget.expanded { max-width: 380px; padding-right: 25px; background: rgba(255, 255, 255, 0.15); box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .contact-widget:hover .contact-details, .contact-widget.expanded .contact-details { opacity: 1; margin-left: 15px; pointer-events: auto; }

        @media (max-width: 768px) { 
            .smart-nav { flex-direction: column !important; width: 90% !important; max-width: 350px !important; }
            .smart-nav.mobile-active { width: 100vw !important; height: 100vh !important; border-radius: 0 !important; background: #000 !important; padding: 30px !important; justify-content: flex-start !important; align-items: center !important; }
            .nav-header { width: 100%; display: flex; justify-content: space-between; align-items: center; }
            .nav-links { flex-direction: column; width: 100%; gap: 40px !important; margin-top: 40px; }
            .nav-item { font-size: 28px !important; }
            
            h1.page-title { font-size: 13vw; }
            .page-desc { font-size: 14px; padding: 0 20px; }
            
            .video-block { height: 100vh; } 
            
            /* Mobile 調整 */
            .yt-watch-btn { bottom: 15%; }
            .video-info-overlay { padding-bottom: 25%; }
        }
      `}</style>

      {/* Preloader */}
      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}>
          <span className="loader"></span>
      </div>

      <div className="noise-overlay"></div>

      <div className={`main-content ${!isLoading ? 'loaded' : ''}`}>
        <nav className="smart-nav" id="navbar" onClick={toggleMenu}>
            <div className="nav-header">
                <Link href="/" className="nav-logo">SAM CHOW.</Link>
                <div className="menu-icon" id="menu-btn">
                    <div className="menu-line"></div><div className="menu-line"></div><div className="menu-line"></div>
                </div>
            </div>
            <div className="nav-links">
              <Link href="/uiux" className="nav-item">UI/UX</Link>
              <Link href="/graphic" className="nav-item">Graphic</Link>
              <Link href="/3d" className="nav-item">3D</Link>
              <Link href="/photography" className="nav-item">Photography</Link>
              <Link href="/video" className="nav-item active">Video</Link>
              <Link href="/ai" className="nav-item">AI Generative</Link>
            </div>
        </nav>

        {/* Video Hero */}
        <div className="video-hero">
            <div className="video-bg">
                <iframe 
                    src="https://www.youtube.com/embed/2MvFryTKJoI?autoplay=1&mute=1&controls=0&loop=1&playlist=2MvFryTKJoI&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    title="Hero Video"
                ></iframe>
            </div>
            <div className="hero-overlay"></div>
            <div className="hero-content">
                <h1 className="page-title">Video</h1>
                <div className="page-desc">Motion, pacing, and storytelling through the timeline.</div>
            </div>
            <div className="scroll-prompt" id="scroll-prompt">
                <div className="scroll-text">SCROLL</div>
                <div className="scroll-line"></div>
            </div>
        </div>

        <div className="video-feed" id="video-feed">
            {videos.map((vid, index) => (
                <div key={index} className="video-block" id={`block-${index}`}>
                    <div className="video-wrapper">
                        <div id={`player-${index}`}></div>
                    </div>
                    {/* 只保留 WATCH ON YOUTUBE 區域 */}
                    <div className="video-info-overlay">
                        <a href={`https://www.youtube.com/watch?v=${vid.id}`} target="_blank" className="yt-watch-btn">
                            WATCH ON YOUTUBE
                        </a>
                    </div>
                </div>
            ))}
        </div>

        <div className={`contact-widget ${isContactExpanded ? 'expanded' : ''}`} id="contact-bubble" onClick={toggleContact}>
            <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
            <div className="contact-details">
                <a href="https://wa.me/85267012420" target="_blank" className="contact-link"><span className="label">WHATSAPP</span>6701 2420</a>
                <a href="mailto:chowfh254281@gmail.com" className="contact-link"><span className="label">MAIL</span>chowfh254281@gmail.com</a>
            </div>
        </div>
      </div>
    </>
  );
}