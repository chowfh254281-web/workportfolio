'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function PhotographyPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isContactExpanded, setIsContactExpanded] = useState(false);

  // Refs for animation targets
  const wrapperRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const row3Ref = useRef<HTMLDivElement>(null);
  const row4Ref = useRef<HTMLDivElement>(null);
  const row5Ref = useRef<HTMLDivElement>(null);
  const row6Ref = useRef<HTMLDivElement>(null);
  const row7Ref = useRef<HTMLDivElement>(null);
  const row8Ref = useRef<HTMLDivElement>(null);
  const row9Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); 

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    let lenis: any;
    let animationFrameId: number;

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

    const initDesktopAnimation = () => {
      const rows = [
        row1Ref.current, row2Ref.current, row3Ref.current, 
        row4Ref.current, row5Ref.current, row6Ref.current,
        row7Ref.current, row8Ref.current, row9Ref.current
      ];
      if (!rows[0]) return;

      let baseSpeed = 0.5; 
      let scrollVelocity = 0;
      let skewStrength = 0;
      const vw = window.innerWidth;
      const gap = 15;

      const oddRowWidth = (vw * 0.25 * 5) + (gap * 5); 
      const evenRowWidth = (vw * 0.60 * 5) + (gap * 5); 

      // 奇數行 (向左)
      let pos1 = 0, pos3 = 0, pos5 = 0, pos7 = 0, pos9 = 0; 
      // 偶數行 (向右)
      let pos2 = -evenRowWidth, pos4 = -evenRowWidth, pos6 = -evenRowWidth, pos8 = -evenRowWidth; 

      if (wrapperRef.current) wrapperRef.current.classList.add('loaded');
      let lastScrollY = window.scrollY;

      const animate = () => {
        const currentScrollY = window.scrollY; 
        const delta = currentScrollY - lastScrollY; 
        lastScrollY = currentScrollY;
        scrollVelocity += (delta * 0.1 - scrollVelocity) * 0.1;
        const speed = baseSpeed + (scrollVelocity * 2); 
        skewStrength += ((scrollVelocity * 2) - skewStrength) * 0.1;
        const safeSkew = Math.max(Math.min(skewStrength, 5), -5);

        // Move Left Rows (Odd)
        pos1 -= speed; pos3 -= speed; pos5 -= speed; pos7 -= speed; pos9 -= speed;
        if (pos1 <= -oddRowWidth) pos1 += oddRowWidth;
        if (pos3 <= -oddRowWidth) pos3 += oddRowWidth;
        if (pos5 <= -oddRowWidth) pos5 += oddRowWidth;
        if (pos7 <= -oddRowWidth) pos7 += oddRowWidth;
        if (pos9 <= -oddRowWidth) pos9 += oddRowWidth;

        // Move Right Rows (Even)
        pos2 += speed; pos4 += speed; pos6 += speed; pos8 += speed;
        if (pos2 >= 0) pos2 -= evenRowWidth;
        if (pos4 >= 0) pos4 -= evenRowWidth;
        if (pos6 >= 0) pos6 -= evenRowWidth;
        if (pos8 >= 0) pos8 -= evenRowWidth;

        const transformStr = (pos: number) => `translate3d(${pos.toFixed(2)}px, 0, 0) skewX(${safeSkew.toFixed(2)}deg)`;
        if(rows[0]) rows[0].style.transform = transformStr(pos1);
        if(rows[1]) rows[1].style.transform = transformStr(pos2);
        if(rows[2]) rows[2].style.transform = transformStr(pos3);
        if(rows[3]) rows[3].style.transform = transformStr(pos4);
        if(rows[4]) rows[4].style.transform = transformStr(pos5);
        if(rows[5]) rows[5].style.transform = transformStr(pos6);
        if(rows[6]) rows[6].style.transform = transformStr(pos7);
        if(rows[7]) rows[7].style.transform = transformStr(pos8);
        if(rows[8]) rows[8].style.transform = transformStr(pos9);
        
        animationFrameId = requestAnimationFrame(animate);
      };
      animate();
      return () => cancelAnimationFrame(animationFrameId);
    };

    const handleResize = () => {
        if (window.innerWidth > 768) initDesktopAnimation();
    };

    if (window.innerWidth > 768) initDesktopAnimation();
    window.addEventListener('resize', handleResize);

    const navbar = document.getElementById('navbar');
    const contactBubble = document.getElementById('contact-bubble');
    
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        if (scrollY > 50) {
            if (navbar && !navbar.classList.contains('mobile-active')) navbar.classList.add('collapsed');
        } else {
            navbar?.classList.remove('collapsed');
            navbar?.classList.remove('force-expand');
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
      if (lenis) lenis.destroy();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading]);

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

  const toggleContact = () => setIsContactExpanded(!isContactExpanded);

  return (
    <>
      {/* @ts-ignore */}
      <style jsx global>{`
        * { box-sizing: border-box; }
        body { text-rendering: optimizeLegibility; -webkit-font-smoothing: antialiased; margin: 0; padding: 0; color: #fff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #050505; min-height: 100vh; overflow-x: hidden; }
        
        /* Preloader */
        .preloader { position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background-color: #000; z-index: 9999; display: flex; align-items: center; justify-content: center; transition: opacity 0.8s ease; pointer-events: none; }
        .preloader.hidden { opacity: 0; }
        .loader { width: 48px; height: 48px; border: 3px solid rgba(244, 208, 63, 0.2); border-radius: 50%; display: inline-block; position: relative; animation: rotation 1s linear infinite; }
        .loader::after { content: ''; box-sizing: border-box; position: absolute; left: 0; top: 0; background: #F4D03F; width: 12px; height: 12px; transform: translate(-50%, 50%); border-radius: 50%; }
        @keyframes rotation { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .main-content-wrapper { opacity: 0; visibility: hidden; transition: opacity 1s ease-in-out; }
        .main-content-wrapper.loaded { opacity: 1; visibility: visible; }

        /* Navbar Style */
        .smart-nav { position: fixed; top: 30px; left: 50%; transform: translateX(-50%); padding: 0 30px; display: flex; align-items: center; justify-content: space-between; z-index: 2000; background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(10px); border-radius: 50px; border: 1px solid rgba(255,255,255,0.1); width: auto; min-width: 450px; height: 60px; transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1); overflow: hidden; cursor: pointer; }
        .nav-header { display: contents; }
        .nav-logo { font-weight: 900; letter-spacing: -1px; font-size: 18px; text-decoration: none; color: #fff; white-space: nowrap; margin-right: auto; order: 1; }
        .nav-links { display: flex; gap: 25px; align-items: center; overflow: hidden; transition: all 0.5s ease; max-width: 900px; order: 2; margin: 0 40px; }
        
        .nav-item { text-decoration: none; color: #fff; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; transition: color 0.3s ease; white-space: nowrap; position: relative; }
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

        .header-section { padding: 220px 40px 100px 40px; text-align: center; position: relative; z-index: 10; }
        h1.page-title { font-size: 80px; font-weight: 900; margin: 0; line-height: 1; letter-spacing: -2px; color: #fff; }
        .page-desc { margin-top: 20px; font-size: 16px; color: #888; max-width: 600px; display: inline-block; }
        
        .kinetic-wrapper { position: relative; width: 100%; overflow: hidden; padding-bottom: 200px; display: flex; flex-direction: column; gap: 15px; }
        .gallery-strip { display: flex; gap: 15px; width: max-content; transform: translate3d(0, 0, 0); will-change: transform; backface-visibility: hidden; perspective: 1000px; }
        
        /* 🔴 Aspect Ratio 設定 */
        /* 預設為直度 (Portrait 9:16) */
        .strip-item { flex-shrink: 0; width: 25vw; aspect-ratio: 9 / 16; position: relative; border-radius: 8px; overflow: hidden; background-color: #111; transform: translateZ(0); }
        
        /* 指定雙數行為橫度 (Landscape 16:9) */
        #row-2 .strip-item, #row-4 .strip-item, #row-6 .strip-item, #row-8 .strip-item { width: 60vw; aspect-ratio: 16 / 9; }
        
        .strip-item img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.9); transition: 0.3s ease; display: block; }
        .strip-item:hover img { filter: brightness(1.1); transform: scale(1.05); }
        .strip-caption { position: absolute; bottom: 20px; left: 20px; font-size: 2vw; font-weight: 700; color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.5); z-index: 2; }

        .contact-widget { 
            position: fixed; bottom: 30px; right: 30px; z-index: 2500; display: flex; align-items: center; 
            background: rgba(255, 255, 255, 0.08); backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
            border: 1px solid rgba(255,255,255,0.15); border-radius: 50px; padding: 6px; 
            width: auto; max-width: 52px; height: 52px; box-sizing: border-box; overflow: hidden; 
            transition: max-width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background 0.3s ease, box-shadow 0.3s ease, padding-right 0.6s ease; 
            cursor: pointer; 
        }
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

        /* MOBILE ADAPTATION */
        @media (max-width: 768px) {
            .header-section { padding-top: 150px; }
            .smart-nav { flex-direction: column !important; width: 90% !important; max-width: 350px !important; height: 60px; }
            .nav-header { width: 100%; display: flex; justify-content: space-between; align-items: center; }
            .smart-nav.mobile-active { width: 100vw !important; height: 100vh !important; background: #000 !important; top: 0 !important; border-radius: 0 !important; }
            .nav-links { flex-direction: column; height: 100%; justify-content: center; gap: 40px !important; }
            .nav-item { font-size: 28px !important; }
            .gallery-strip { flex-direction: column; width: 100%; transform: none !important; align-items: center; gap: 40px; }
            
            /* 在手機上所有圖片取消強制比例，適應圖片原本大小 */
            .strip-item, #row-2 .strip-item, #row-4 .strip-item, #row-6 .strip-item, #row-8 .strip-item { width: 100% !important; aspect-ratio: auto !important; }
            .strip-item img { height: auto; }
            .strip-item.duplicate { display: none; }
        }
      `}</style>

      <div className={`preloader ${!isLoading ? 'hidden' : ''}`}>
          <span className="loader"></span>
      </div>

      <div className={`main-content-wrapper ${!isLoading ? 'loaded' : ''}`}>
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
              <Link href="/photography" className="nav-item active">Photography</Link>
              <Link href="/video" className="nav-item">Video</Link>
              <Link href="/ai" className="nav-item">AI Generative</Link>
            </div>
        </nav>

        <div className="header-section">
            <h1 className="page-title">Photography</h1>
            <div className="page-desc">Capturing the world, one frame at a time.</div>
        </div>

        <div className="kinetic-wrapper" id="kinetic-wrapper" ref={wrapperRef}>
            
            {/* 🟢 直度相片區 (Portrait 9:16) - Row 1, 3, 5, 7, 9 */}
            
            {/* ROW 1 (直度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-1" ref={row1Ref}>
                    {["DSC00127", "DSC03905", "DSC04688", "DSC06114", "DSC02991"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 1).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00127", "DSC03905", "DSC04688", "DSC06114", "DSC02991"].map((img, i) => (
                        <div key={`d1-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 2 (橫度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-2" ref={row2Ref}>
                    {["DSC00672", "DSC04087", "DSC08718", "DSC05456", "DSC00709"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 6).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00672", "DSC04087", "DSC08718", "DSC05456", "DSC00709"].map((img, i) => (
                        <div key={`d2-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 3 (直度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-3" ref={row3Ref}>
                    {["DSC00133", "DSC03919", "DSC05608", "DSC07850", "DSC02995"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 11).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00133", "DSC03919", "DSC05608", "DSC07850", "DSC02995"].map((img, i) => (
                        <div key={`d3-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 4 (橫度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-4" ref={row4Ref}>
                    {["DSC00765", "DSC04102", "DSC08748", "DSC08358", "DSC03300"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 16).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00765", "DSC04102", "DSC08748", "DSC08358", "DSC03300"].map((img, i) => (
                        <div key={`d4-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 5 (直度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-5" ref={row5Ref}>
                    {["DSC00327", "DSC03959", "DSC05664", "DSC09908", "DSC03011"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 21).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00327", "DSC03959", "DSC05664", "DSC09908", "DSC03011"].map((img, i) => (
                        <div key={`d5-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 6 (橫度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-6" ref={row6Ref}>
                    {["DSC03382", "DSC04119", "DSC08760", "DSC08810", "DSC09492"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 26).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC03382", "DSC04119", "DSC08760", "DSC08810", "DSC09492"].map((img, i) => (
                        <div key={`d6-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 7 (直度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-7" ref={row7Ref}>
                    {["DSC00362", "DSC03982", "DSC05863", "DSC09480", "DSC03014"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 31).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00362", "DSC03982", "DSC05863", "DSC09480", "DSC03014"].map((img, i) => (
                        <div key={`d7-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 8 (橫度) - 重用了一些舊相片來填滿橫向行 */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-8" ref={row8Ref}>
                    {["DSC04391", "DSC04662-2", "DSC00672", "DSC04087", "DSC08718"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 36).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC04391", "DSC04662-2", "DSC00672", "DSC04087", "DSC08718"].map((img, i) => (
                        <div key={`d8-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>

            {/* ROW 9 (直度) */}
            <div className="mobile-track">
                <div className="gallery-strip" id="row-9" ref={row9Ref}>
                    {["DSC00380", "DSC04086", "DSC05864", "DSC09482", "DSC03064"].map((img, i) => (
                        <div key={i} className="strip-item"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /><div className="strip-caption">{String(i + 41).padStart(2, '0')}</div></div>
                    ))}
                    {["DSC00380", "DSC04086", "DSC05864", "DSC09482", "DSC03064"].map((img, i) => (
                        <div key={`d9-${i}`} className="strip-item duplicate"><img src={`/images/photography_images_optimized/${img}.jpg`} alt={img} /></div>
                    ))}
                </div>
            </div>
        </div>

        <div 
            className={`contact-widget ${isContactExpanded ? 'expanded' : ''}`} 
            id="contact-bubble"
            onClick={toggleContact}
        >
            <div className="contact-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg></div>
            <div className="contact-details">
                <a href="https://wa.me/85267012420" target="_blank" className="contact-link" style={{ color: '#fff' }}><span className="label">WHATSAPP</span>6701 2420</a>
                <a href="mailto:chowfh254281@gmail.com" className="contact-link" style={{ color: '#fff' }}><span className="label">MAIL</span>chowfh254281@gmail.com</a>
            </div>
        </div>
      </div>
    </>
  );
}